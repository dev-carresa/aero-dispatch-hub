
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QualityScore } from "./QualityScore";
import { StarRating } from "./StarRating";
import { QualityReview, StarRating as StarRatingType } from "@/types/qualityReview";

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

  // Calculate star rating distribution
  const starDistribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  };

  reviews.forEach(review => {
    starDistribution[review.starRating]++;
  });

  // Calculate average rating
  const totalStars = reviews.reduce((sum, review) => sum + review.starRating, 0);
  const averageRating = totalReviews > 0 
    ? parseFloat((totalStars / totalReviews).toFixed(1)) 
    : 0;

  // Get recent trend (last 7 days vs previous 7 days)
  const recentReviews = reviews
    .sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime())
    .slice(0, 5);
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Overall Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              {averageRating}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                out of 5
              </span>
            </div>
            <div>
              <StarRating rating={Math.round(averageRating) as StarRatingType} size="lg" />
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <QualityScore score="positive" />
                <span className="text-sm">Positive</span>
              </div>
              <span className="text-sm font-medium">{positiveReviews}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QualityScore score="negative" />
                <span className="text-sm">Negative</span>
              </div>
              <span className="text-sm font-medium">{negativeReviews}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Rating Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          {[5, 4, 3, 2, 1].map(stars => (
            <div key={stars} className="flex items-center gap-2 mb-2">
              <div className="flex items-center min-w-[60px]">
                <StarRating rating={stars as StarRatingType} size="sm" />
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400"
                  style={{ 
                    width: totalReviews ? `${(starDistribution[stars] / totalReviews) * 100}%` : '0%' 
                  }}
                ></div>
              </div>
              <div className="min-w-[30px] text-sm text-right font-medium">
                {starDistribution[stars]}
              </div>
            </div>
          ))}
          <div className="text-xs text-muted-foreground mt-2">
            Based on {totalReviews} reviews
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
                <div className="text-sm truncate max-w-[120px]">
                  {review.bookingReference}
                </div>
                <StarRating rating={review.starRating} size="sm" />
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
