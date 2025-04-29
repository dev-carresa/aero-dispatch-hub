
import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

// Base schema for all users
export const baseUserSchema = {
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["Admin", "Driver", "Dispatcher", "Fleet", "Customer"]),
  status: z.enum(["active", "inactive"]),
  profileImage: z.instanceof(FileList).optional().refine(
    (files) => !files || files.length === 0 || Array.from(files).every(file => 
      ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
    ),
    "Only .jpg, .png, and .gif formats are supported."
  ),
};

// Additional fields for drivers
export const driverSchema = {
  ...baseUserSchema,
  phone: z.string()
    .refine((value) => !value || isValidPhoneNumber(value), 
      { message: "Please enter a valid phone number" }),
  nationality: z.string().min(2, "Nationality is required"),
  dateOfBirth: z.string(),
  vehicleType: z.enum(["sedan", "suv", "van", "truck"]),
  driverAvailability: z.enum(["available", "busy", "offline", "on_break"]),
};

// Dynamic schema based on role
export const userFormSchema = z.object(baseUserSchema).superRefine((data, ctx) => {
  if (data.role === "Driver") {
    const driverValidation = z.object(driverSchema).safeParse(data);
    
    if (!driverValidation.success) {
      driverValidation.error.errors.forEach((error) => {
        if (error.path[0] !== "role" && error.path[0] !== "firstName" && 
            error.path[0] !== "lastName" && error.path[0] !== "email" && 
            error.path[0] !== "password" && error.path[0] !== "status") {
          ctx.addIssue(error);
        }
      });
    }
  }
  
  return z.NEVER;
});

export type UserFormValues = z.infer<typeof userFormSchema> & {
  phone?: string;
  nationality?: string;
  dateOfBirth?: string;
  vehicleType?: "sedan" | "suv" | "van" | "truck";
  driverAvailability?: "available" | "busy" | "offline" | "on_break";
  profileImage?: FileList;
};
