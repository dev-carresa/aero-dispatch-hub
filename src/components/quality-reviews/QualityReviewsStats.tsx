
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QualityScore } from "./QualityScore";
import { QualityReview } from "@/types/qualityReview";

interface QualityReviewsStatsProps {
  reviews: QualityReview[];
}

export const QualityReviewsStats = ({ reviews }: QualityReviewsStatsProps) => {
  // Calculate statistics
  const totalReviews = reviews.length;
  const positiveReviews = reviews.filter(
    (review) => review.score === "positive"
  ).length;
  const negativeReviews = totalReviews - positiveReviews;
  const positivePercentage = totalReviews > 0 
    ? Math.round((positiveReviews / totalReviews) * 100) 
    : 0;

  // Get recent trend (last 7 days vs previous 7 days)
  const recentReviews = reviews
    .sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime())
    .slice(0, 5);
  
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Overall Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              {positivePercentage}%
              <span className="text-sm font-normal text-muted-foreground ml-2">
                positive
              </span>
            </div>
            <div className="flex gap-2">
              <QualityScore score="positive" size="lg" />
              <span className="text-xl font-semibold">{positiveReviews}</span>
            </div>
          </div>
          
          <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${positivePercentage}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Review Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <QualityScore score="positive" />
                <span className="text-sm">Positive</span>
              </div>
              <span className="text-2xl font-bold">{positiveReviews}</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <QualityScore score="negative" />
                <span className="text-sm">Negative</span>
              </div>
              <span className="text-2xl font-bold">{negativeReviews}</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-4">
            Based on {totalReviews} total reviews
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Recent Reviews
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentReviews.length > 0 ? (
            recentReviews.map((review) => (
              <div key={review.id} className="flex justify-between items-center">
                <div className="text-sm truncate max-w-[150px]">
                  {review.bookingReference}
                </div>
                <div className="flex items-center gap-2">
                  <QualityScore score={review.score} size="sm" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">No recent reviews</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
