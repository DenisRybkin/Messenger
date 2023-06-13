'use client';

import { useNavRoutes } from '@/components/sidebar/hooks/useNavRoutes';
import { useState } from 'react';
import { DesktopSidebarItem } from '@/components/sidebar/desktop/DesktopSidebarItem';
import { User } from '@prisma/client';
import { Avatar } from '@/components/base/Avatar';

interface DesktopSidebarProps {
  currentUser: User | null;
  onOpenSettingsModal: () => void;
}

export const DesktopSidebar = (props: DesktopSidebarProps) => {
  const routes = useNavRoutes();

  return (
    <div
      className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:w-20 xl:px-6 lg:overflow-y-auto
       lg:bg-white lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col justify-between"
    >
      <nav className="mt-4 flex flex-col justify-between">
        <ul role="list" className="flex flex-col items-center space-y-1">
          {routes.map(item => (
            <DesktopSidebarItem key={item.label} {...item} />
          ))}
        </ul>
      </nav>
      <nav className="mt-4 flex flex-col justify-between items-center">
        <div
          onClick={props.onOpenSettingsModal}
          className="cursor-pointer hover:opacity-75 transition "
        >
          <Avatar user={props.currentUser} />
        </div>
      </nav>
    </div>
  );
};
