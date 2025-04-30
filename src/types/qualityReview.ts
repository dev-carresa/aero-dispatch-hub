
export type ReviewScore = "positive" | "negative";

export type StarRating = 1 | 2 | 3 | 4 | 5;

export interface QualityReview {
  id: string;
  bookingReference: string;
  fleetId: number;
  fleetName: string;
  driverId: number;
  driverName: string;
  reviewDate: string;
  score: ReviewScore;
  starRating: StarRating;
  message: string;
  customerName?: string;
}
