'use client';

import ReactSelect from 'react-select';

interface SelectProps<T extends Record<string, any>, IsM extends boolean> {
  label: string;
  value?: IsM extends true ? T[] : T;
  onChange: (value: IsM extends true ? T[] : T) => void;
  options: T[];
  disabled?: boolean;
  isMultiple: boolean;
  placeholder?: string;
}

export function Select<T extends Record<string, any>, IsM extends boolean>(
  props: SelectProps<T, IsM>
) {
  const handleChange = (newValue: IsM extends true ? T[] : T) =>
    props.onChange(newValue);

  return (
    <div className="z-[100]">
      <label className="block text-sm font-medium leading-6 text-gray-900">
        {props.label}
      </label>
      <div className="mt-2">
        <ReactSelect
          isDisabled={props.disabled}
          value={props.value}
          // @ts-ignore
          onChange={handleChange}
          // @ts-ignore
          isMulti={props.isMultiple}
          placeholder={props.placeholder}
          options={props.options}
          className="react-select"
          menuPortalTarget={document.body}
          styles={{
            menuPortal: base => ({ ...base, zIndex: 9999 }),
          }}
          classNames={{
            control: () =>
              'text-sm hover:!border-sky-500 !from-input !focus:ring-sky-600 !focus:ring-2',
          }}
        />
      </div>
    </div>
  );
}
