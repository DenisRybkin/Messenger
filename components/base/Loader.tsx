'use client';

import clsx from 'clsx';
import { ClipLoader } from 'react-spinners';
import { useMemo } from 'react';

type LoaderSize = 'sm' | 'md' | 'lg';

interface LoaderProps {
  size?: LoaderSize;
  onClick?: () => void;
}

export const Loader = (props: LoaderProps) => {
  const size = useMemo(() => {
    if (!props.size) return 36;
    switch (props.size) {
      case 'lg':
        return 62;
      case 'md':
        return 36;
      case 'sm':
        return 24;
    }
  }, [props.size]);

  return (
    <div onClick={props.onClick} role="status">
      <ClipLoader size={size} color="rgb(14, 165, 233)" />
    </div>
  );
};
