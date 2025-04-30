
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquare } from "lucide-react";
import { QualityScore } from "./QualityScore";
import { StarRating } from "./StarRating";
import { QualityReview } from "@/types/qualityReview";

interface ReviewMessageDialogProps {
  review: QualityReview;
}

export const ReviewMessageDialog = ({ review }: ReviewMessageDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <MessageSquare className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="mr-auto">Review for Booking {review.bookingReference}</div>
            <StarRating rating={review.starRating} size="md" showValue />
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <span>{new Date(review.reviewDate).toLocaleDateString()}</span>
            <span>•</span>
            <QualityScore score={review.score} showLabel />
          </DialogDescription>
        </DialogHeader>

        <div className="border rounded-lg p-4 my-2 bg-muted/20">
          <p className="text-sm leading-6">{review.message}</p>
          {review.customerName && (
            <p className="text-sm font-medium mt-2">— {review.customerName}</p>
          )}
        </div>

        <div className="bg-muted/30 p-3 rounded-md text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Driver:</span>
            <span className="font-medium">{review.driverName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fleet:</span>
            <span className="font-medium">{review.fleetName}</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
