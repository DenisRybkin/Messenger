'use client';

import { DesktopSidebar } from '@/components/sidebar/desktop/DesktopSidebar';
import { MobileFooter } from '@/components/sidebar/mobile/MobileFooter';
import { User } from '@prisma/client';
import { useState } from 'react';
import { SettingsModal } from '@/components/sidebar/SettingsModal';

interface SidebarProps {
  children: React.ReactNode;
  currentUser: User | null;
}

export const Sidebar = (props: SidebarProps) => {
  const [isOpenSettingsModal, setIsOpenSettingsModal] =
    useState<boolean>(false);

  const handleOpenSettingsModal = () => setIsOpenSettingsModal(true);

  const handleCloseSettingsModal = () => setIsOpenSettingsModal(false);

  return (
    <>
      <SettingsModal
        currentUser={props.currentUser}
        isOpen={isOpenSettingsModal}
        onClose={handleCloseSettingsModal}
      />
      <div className="h-full">
        <DesktopSidebar
          onOpenSettingsModal={handleOpenSettingsModal}
          currentUser={props.currentUser}
        />
        <MobileFooter
          onOpenSettingsModal={handleOpenSettingsModal}
          currentUser={props.currentUser}
        />
        <main className="lg:pl-20 h-full">{props.children}</main>
      </div>
    </>
  );
};
