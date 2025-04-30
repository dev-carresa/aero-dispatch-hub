
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { StarRating as StarRatingType } from "@/types/qualityReview";

interface StarRatingProps {
  rating: StarRatingType;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showValue?: boolean;
}

export const StarRating = ({ 
  rating, 
  maxRating = 5, 
  size = "md",
  className,
  showValue = false
}: StarRatingProps) => {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };
  
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxRating }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizeClasses[size],
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"
          )}
        />
      ))}
      {showValue && (
        <span className="ml-1 text-sm font-medium">
          {rating}/{maxRating}
        </span>
      )}
    </div>
  );
};
