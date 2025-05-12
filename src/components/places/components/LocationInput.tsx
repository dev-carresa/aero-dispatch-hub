
import React from 'react';
import { MapPin } from 'lucide-react';
import CustomPlacesAutocomplete from '@/components/places/CustomPlacesAutocomplete';
import { cn } from '@/lib/utils';

export interface PlaceData {
  address: string;
  placeId?: string;
  latitude?: number;
  longitude?: number;
}

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (placeData: PlaceData) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  label?: string;
  icon?: React.ReactNode;
}

export function LocationInput({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Enter location",
  className,
  required,
  disabled,
  label,
  icon = <MapPin className="h-4 w-4" />
}: LocationInputProps) {
  // Create a handler that ensures both onChange and onPlaceSelect are called
  const handlePlaceSelect = (address: string, placeId?: string, latitude?: number, longitude?: number) => {
    onChange(address); // Update the form field value
    onPlaceSelect({
      address,
      placeId,
      latitude,
      longitude
    }); // Call the original onPlaceSelect with all data
  };

  return (
    <div className="relative w-full">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none z-10">
        {icon}
      </div>
      
      <CustomPlacesAutocomplete
        value={value}
        onChange={onChange}
        onPlaceSelect={handlePlaceSelect}
        placeholder={placeholder}
        className={cn("pl-10", className)}
        required={required}
        disabled={disabled}
      />
    </div>
  );
}

export default LocationInput;
