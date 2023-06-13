import { getCurrentUser } from '@/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import client from '@/libs/prismadb';
import { pusherServer } from '@/libs/pusher';
import { PusherKeys } from '@/app/keys/pusherKeys';

interface IParams {
  conversationId?: string;
}

export const DELETE = async (
  request: Request,
  { params }: { params: IParams }
) => {
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) return NextResponse.json(null);

    const existingConversation = await client.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    if (!existingConversation) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    const deletedConversation = await client.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    existingConversation.users.forEach(
      user =>
        user.email &&
        pusherServer.trigger(
          user.email,
          PusherKeys.REMOVE_CONVERSATION,
          existingConversation
        )
    );

    return NextResponse.json(deletedConversation);
  } catch (error) {
    console.log(error, 'ERROR_CONVERSATION_DELETE');
    return new NextResponse('Internal Error', { status: 500 });
  }
};
