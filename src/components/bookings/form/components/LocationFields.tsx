
import { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { LocationInput, PlaceData } from "@/components/places/components/LocationInput";
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
    
    const pickupLat = form.getValues('pickupLatitude');
    const pickupLng = form.getValues('pickupLongitude');
    const destLat = form.getValues('destinationLatitude');
    const destLng = form.getValues('destinationLongitude');
    
    form.setValue('pickupLocation', currentDestination);
    form.setValue('destination', currentPickup);
    
    // Switch coordinates as well
    form.setValue('pickupLatitude', destLat);
    form.setValue('pickupLongitude', destLng);
    form.setValue('destinationLatitude', pickupLat);
    form.setValue('destinationLongitude', pickupLng);
  };

  // Handle place selection with coordinates
  const handlePickupPlaceSelect = (placeData: PlaceData) => {
    form.setValue('pickupLocation', placeData.address);
    if (placeData.latitude && placeData.longitude) {
      form.setValue('pickupLatitude', placeData.latitude);
      form.setValue('pickupLongitude', placeData.longitude);
    }
  };

  const handleDestinationPlaceSelect = (placeData: PlaceData) => {
    form.setValue('destination', placeData.address);
    if (placeData.latitude && placeData.longitude) {
      form.setValue('destinationLatitude', placeData.latitude);
      form.setValue('destinationLongitude', placeData.longitude);
    }
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
                  onPlaceSelect={handlePickupPlaceSelect}
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
                  onPlaceSelect={handleDestinationPlaceSelect}
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
