'use client';

import Image from 'next/image';

interface EmptyItemsProps {
  text: string;
}

export const EmptyItems = (props: EmptyItemsProps) => {
  return (
    <div className="grid w-full place-items-center h-[90%]">
      <div className="flex flex-col items-center">
        <div className="w-60 h-40 relative">
          <Image fill src="/images/empty.png" alt="Avatar" />
        </div>
        <h2 className="mt-6 text-md font-medium text-gray-900">{props.text}</h2>
      </div>
    </div>
  );
};
