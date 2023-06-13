import client from '@/libs/prismadb';
import { getCurrentUser } from '@/actions/getCurrentUser';
import { ConversationWithUsers, FullConversationType } from '@/types';

export const getConversationById = async (
  conversationId: string
): Promise<ConversationWithUsers | null> => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) return null;

    return await client.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });
  } catch (e) {
    return null;
  }
};
