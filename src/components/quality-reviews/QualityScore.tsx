
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReviewScore } from "@/types/qualityReview";

interface QualityScoreProps {
  score: ReviewScore;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const QualityScore = ({ 
  score, 
  showLabel = false, 
  size = "md",
  className 
}: QualityScoreProps) => {
  const isPositive = score === "positive";
  
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };
  
  return (
    <div 
      className={cn(
        "flex items-center gap-2", 
        isPositive ? "text-green-600" : "text-red-600",
        className
      )}
    >
      {isPositive ? (
        <ThumbsUp className={sizeClasses[size]} />
      ) : (
        <ThumbsDown className={sizeClasses[size]} />
      )}
      {showLabel && (
        <span className="text-sm font-medium capitalize">
          {score}
        </span>
      )}
    </div>
  );
};
