'use client';
import clsx from 'clsx';
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';
import { HTMLAttributes, HTMLInputTypeAttribute } from 'react';

interface InputProps<T extends FieldValues>
  extends Omit<HTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  id: keyof T;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
  disabled?: boolean;
  register: UseFormRegister<T>;
  errors?: FieldErrors;
  placeholder?: string;
}

export function Input<T extends FieldValues>({
  register,
  ...rest
}: InputProps<T>) {
  return (
    <div>
      <label
        htmlFor={rest.id as string}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {rest.label}
      </label>
      <div className="mt-2">
        <input
          id={rest.id as string}
          autoComplete={rest.id as string}
          disabled={rest.disabled}
          placeholder={rest.placeholder}
          type={rest.type}
          // @ts-ignore
          {...register(rest.id, { required: rest.required })}
          className={clsx(
            'form-input block w-full rounded-md border-0 py-1.5 text-gray-900' +
              ' shadow-sm ring-2 ring-inset ring-gray-300 placeholder:text-gray-400' +
              ' focus:ring-sky-500 focus:ring-2 sm:text-sm sm:leading-6 transition-all',
            rest.errors?.[rest.id as string] && 'focus:ring-rose-500',
            rest.disabled && 'opacity-50 cursor-default'
          )}
        />
      </div>
    </div>
  );
}
