
import { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { LocationInput } from "@/components/places/components/LocationInput";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft } from "lucide-react";
import { TripTypeBadge } from "./TripTypeBadge";
import { detectTripType } from "@/components/places/utils/tripTypeDetector";
import type { BookingFormData, TripType } from "@/lib/schemas/bookingSchema";

interface LocationFieldsProps {
  form: UseFormReturn<BookingFormData>;
}

export function LocationFields({ form }: LocationFieldsProps) {
  const pickupLocation = form.watch('pickupLocation');
  const destination = form.watch('destination');
  const [tripType, setTripType] = useState<TripType>('transfer');

  // Detect trip type when locations change
  useEffect(() => {
    if (pickupLocation && destination) {
      const detectedType = detectTripType(
        { description: pickupLocation },
        { description: destination }
      );
      setTripType(detectedType);
      form.setValue('tripType', detectedType);
    }
  }, [pickupLocation, destination, form]);

  // Switch origin and destination
  const handleSwitchLocations = () => {
    const currentPickup = form.getValues('pickupLocation');
    const currentDestination = form.getValues('destination');
    
    form.setValue('pickupLocation', currentDestination);
    form.setValue('destination', currentPickup);
  };

  // Handle place selection with explicit address update
  const handlePlaceSelect = (fieldName: 'pickupLocation' | 'destination') => (address: string) => {
    form.setValue(fieldName, address);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Trip Information</h3>
        {tripType && <TripTypeBadge tripType={tripType} />}
      </div>

      <div className="relative">
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
                  onPlaceSelect={handlePlaceSelect('pickupLocation')}
                  placeholder="Enter pickup location"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center my-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleSwitchLocations}
            className="rounded-full w-8 h-8 border-dashed"
          >
            <ArrowRightLeft className="h-4 w-4" />
            <span className="sr-only">Switch locations</span>
          </Button>
        </div>

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
                  onPlaceSelect={handlePlaceSelect('destination')}
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
