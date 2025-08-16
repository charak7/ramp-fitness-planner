import React from 'react';
import { cn } from '../../lib/utils';

const badgeVariants = {
  default: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  destructive: "bg-red-100 text-red-900 hover:bg-red-200",
  outline: "border border-gray-200 text-gray-900",
  success: "bg-green-100 text-green-900 hover:bg-green-200",
  warning: "bg-yellow-100 text-yellow-900 hover:bg-yellow-200",
  info: "bg-blue-100 text-blue-900 hover:bg-blue-200"
};

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge, badgeVariants };
