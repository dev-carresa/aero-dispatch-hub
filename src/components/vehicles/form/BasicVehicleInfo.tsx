
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function BasicVehicleInfo() {
  const { control } = useFormContext<VehicleFormData>();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Vehicle Type */}
      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vehicle Type</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="van">Van</SelectItem>
                <SelectItem value="truck">Truck</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Brand/Make */}
      <FormField
        control={control}
        name="make"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Brand</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Toyota" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Model */}
      <FormField
        control={control}
        name="model"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Model</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Camry" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Year */}
      <FormField
        control={control}
        name="year"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Year of Manufacture</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min={1900} 
                max={new Date().getFullYear() + 1}
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* License Plate */}
      <FormField
        control={control}
        name="licensePlate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Plate Number</FormLabel>
            <FormControl>
              <Input placeholder="e.g. ABC-123" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Registration Number */}
      <FormField
        control={control}
        name="registrationNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Registration Number</FormLabel>
            <FormControl>
              <Input placeholder="e.g. REG12345" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Capacity/Seats */}
      <FormField
        control={control}
        name="capacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Seats</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min={1} 
                max={100}
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Color */}
      <FormField
        control={control}
        name="color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Color</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Red" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
