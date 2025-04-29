
import React from "react";
import { useFormContext } from "react-hook-form";
import { VehicleFormData } from "@/lib/schemas/vehicleSchema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { drivers } from "@/components/bookings/dialogs/driver-assign/driverData";

// Sample fleet data (in a real app, this would come from an API)
const fleets = [
  { id: "1", name: "North Fleet" },
  { id: "2", name: "South Fleet" },
  { id: "3", name: "East Fleet" },
  { id: "4", name: "West Fleet" },
];

export function VehicleAssignmentSection() {
  const { control } = useFormContext<VehicleFormData>();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Fleet */}
      <FormField
        control={control}
        name="fleetId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Assigned Fleet</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a fleet" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {fleets.map(fleet => (
                  <SelectItem key={fleet.id} value={fleet.id}>{fleet.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Driver */}
      <FormField
        control={control}
        name="assignedDriverId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Assigned Driver</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a driver" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {drivers.map(driver => (
                  <SelectItem key={driver.id} value={driver.id}>{driver.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
