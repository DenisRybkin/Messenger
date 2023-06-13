'use client';

import React, { LegacyRef, useEffect, useRef } from 'react';

import { useViewportObserver } from '@/hooks/useViewportObserver';
import clsx from 'clsx';
import { Loader } from '@/components/base/Loader';

export interface ScrollTriggerProps {
  options?: IntersectionObserverInit;
  disabled?: boolean;
  hidden?: boolean;
  mt?: number | boolean;
  onClick?: () => void;
  onIntersection: () => void;
}

export const ViewTrigger = (props: ScrollTriggerProps) => {
  const triggerRef = useRef<Element | undefined>();
  const { isVisible } = useViewportObserver(triggerRef, props.options);

  const handleClick = () => props.onClick && props.onClick();

  useEffect(() => {
    isVisible && !props.disabled && props.onIntersection();
  }, [isVisible, props, props.disabled]);

  const classNames = clsx('w-full flex items-center justify-center', {
    hidden: props.hidden,
    'mt-5': !props.mt,
    [`mt-${props.mt}`]: !!props.mt,
  });

  return (
    <div className={classNames} ref={triggerRef as LegacyRef<HTMLDivElement>}>
      <Loader onClick={handleClick} />
    </div>
  );
};
