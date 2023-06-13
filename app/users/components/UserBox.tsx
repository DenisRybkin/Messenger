'use client';

import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import { Avatar } from '@/components/base/Avatar';
import { LoadingModal } from '@/components/LoadingModal';

interface UserBoxProps {
  data: User;
}

export const UserBox = (props: UserBoxProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = () => {
    setIsLoading(true);
    axios
      .post('/api/conversations', { userId: props.data.id })
      .then(data => router.push(`/conversations/${data.data.id}`))
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      {isLoading && <LoadingModal />}
      <div
        onClick={handleClick}
        className="w-full relative flex items-center space-x-3 bg-white
        p-3 hover:bg-neutral-100 rounded-lg transition cursor-pinter"
      >
        <Avatar user={props.data} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-gray-900">
                {props.data.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
