
export type ReviewScore = "positive" | "negative";

export interface QualityReview {
  id: string;
  bookingReference: string;
  fleetId: number;
  fleetName: string;
  driverId: number;
  driverName: string;
  reviewDate: string;
  score: ReviewScore;
  message: string;
  customerName?: string;
}
