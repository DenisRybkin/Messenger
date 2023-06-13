import { useContext, useMemo } from 'react';
import { FullConversationType } from '@/types';
import { User } from '@prisma/client';
import { AuthContext } from '@/providers/auth-provider/AuthProvider';

export const useOtherUser = (
  conversation: FullConversationType | { users: User[] }
): User => {
  const { user } = useContext(AuthContext);

  return useMemo(() => {
    const currentUserEmail = user?.email;

    const otherUser = conversation.users.filter(
      user => user.email != currentUserEmail
    );

    return otherUser[0];
  }, [user?.email, conversation.users]);
};
