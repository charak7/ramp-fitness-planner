import React from 'react';
import { cn } from '../../lib/utils';

const buttonVariants = {
  default: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200",
  outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
  ghost: "hover:bg-gray-100 text-gray-700",
  success: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg",
  danger: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg"
};

const buttonSizes = {
  sm: "px-3 py-1.5 text-sm",
  default: "px-4 py-2",
  lg: "px-6 py-3 text-lg",
  xl: "px-8 py-4 text-xl"
};

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  disabled = false,
  children, 
  ...props 
}, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
