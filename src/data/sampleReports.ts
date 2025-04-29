
import { ReportData } from "@/types/report";

export const initialReports: ReportData[] = [
  {
    id: 1,
    name: "Driver Performance Q1 2024",
    type: "driver",
    status: "final",
    filters: {
      dateFrom: "2024-01-01",
      dateTo: "2024-03-31",
      bookingStatus: ["completed"],
      includeDriver: true,
      includeVehicle: true
    },
    createdAt: "2024-04-05T10:30:00Z",
    updatedAt: "2024-04-08T14:15:00Z",
    createdBy: 1
  },
  {
    id: 2,
    name: "Fleet Utilization Report",
    type: "fleet",
    status: "draft",
    filters: {
      dateFrom: "2024-02-01",
      dateTo: "2024-04-15",
      bookingStatus: ["completed", "cancelled"],
      includeFleet: true,
      includeVehicle: true
    },
    createdAt: "2024-04-16T09:20:00Z",
    updatedAt: "2024-04-16T09:20:00Z",
    createdBy: 1
  },
  {
    id: 3,
    name: "Customer Booking Analysis",
    type: "customer",
    status: "final",
    filters: {
      dateFrom: "2023-10-01",
      dateTo: "2024-03-31",
      bookingStatus: ["completed", "no-show"],
      includeCustomer: true
    },
    createdAt: "2024-04-12T11:45:00Z",
    updatedAt: "2024-04-14T16:30:00Z",
    createdBy: 1
  },
  {
    id: 4,
    name: "Vehicle Maintenance Report",
    type: "vehicle",
    status: "archived",
    filters: {
      dateFrom: "2023-01-01",
      dateTo: "2023-12-31",
      includeVehicle: true
    },
    createdAt: "2024-01-10T08:20:00Z",
    updatedAt: "2024-04-01T10:15:00Z",
    createdBy: 1
  },
  {
    id: 5,
    name: "Quarterly Cancellations Analysis",
    type: "booking",
    status: "deleted",
    filters: {
      dateFrom: "2024-01-01",
      dateTo: "2024-03-31",
      bookingStatus: ["cancelled"],
      includeCustomer: true,
      includeDriver: true
    },
    createdAt: "2024-04-03T14:20:00Z",
    updatedAt: "2024-04-18T09:45:00Z",
    createdBy: 1
  }
];
