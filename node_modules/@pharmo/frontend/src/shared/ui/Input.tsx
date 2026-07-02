import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  type = 'text',
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-xs font-semibold text-slate-600 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        className={clsx(
          'w-full p-2.5 border rounded-lg text-sm outline-none transition bg-white',
          error 
            ? 'border-red-300 focus:ring-2 focus:ring-red-500' 
            : 'border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs font-medium text-red-600 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';