'use client';

import { useNavRoutes } from '@/components/sidebar/hooks/useNavRoutes';
import { useConversation } from '@/hooks/useConversation';
import { MobileFooterItem } from '@/components/sidebar/mobile/MobileFooterItem';
import { User } from '@prisma/client';
import { Avatar } from '@/components/base/Avatar';

interface MobileFooterProps {
  currentUser: User | null;
  onOpenSettingsModal: () => void;
}
export const MobileFooter = (props: MobileFooterProps) => {
  const routes = useNavRoutes();
  const { isOpen } = useConversation();

  if (isOpen) return null;

  return (
    <div className="fixed justify-between w-full bottom-0 z-40 flex items-center bg-white border-t-[1px] lg:hidden">
      {routes.map(route => (
        <MobileFooterItem key={route.href} {...route} />
      ))}
      <div
        onClick={props.onOpenSettingsModal}
        className="group flex gap-x-3 text-sm leading-6 font-semibold w-full justify-center p-3"
      >
        <Avatar size="sm" user={props.currentUser} />
      </div>
    </div>
  );
};
