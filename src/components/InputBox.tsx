import React from 'react';

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  classNames?: string;
}

function InputBox({ label, classNames, ...inputProps }: IProps) {
  return (
    <label className={` flex items-center ${label ? 'mb-3' : ''}`}>
      {label ? (
        <span className='min-w-[100px] shrink-0 text-sm'>{label}</span>
      ) : null}
      <input
        className={`block min-w-[64px] rounded border border-solid border-neutral-200 bg-slate-100 p-1 outline-none ${
          classNames || ''
        }`}
        {...inputProps}
      />
    </label>
  );
}

export default InputBox;
