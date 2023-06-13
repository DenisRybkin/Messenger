'use client';

import { User } from '@prisma/client';
import Image from 'next/image';
import clsx from 'clsx';
import { useOnlineList } from '@/store/hooks/useOnlineList';

interface AvatarGroupProps {
  big?: boolean;
  users?: User[];
}

export const AvatarGroup = (props: AvatarGroupProps) => {
  const { memberIds } = useOnlineList();
  const slicedUsers = (props.users ?? [])
    .sort(user => (memberIds.includes(user.email!) ? -1 : 1))
    .slice(0, 4);

  const positionMap = {
    0:
      `top-0 ` +
      (slicedUsers.length == 4
        ? 'left-0'
        : props.big
        ? slicedUsers.length == 3
          ? 'left-8'
          : 'left-0'
        : 'left-[12px]'),
    1: 'bottom-0',
    2: 'bottom-0 right-0',
    3: 'top-0 right-0',
  };

  return (
    <div className={clsx('relative h-11 w-11', props.big && 'h-32 w-32')}>
      {slicedUsers.map((user, index) => (
        <div
          key={user.id}
          className={clsx(
            `absolute inline-block rounded-full h-[21px] w-[21px]
            ${positionMap[index as keyof typeof positionMap]}
          `,
            props.big && 'h-[61px] w-[61px]'
          )}
        >
          <Image
            fill
            className="rounded-full object-cover"
            src={user?.image || '/images/placeholder.jpg'}
            alt="Avatar"
          />
          {memberIds.includes(user.email!) && (
            <span
              className={clsx(
                'absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-1.5 w-1.5',
                props.big && 'top-0 right-0 h-3 w-3 md:h-4 md:w-4'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};
