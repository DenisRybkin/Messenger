'use client';

import { SessionProvider } from 'next-auth/react';
import { User } from '@prisma/client';
import { createContext } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
  user: User | null;
}

interface IAuthProviderContext {
  user: User | null;
}

export const AuthContext = createContext<IAuthProviderContext>({ user: null });

export const AuthProvider = (props: AuthProviderProps) => {
  return (
    <AuthContext.Provider value={{ user: props.user }}>
      <SessionProvider>{props.children}</SessionProvider>
    </AuthContext.Provider>
  );
};
