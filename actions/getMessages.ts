import client from '@/libs/prismadb';
import { Message } from '@prisma/client';
import { MessageWithUsersType } from '@/types';

export const getMessages = async (
  conversationId: string
): Promise<MessageWithUsersType[]> => {
  try {
    return (
      await client.message.findMany({
        take: 25,
        where: {
          conversationId,
        },
        include: {
          sender: true,
          seen: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    ).reverse();
  } catch (e) {
    return [];
  }
};
