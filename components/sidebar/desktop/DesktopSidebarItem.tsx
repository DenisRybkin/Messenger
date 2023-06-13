'use client';

import { INavRoute } from '../hooks/useNavRoutes';
import Link from 'next/link';
import clsx from 'clsx';

interface DesktopSidebarItemProps extends INavRoute {}

export const DesktopSidebarItem = (props: DesktopSidebarItemProps) => {
  const handleClick = () => props.onClick?.();

  return (
    <li onClick={handleClick}>
      <Link
        className={clsx(
          'group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold ' +
            'text-gray-500 hover:text-sky-400 hover:bg-gray-100 transition',
          props.active && 'bg-gray-100 text-sky-500'
        )}
        href={props.href}
      >
        {props.icon({ className: 'h-6 w-6 shrink-0' })}
        <span className="sr-only">{props.label}</span>
      </Link>
    </li>
  );
};
