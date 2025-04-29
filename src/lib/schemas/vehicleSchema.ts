
import { z } from "zod";
import { VehicleStatus } from "@/types/vehicle";

export const vehicleSchema = z.object({
  type: z.string().min(1, "Vehicle type is required"),
  make: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number({
    required_error: "Year is required",
    invalid_type_error: "Year must be a number"
  }).int().min(1900, "Year must be 1900 or later").max(new Date().getFullYear() + 1, "Year cannot be in the distant future"),
  licensePlate: z.string().min(1, "Plate number is required"),
  registrationNumber: z.string().optional(),
  capacity: z.number({
    required_error: "Number of seats is required",
    invalid_type_error: "Number of seats must be a number"
  }).int().min(1, "Vehicle must have at least one seat"),
  status: z.enum(["active", "maintenance", "inactive", "retired"] as const),
  color: z.string().min(1, "Color is required"),
  fleetId: z.string().optional(),
  assignedDriverId: z.string().optional(),
  insuranceExpiry: z.date().optional(),
  technicalControlExpiry: z.date().optional(),
  imageUrl: z.string().optional(),
  notes: z.string().optional(),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;
