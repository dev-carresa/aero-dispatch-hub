
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export function Spinner({ size = "md", className, ...props }: SpinnerProps) {
  return (
    <div 
      role="status" 
      className={cn("flex items-center justify-center", className)} 
      {...props}
    >
      <Loader2 
        className={cn(
          "animate-spin text-muted-foreground",
          {
            "h-4 w-4": size === "sm",
            "h-6 w-6": size === "md",
            "h-10 w-10": size === "lg",
          }
        )} 
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
