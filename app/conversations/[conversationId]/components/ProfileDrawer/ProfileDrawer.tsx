'use client';

import { ConversationWithUsers } from '@/types';
import { useOtherUser } from '@/app/conversations/hooks/useOtherUser';
import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Drawer, DrawerProps } from '@/components/base/Drawer';
import { Avatar } from '@/components/base/Avatar';
import { FiTrash2 } from 'react-icons/fi';
import { AvatarGroup } from '@/components/base/AvatarGroup';
import { ConfirmModal } from '@/app/conversations/[conversationId]/components/ProfileDrawer/ConfirmModal';
import { AttachmentsList } from '@/app/conversations/[conversationId]/components/ProfileDrawer/AttachmentsList';
import { useOnlineList } from '@/store/hooks/useOnlineList';

interface ProfileDrawerProps extends DrawerProps {
  data: ConversationWithUsers;
}

export const ProfileDrawer = (props: ProfileDrawerProps) => {
  const { memberIds } = useOnlineList();
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false);

  const otherUser = useOtherUser(props.data);
  const isOnline = memberIds.some(email => email == otherUser.email);

  const joinDate = useMemo(
    () => format(new Date(otherUser.createdAt), 'PP'),
    [otherUser.id]
  );

  const title = useMemo(
    () => props.data.name || otherUser.name,
    [props.data.id, otherUser.id]
  );

  const statusText = useMemo(
    () =>
      props.data.isGroup
        ? props.data.users.length + ' members'
        : isOnline
        ? 'Online'
        : 'Offline',
    [props.data.id]
  );

  const handleCloseConfirmModal = () => setIsOpenConfirmModal(false);
  const handleOpenConfirmModal = () => setIsOpenConfirmModal(true);

  return (
    <>
      <ConfirmModal
        isOpen={isOpenConfirmModal}
        onClose={handleCloseConfirmModal}
      />
      <Drawer isOpen={props.isOpen} onClose={props.onClose}>
        <div className="relative w-[374px] mt-6 flex-1 px-4 sm:px-6">
          <div className="flex h-full flex-col items-center">
            <div className="mb-2">
              {props.data.isGroup ? (
                <AvatarGroup big users={props.data.users} />
              ) : (
                <Avatar size="lg" user={otherUser} />
              )}
            </div>
            <div>{title}</div>
            <div className="text-sm text-gray-500">{statusText}</div>
            <div className="flex gap-10 my-8">
              <div
                onClick={handleOpenConfirmModal}
                className="flex flex-col gap-3 items-center cursor-pointer text-neutral-600 hover:text-red-500 transition"
              >
                <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                  <FiTrash2 size={20} />
                </div>
                <div className="text-sm font-light text-neutral-600">
                  Delete
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col flex-1 pb-5 pt-5 sm:px-0 sm:pt-0">
              <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                {props.data.isGroup && (
                  <div>
                    <dt className="text-sm font-medium text-gray-600 sm:w-40 sm:flex-shrink-0">
                      Emails
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                      {props.data.users.map(user => (
                        <>
                          {user.email} <br />
                        </>
                      ))}
                    </dd>
                  </div>
                )}
                {!props.data.isGroup ? (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                      Email
                    </dt>
                    <dd className="mt-1 text:sm text-gray-900 sm:col-span-2">
                      {otherUser.email}
                    </dd>
                  </div>
                ) : (
                  <>
                    <hr />
                    <div>
                      <dt className="text-sm font-medium text-gray-500 sm:flex-shrink-0">
                        Joined
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                        <time dateTime={joinDate}>{joinDate}</time>
                      </dd>
                    </div>
                  </>
                )}
                <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                  Attachments
                </dt>
              </dl>
              <AttachmentsList isOpenDrawer={props.isOpen} />
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};
