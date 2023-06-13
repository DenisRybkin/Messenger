import { getCurrentUser } from '@/actions/getCurrentUser';
import client from '@/libs/prismadb';
import { FullConversationType } from '@/types';

const getConversations = async (): Promise<FullConversationType[]> => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) return [];

  try {
    return await client.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc',
      },
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });
  } catch (error: any) {
    return [];
  }
};

export default getConversations;
