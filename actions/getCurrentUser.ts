import client from '@/libs/prismadb';

import { getSession } from '@/actions/getSession';
import { User } from '@prisma/client';

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const session = await getSession();

    if (!session?.user?.email) return null;

    return await client.user.findUnique({
      where: { email: session.user.email },
    });
  } catch (e) {
    return null;
  }
};
