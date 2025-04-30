
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QualityScore } from "./QualityScore";
import { StarRating } from "./StarRating";
import { ReviewMessageDialog } from "./ReviewMessageDialog";
import { QualityReview } from "@/types/qualityReview";

interface QualityReviewsTableProps {
  reviews: QualityReview[];
  isAdmin: boolean;
}

export const QualityReviewsTable = ({ 
  reviews, 
  isAdmin 
}: QualityReviewsTableProps) => {
  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Booking Reference</TableHead>
            {isAdmin && <TableHead>Fleet</TableHead>}
            <TableHead>Driver</TableHead>
            <TableHead>Review Date</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className="w-10">Message</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 6 : 5} className="text-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <span className="font-medium">No reviews found</span>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your filters or check back later
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="font-medium">
                  {review.bookingReference}
                </TableCell>
                {isAdmin && <TableCell>{review.fleetName}</TableCell>}
                <TableCell>{review.driverName}</TableCell>
                <TableCell>{review.reviewDate}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.starRating} />
                    <QualityScore score={review.score} size="sm" />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <ReviewMessageDialog review={review} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
