'use client';

import { ConversationWithUsers } from '@/types';
import { useOtherUser } from '@/app/conversations/hooks/useOtherUser';
import { useContext, useMemo, useState } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiMoreHorizontal } from 'react-icons/fi';
import { Avatar } from '@/components/base/Avatar';
import { ProfileDrawer } from '@/app/conversations/[conversationId]/components/ProfileDrawer/ProfileDrawer';
import { ImageModal } from '@/app/conversations/[conversationId]/components/ImageModal';
import { AvatarGroup } from '@/components/base/AvatarGroup';
import { useOnlineList } from '@/store/hooks/useOnlineList';
import { AuthContext } from '@/providers/auth-provider/AuthProvider';

interface ConversationHeaderProps {
  conversation: ConversationWithUsers;
}

export const ConversationHeader = (props: ConversationHeaderProps) => {
  const otherUser = useOtherUser(props.conversation);
  const { memberIds } = useOnlineList();
  const { user } = useContext(AuthContext);

  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);

  const [isOpenImageModal, setIsOpenImageModal] = useState<boolean>(false);

  const isOnline = memberIds.some(email => email == otherUser.email);

  const statusText = useMemo(
    () =>
      props.conversation.isGroup
        ? `${props.conversation.users.length} members`
        : isOnline
        ? 'Online'
        : 'Offline',
    [props.conversation, isOnline]
  );

  const handleCloseDrawer = () => setIsOpenDrawer(false);
  const handleOpenDrawer = () => setIsOpenDrawer(true);

  const handleOpenImageModal = () => setIsOpenImageModal(true);
  const handleCloseImageModal = () => setIsOpenImageModal(false);

  return (
    <>
      <ImageModal
        src={otherUser.image!}
        isOpen={isOpenImageModal}
        onClose={handleCloseImageModal}
      />
      <ProfileDrawer
        isOpen={isOpenDrawer}
        data={props.conversation}
        onClose={handleCloseDrawer}
      />
      <div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
        <div className="flex gap-3 items-center">
          <Link
            href="/conversations"
            className="lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer"
          >
            <FiChevronLeft size={32} />
          </Link>
          {props.conversation.isGroup ? (
            <AvatarGroup users={props.conversation.users} />
          ) : (
            <Avatar onClick={handleOpenImageModal} user={otherUser} />
          )}
          <div className="flex flex-col">
            <div>{props.conversation.name ?? otherUser.name}</div>
            <div className="text-sm font-light text-neutral-500">
              {statusText}
            </div>
          </div>
        </div>
        <FiMoreHorizontal
          size={32}
          className="text-sky-500 cursor-pointer hover:text-sky-600 transition"
          onClick={handleOpenDrawer}
        />
      </div>
    </>
  );
};
