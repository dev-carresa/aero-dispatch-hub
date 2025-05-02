
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { LocationInput } from "@/components/places/components/LocationInput";
import type { BookingFormData } from "@/lib/schemas/bookingSchema";

interface LocationFieldsProps {
  form: UseFormReturn<BookingFormData>;
}

export function LocationFields({ form }: LocationFieldsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Trip Information</h3>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="pickupLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pickup Location</FormLabel>
              <FormControl>
                <LocationInput
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  onPlaceSelect={(address) => field.onChange(address)}
                  placeholder="Enter pickup location"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="destination"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination</FormLabel>
              <FormControl>
                <LocationInput
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  onPlaceSelect={(address) => field.onChange(address)}
                  placeholder="Enter destination"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
