import client from '@/libs/prismadb';
import { getSession } from '@/actions/getSession';
import { User } from '@prisma/client';

export const getUsers = async (): Promise<User[]> => {
  const session = await getSession();
  if (!session?.user?.email) return [];

  try {
    return await client.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        NOT: {
          email: session.user.email,
        },
      },
    });
  } catch (e) {
    return [];
  }
};
