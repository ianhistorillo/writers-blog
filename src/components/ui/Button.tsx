import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  as?: 'button' | 'span';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  as = 'button',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
  
  const variantClasses = {
    primary: 'bg-blue-800 text-white hover:bg-blue-900 focus-visible:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
    warning: 'bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-800 focus-visible:ring-gray-500',
  };
  
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 py-3 text-base',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const Component = as;
  
  return (
    <Component
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${widthClass}
        ${className}
      `}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
      ) : null}
      {children}
    </Component>
  );
};

export default Button;