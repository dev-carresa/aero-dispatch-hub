
export type UserRole = "Admin" | "Driver" | "Fleet" | "Dispatcher" | "Customer";
export type UserStatus = "active" | "inactive";
export type DriverAvailability = "available" | "busy" | "offline" | "on_break";

export type User = {
  id: string | number; // Updated to accept both string and number
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActive: string;
  imageUrl: string;
  // Driver-specific fields
  phone?: string;
  nationality?: string;
  dateOfBirth?: string;
  fleetId?: number;
  countryCode?: string;
  vehicleType?: string;
  driverAvailability?: DriverAvailability;
};
