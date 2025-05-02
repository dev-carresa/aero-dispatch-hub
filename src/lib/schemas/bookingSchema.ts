
import * as z from "zod"

export const bookingFormSchema = z.object({
  // Details tab
  customerName: z.string().min(2, "Customer name must be at least 2 characters"),
  companyName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone number must be at least 6 characters"),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
  pickupLocation: z.string().min(3, "Pickup location must be at least 3 characters"),
  destination: z.string().min(3, "Destination must be at least 3 characters"),
  pickupDate: z.date({ required_error: "Please select a pickup date" }),
  pickupTime: z.string({ required_error: "Please select a pickup time" }),
  vehicleType: z.enum(["sedan", "suv", "van", "luxury"]),
  tripType: z.enum(["arrival", "departure", "transfer"]).default("transfer"),
  
  // Passengers tab
  passengerCount: z.number().min(1, "At least 1 passenger is required"),
  luggageCount: z.number().min(0, "Luggage count cannot be negative"),
  flightNumber: z.string().optional(),
  specialInstructions: z.string().optional(),
  
  // Payment tab
  price: z.number().min(0, "Price cannot be negative"),
  paymentMethod: z.enum(["credit-card", "cash", "invoice", "paypal"]),
  paymentStatus: z.enum(["pending", "paid", "failed"]),
  paymentNotes: z.string().optional(),
  
  // Notes tab
  adminNotes: z.string().optional(),
  driverNotes: z.string().optional(),
  
  // Driver & Fleet income
  driverIncome: z.number().min(0, "Driver income cannot be negative").optional(),
  fleetIncome: z.number().min(0, "Fleet income cannot be negative").optional(),
  
  // Tracking
  trackingStatus: z.enum(["accepted", "onroute", "arrived", "onboard", "completed", "noshow"]).optional(),
})

export type BookingFormData = z.infer<typeof bookingFormSchema>

// Tracking history status type
export type TrackingStatusType = "accepted" | "onroute" | "arrived" | "onboard" | "completed" | "noshow";

export interface TrackingHistoryEntry {
  id: string;
  status: TrackingStatusType;
  timestamp: string;
  location: string;
  coords: [number, number]; // [longitude, latitude]
  notes: string;
  user: string;
}

// Trip type for bookings
export type TripType = "arrival" | "departure" | "transfer";
