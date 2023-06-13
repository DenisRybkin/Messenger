import { MutableRefObject, useEffect, useRef, useState } from 'react';

interface IUseViewportObserver {
  isVisible: boolean;
}

const defaultObserverOptionsInit: IntersectionObserverInit = {
  root: null,
  threshold: 1,
};

export const useViewportObserver = <T>(
  triggerRef: MutableRefObject<Element | undefined>,
  options?: IntersectionObserverInit
): IUseViewportObserver => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const observer: IntersectionObserver = new IntersectionObserver(
    ([entry]) => setIsVisible(entry.isIntersecting),
    options
  );

  useEffect(() => {
    triggerRef?.current && observer.observe(triggerRef.current);
    return () => observer.disconnect();
  }, [triggerRef?.current, options]);

  return {
    isVisible,
  };
};
