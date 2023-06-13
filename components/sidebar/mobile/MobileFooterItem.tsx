'use client';

import {
  INavRoute,
  useNavRoutes,
} from '@/components/sidebar/hooks/useNavRoutes';
import { useConversation } from '@/hooks/useConversation';
import Link from 'next/link';
import clsx from 'clsx';

interface MobileFooterItemProps extends INavRoute {}

export const MobileFooterItem = (props: MobileFooterItemProps) => {
  const handleClick = () => props.onClick?.();

  return (
    <Link
      onClick={handleClick}
      href={props.href}
      className={clsx(
        'transition group flex gap-x-3 text-sm leading-6 font-semibold w-full ' +
          'justify-center p-3 text-gray-500 hover:text-sky-400 hover:bg-gray-100 hover:rounded-md',
        props.active && 'text-sky-500'
      )}
    >
      {props.icon({ className: 'h-6 w-6' })}
    </Link>
  );
};
