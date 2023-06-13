import { NextResponse } from 'next/server';
import client from '@/libs/prismadb';
import { getCurrentUser } from '@/actions/getCurrentUser';
import { pusherServer } from '@/libs/pusher';
import { PusherKeys } from '@/app/keys/pusherKeys';
interface IParams {
  conversationId?: string;
}

export const POST = async (
  request: Request,
  { params }: { params: IParams }
) => {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    const body = await request.json();

    const { messageId } = body;

    if (!currentUser?.id || !currentUser?.email)
      return new NextResponse('Unauthorized', { status: 401 });

    if (!messageId)
      return new NextResponse('Invalid message ID', { status: 400 });

    const updatedMessage = await client.message.update({
      where: {
        id: messageId,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    await pusherServer.trigger(
      conversationId!,
      PusherKeys.UPDATE_CONVERSATION,
      {
        id: conversationId,
        messages: [updatedMessage],
      }
    );

    /*
    if (currentUser.id == updatedMessage.senderId)
      return NextResponse.json(updatedMessage);
*/

    await pusherServer.trigger(
      conversationId!,
      PusherKeys.UPDATE_MESSAGE,
      updatedMessage
    );

    return new NextResponse('Success');
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES_SEEN_BY_ID');
    return new NextResponse('Error', { status: 500 });
  }
};

/*
export const POST = async (
  request: Request,
  { params }: { params: IParams }
) => {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    if (!currentUser?.id || !currentUser?.email)
      return new NextResponse('Unauthorized', { status: 401 });

    const conversation = await client.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });

    if (!conversation) return new NextResponse('Invalid ID', { status: 400 });

    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastMessage) return NextResponse.json(conversation);

    const updatedMessage = await client.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    if (lastMessage.seenIds.indexOf(currentUser.id) != -1)
      return NextResponse.json(conversation);

    return new NextResponse('Success');
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES_SEEN');
    return new NextResponse('Error', { status: 500 });
  }
};
*/
