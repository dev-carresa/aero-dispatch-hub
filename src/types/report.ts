
export type ReportType = "driver" | "customer" | "fleet" | "vehicle" | "booking";
export type ReportStatus = "draft" | "final" | "archived" | "deleted";

export interface ReportFilter {
  dateFrom?: string;
  dateTo?: string;
  bookingStatus?: string[];
  reportType: ReportType;
}

export interface ReportData {
  id: number;
  name: string;
  type: ReportType;
  status: ReportStatus;
  filters: ReportFilter;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  results?: any[];
  totalBookings?: number;
  totalIncome?: number;
}
