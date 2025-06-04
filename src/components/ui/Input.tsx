import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, fullWidth = false, className = '', ...props }, ref) => {
    const widthClass = fullWidth ? 'w-full' : '';
    
    return (
      <div className={`${widthClass} ${className}`}>
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            px-3 py-2 bg-white border shadow-sm border-gray-300 placeholder-gray-400 
            focus:outline-none focus:border-blue-800 focus:ring-blue-800 block rounded-md sm:text-sm focus:ring-1
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${widthClass}
          `}
          {...props}
        />
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;