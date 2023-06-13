import { getCurrentUser } from '@/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import client from '@/libs/prismadb';
import { pusherServer } from '@/libs/pusher';
import { PusherKeys } from '@/app/keys/pusherKeys';

export const POST = async (request: Request) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !currentUser.email)
      return new NextResponse('Unauthorized', { status: 401 });

    const body = await request.json();
    const { userId, isGroup, members, name } = body;

    if (isGroup && (!members || members.length < 2 || !name))
      return new NextResponse('Invalid data', { status: 400 });

    if (isGroup) {
      const newConversation = await client.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        include: { users: true },
      });

      newConversation.users.forEach(
        user =>
          user.email &&
          pusherServer.trigger(
            user.email,
            PusherKeys.NEW_CONVERSATION,
            newConversation
          )
      );

      return NextResponse.json(newConversation);
    }

    const existingConversations = await client.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });

    const singleConversation = existingConversations[0];

    if (singleConversation) return NextResponse.json(singleConversation);

    const newConversation = await client.conversation.create({
      data: {
        users: {
          connect: [{ id: currentUser.id }, { id: userId }],
        },
      },
      include: {
        users: true,
      },
    });

    newConversation.users.forEach(
      user =>
        user.email &&
        pusherServer.trigger(
          user.email,
          PusherKeys.NEW_CONVERSATION,
          newConversation
        )
    );

    return NextResponse.json(newConversation);
  } catch (e) {
    return new NextResponse('Internal Error', { status: 500 });
  }
};
