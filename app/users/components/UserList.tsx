'use client';

import { User } from '@prisma/client';
import { UserBox } from '@/app/users/components/UserBox';

interface UserListProps {
  items: User[];
}

export const UserList = (props: UserListProps) => {
  return (
    <aside
      className="fixed inset-y-0 pb-16 lg:pb-0 lg:left-20 lg:w-80 h-full w-full
      lg:block overflow-y-auto border-r border-gray-200 block left-0"
    >
      <div className="px-5">
        <div className="flex-col">
          <div className="text-2xl font-bold text-neutral-800 py-5">People</div>
        </div>
        {props.items.map(item => (
          <UserBox key={item.id} data={item} />
        ))}
      </div>
    </aside>
  );
};
