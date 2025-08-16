import React from 'react';
import { cn } from '../../lib/utils';

const LoadingSpinner = ({ className, size = "default" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
        sizeClasses[size],
        className
      )}
    />
  );
};

const LoadingDots = ({ className }) => {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  );
};

const PulseLoader = ({ className }) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="h-3 w-3 bg-blue-600 rounded-full animate-pulse"></div>
      <div className="h-3 w-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      <div className="h-3 w-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );
};

export { LoadingSpinner, LoadingDots, PulseLoader };
