'use client';

import { Popover, Transition } from '@headlessui/react';
import { Fragment, ReactElement } from 'react';
import clsx from 'clsx';

export interface PopupProps<T extends object | undefined> {
  children: React.ReactNode;
  content: (props: { onClose: () => void } & T) => JSX.Element;
  padding?: number;
  contentProps: T;
}

export function Popup<CP extends object | undefined>(props: PopupProps<CP>) {
  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={clsx('shadow-white flex', open && 'primary-children')}
          >
            {props.children}
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel
              className="absolute z-10 rounded-lg mt-3 bottom-12 -right-8
            md:right-0 bg-white transform  sm:px-0 lg:max-w-3xl"
            >
              <div
                className={`overflow-hidden shadow-lg p-${props.padding ?? 3}`}
              >
                {props.content({ onClose: close, ...props.contentProps })}
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
