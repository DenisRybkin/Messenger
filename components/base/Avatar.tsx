'use client';

import { User } from '@prisma/client';

//import useOnlineList from '../hooks/useOnlineList';
import Image from 'next/image';
import clsx from 'clsx';
import { useOnlineList } from '@/store/hooks/useOnlineList';

export type AvatarSizeType = 'sm' | 'md' | 'lg';

interface AvatarProps {
  size?: AvatarSizeType;
  user: User | null;
  withoutOnlineIndicator?: boolean;
  onClick?: () => void;
}
export const Avatar = (props: AvatarProps) => {
  const { memberIds } = useOnlineList();

  const isOnline = memberIds.some(email => email == props.user?.email);

  const size = props.size ?? 'md';

  return (
    <div
      onClick={props.onClick}
      className={clsx('relative', props.onClick && 'cursor-pointer')}
    >
      <div
        className={clsx(
          'relative rounded-full overflow-hidden',
          size == 'md' && 'h-9 w-9 md:h-11 md:w-11',
          size == 'sm' && 'h-7 w-7',
          size == 'lg' && 'h-32 w-32'
        )}
      >
        <Image
          fill
          src={props.user?.image || '/images/placeholder.jpg'}
          alt="Avatar"
        />
      </div>
      {!props.withoutOnlineIndicator && isOnline && (
        <span
          className={clsx(
            'absolute block rounded-full bg-green-500 ring-2 ring-white',
            size == 'md' && 'top-0 right-0 h-2 w-2 md:h-3 md:w-3',
            size == 'lg' && 'top-2 right-2 h-4 w-4 md:h-5 md:w-5'
          )}
        />
      )}
    </div>
  );
};
