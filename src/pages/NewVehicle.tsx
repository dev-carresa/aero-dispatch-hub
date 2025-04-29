
import { useState } from "react";
import { VehicleForm } from "@/components/vehicles/VehicleForm";

export default function NewVehicle() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Vehicle</h1>
        <p className="text-muted-foreground mt-2">Add a new vehicle to your fleet</p>
      </div>
      
      <div className="border rounded-lg p-4 md:p-6 bg-card">
        <VehicleForm />
      </div>
    </div>
  );
}
