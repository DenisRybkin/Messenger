import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useConversation } from '@/hooks/useConversation';
import { IconType } from 'react-icons';
import { FiHome, FiLogOut, FiMessageCircle, FiUsers } from 'react-icons/fi';

export interface INavRoute {
  label: string;
  href: string;
  icon: IconType;
  active: boolean;
  onClick?: () => void;
}

export const useNavRoutes = (): INavRoute[] => {
  const pathname = usePathname();
  const { conversationId } = useConversation();

  return useMemo(
    () => [
      {
        label: 'Chat',
        href: '/conversations',
        icon: FiMessageCircle,
        active: pathname == '/conversations' || !!conversationId,
      },
      {
        label: 'Users',
        href: '/users',
        icon: FiUsers,
        active: pathname == '/users',
      },
      {
        label: 'Logout',
        href: '#',
        active: false,
        icon: FiLogOut,
        onClick: () => signOut(),
      },
    ],
    [pathname, conversationId]
  );
};
