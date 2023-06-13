import client from '@/libs/prismadb';
import { getCurrentUser } from '@/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import { pusherServer } from '@/libs/pusher';
import { PusherKeys } from '@/app/keys/pusherKeys';

export const POST = async (request: Request) => {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { message, image, conversationId } = body;

    if (!currentUser?.id || !currentUser?.email)
      return new NextResponse('Unauthorized', { status: 401 });

    const newMessage = await client.message.create({
      include: {
        seen: true,
        sender: true,
      },
      data: {
        body: message,
        image: image,
        conversation: {
          connect: { id: conversationId },
        },
        sender: {
          connect: { id: currentUser.id },
        },
      },
    });

    const updatedConversation = await client.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    await pusherServer.trigger(
      conversationId,
      PusherKeys.NEW_MESSAGE,
      newMessage
    );

    updatedConversation.users.forEach(user =>
      pusherServer.trigger(user.email!, PusherKeys.UPDATE_CONVERSATION, {
        id: conversationId,
        messages: [updatedConversation.messages.at(-1)],
      })
    );

    return NextResponse.json(newMessage);
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES');
    return new NextResponse('Error', { status: 500 });
  }
};
