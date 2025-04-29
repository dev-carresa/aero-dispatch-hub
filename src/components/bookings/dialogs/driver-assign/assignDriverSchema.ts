
import { z } from "zod";

export const assignDriverSchema = z.object({
  driverId: z.string().min(1, "Please select a driver"),
  driverIncome: z.number({
    required_error: "Driver income is required",
    invalid_type_error: "Driver income must be a number"
  }).min(0, "Driver income cannot be negative")
});

export type AssignDriverFormData = z.infer<typeof assignDriverSchema>;
