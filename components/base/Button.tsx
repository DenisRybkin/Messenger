'use client';

import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
  secondary?: boolean;
  danger?: boolean;
}

export const Button = ({
  fullWidth,
  secondary,
  danger,
  ...rest
}: ButtonProps) => {
  return (
    <button
      {...rest}
      className={clsx(
        'flex justify-center rounded-md px-3 py-2 text-sm font-semibold transition-all' +
          ' focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed',
        rest.disabled && 'opacity-50 cursor-default',
        fullWidth && 'w-full',
        secondary ? 'text-gray-900' : 'text-white',
        danger &&
          'bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600',
        !secondary &&
          !danger &&
          'bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600'
      )}
    />
  );
};
