'use client';

interface EmptyMessagesProps {
  isGroup: boolean;
}

export const EmptyMessages = (props: EmptyMessagesProps) => {
  return (
    <div className="grid place-items-center h-full">
      <div className="flex flex-col items-center">
        <h1 className="text-9xl">🥺</h1>
        <h2 className="mt-6 text-md font-medium text-gray-900">
          {`You haven't talked ${props.isGroup ? 'here' : 'to him'} yet?`}
        </h2>
        <h2 className="mt-6 text-md font-medium text-gray-900">So come on!</h2>
      </div>
    </div>
  );
};
