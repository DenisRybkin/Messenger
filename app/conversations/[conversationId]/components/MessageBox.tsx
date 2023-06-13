'use client';

import Linkify from 'react-linkify';
import clsx from 'clsx';
import Image from 'next/image';
import {
  useState,
  useMemo,
  useEffect,
  useRef,
  LegacyRef,
  useContext,
} from 'react';
import { formatDistance } from 'date-fns';
import { MessageWithUsersType } from '@/types';
import { Avatar } from '@/components/base/Avatar';
import { useConversation } from '@/hooks/useConversation';
import { useViewportObserver } from '@/hooks/useViewportObserver';
import { ImageModal } from '@/app/conversations/[conversationId]/components/ImageModal';
import { AuthContext } from '@/providers/auth-provider/AuthProvider';

interface MessageBoxProps {
  data: MessageWithUsersType;
  isLastToSeen?: boolean;
  isGroup: boolean;
  onSeenMessage: (messageId: string) => Promise<void>;
}

export const MessageBox = (props: MessageBoxProps) => {
  const triggerRef = useRef<Element | undefined>();
  const { isVisible } = useViewportObserver(triggerRef);
  const { conversationId } = useConversation();
  const { user } = useContext(AuthContext);

  const [isOpenImageModal, setIsOpenImageModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isOwn = useMemo(
    () => user?.email == props.data?.sender?.email,
    [props.data?.id, user?.email]
  );

  const seenList = (props.data.seen || [])
    .filter(user => user.email != props.data?.sender?.email)
    .map(user => user.name)
    .join(', ');

  const hasSeenByMe = useMemo(
    () =>
      user?.email
        ? props.data.seen.some(viewed => viewed.email == user?.email)
        : true,
    [props.data.seen, user?.email]
  );

  const containerClasses = clsx('flex gap-3 p-4', isOwn && 'justify-end');
  const avatarClasses = clsx(isOwn && 'order-2');
  const bodyClasses = clsx('flex flex-col gap-2', isOwn && 'items-end');
  const messageClasses = clsx(
    'text-sm w-fit overflow-hidden',
    isOwn ? 'bg-sky-500 text-white' : 'bg-gray-100',
    props.data.image ? 'rounded-md p-0' : 'rounded-[18px] py-2 px-3'
  );

  const handleOpenImageModal = () => setIsOpenImageModal(true);
  const handleCloseImageModal = () => setIsOpenImageModal(false);

  const handleSeenMessage = async () => {
    if (!hasSeenByMe && isVisible && !isLoading) {
      setIsLoading(true);
      await props.onSeenMessage(props.data.id);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSeenMessage();
  }, [conversationId, hasSeenByMe, isVisible]);

  return (
    <div
      ref={triggerRef as LegacyRef<HTMLDivElement>}
      className={containerClasses}
    >
      <div className={avatarClasses}>
        <Avatar user={props.data.sender} />
      </div>
      <div className={bodyClasses}>
        <div className="flex items-center gap-1">
          {props.isGroup && (
            <div className="text-sm text-gray-500">
              {props.data.sender.name}
            </div>
          )}
          <div className="text-xs text-gray-400">
            {formatDistance(new Date(props.data.createdAt), new Date(), {
              addSuffix: true,
            })}
          </div>
        </div>
        <div className={messageClasses}>
          <ImageModal
            src={props.data.image}
            isOpen={isOpenImageModal}
            onClose={handleCloseImageModal}
          />
          {props.data.image ? (
            <Image
              alt="Image"
              height="288"
              width="288"
              onClick={handleOpenImageModal}
              src={props.data.image}
              className="object-cover cursor-pointer hover:scale-110 transition translate"
            />
          ) : (
            <div
              className={`linkify whitespace-pre-line ${
                isOwn && 'linkify--white'
              }`}
            >
              <Linkify>{props.data.body}</Linkify>
            </div>
          )}
        </div>
        {props.isLastToSeen && isOwn && seenList.length > 0 && (
          <div className="text-xs font-light text-gray-500">
            {`Seen by ${seenList}`}
          </div>
        )}
      </div>
    </div>
  );
};
