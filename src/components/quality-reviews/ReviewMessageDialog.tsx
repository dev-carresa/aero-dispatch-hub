
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { QualityReview } from "@/types/qualityReview";
import { QualityScore } from "./QualityScore";

interface ReviewMessageDialogProps {
  review: QualityReview;
}

export const ReviewMessageDialog = ({ review }: ReviewMessageDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Review for Booking {review.bookingReference} 
            <QualityScore score={review.score} showLabel size="sm" />
          </DialogTitle>
          <DialogDescription>
            Submitted on {review.reviewDate} by {review.customerName || 'Customer'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Driver</h4>
            <p className="text-sm text-muted-foreground">{review.driverName}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Fleet</h4>
            <p className="text-sm text-muted-foreground">{review.fleetName}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Review Message</h4>
            <p className="text-sm p-3 bg-muted/50 rounded-md mt-1">{review.message}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
