
export interface DriverComment {
  id: string;
  driverId: number;
  driverName: string;
  bookingReference?: string;
  comment: string;
  createdAt: string;
  status: "read" | "unread";
}
