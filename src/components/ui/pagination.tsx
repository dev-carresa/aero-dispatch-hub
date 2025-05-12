
import * as React from "react";
import { cn } from "@/lib/utils";

const Pagination = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-center space-x-2", className)}
    {...props}
  />
));
Pagination.displayName = "Pagination";

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement> & { value?: number }
>(({ className, value = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full h-2 bg-gray-100 rounded-full overflow-hidden", className)}
    {...props}
  >
    <div
      className="bg-primary h-full transition-all duration-300 ease-in-out"
      style={{ width: `${value}%` }}
    />
  </div>
));
Progress.displayName = "Progress";

export { Pagination, Progress };
