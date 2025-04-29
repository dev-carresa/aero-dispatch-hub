
export type FuelType = "Gasoline" | "Diesel" | "Electric" | "Hybrid" | "Natural Gas";
export type VehicleStatus = "active" | "maintenance" | "inactive" | "retired";

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  registrationNumber?: string;
  vin: string;
  color: string;
  type: string;
  capacity: number;
  fuelType: FuelType;
  status: VehicleStatus;
  mileage: number;
  lastMaintenance?: string;
  nextMaintenance?: string;
  notes?: string;
  assignedDriverId?: number;
  fleetId?: number;
  imageUrl?: string;
  insuranceExpiry?: string;
  technicalControlExpiry?: string;
  createdAt: string;
  updatedAt: string;
}
