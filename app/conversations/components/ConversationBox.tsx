'use client';

import { FullConversationType } from '@/types';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useContext, useMemo } from 'react';
import { format, formatDistance } from 'date-fns';
import clsx from 'clsx';
import { Avatar } from '@/components/base/Avatar';
import { AvatarGroup } from '@/components/base/AvatarGroup';
import { useOtherUser } from '@/app/conversations/hooks/useOtherUser';
import { AuthContext } from '@/providers/auth-provider/AuthProvider';

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}

export const ConversationBox = (props: ConversationBoxProps) => {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const otherUser = useOtherUser(props.data);

  const handleClick = () =>
    router.push(`/conversations${props.selected ? '' : '/' + props.data.id}`);

  const lastMessage = useMemo(
    () => (props.data.messages ?? []).at(-1),
    [props.data.messages]
  );

  const userEmail = useMemo(() => user?.email, [user?.email]);

  const hasSeen = useMemo(
    () =>
      !userEmail || !lastMessage
        ? false
        : (lastMessage.seen ?? []).filter(user => user.email != userEmail)
            .length != 0,
    [userEmail, lastMessage]
  );

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) return 'Sent an image';
    if (lastMessage?.body) return lastMessage?.body;
    return 'Started a conversation';
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        'w-full relative flex items-center space-x-3 p-3 ' +
          'hover:bg-neutral-100 rounded-lg transition cursor-pointer',
        props.selected ? 'bg-neutral-100' : 'bg-white'
      )}
    >
      {props.data.isGroup ? (
        <AvatarGroup users={props.data.users} />
      ) : (
        <Avatar user={otherUser} />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-medium text-gray-900">
              {props.data.name ?? otherUser.name}
            </p>
            {lastMessage?.createdAt && (
              <p className="text-xs text-gray-400 font-light text-end">
                {formatDistance(new Date(lastMessage.createdAt), new Date(), {
                  addSuffix: true,
                })}
              </p>
            )}
          </div>
          <p
            className={clsx(
              'truncate text-sm',
              hasSeen ? 'text-gray-500' : 'text-black font-medium'
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};
