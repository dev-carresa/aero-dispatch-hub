
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import CustomPlacesAutocomplete from "@/components/places/CustomPlacesAutocomplete";
import type { BookingFormData } from "@/lib/schemas/bookingSchema";

interface LocationFieldsProps {
  form: UseFormReturn<BookingFormData>;
}

export function LocationFields({ form }: LocationFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="pickupLocation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pickup Location</FormLabel>
            <FormControl>
              <CustomPlacesAutocomplete
                value={field.value}
                onPlaceSelect={(address) => field.onChange(address)}
                onChange={(value) => field.onChange(value)}
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
              <CustomPlacesAutocomplete
                value={field.value}
                onPlaceSelect={(address) => field.onChange(address)}
                onChange={(value) => field.onChange(value)}
                placeholder="Enter destination"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
