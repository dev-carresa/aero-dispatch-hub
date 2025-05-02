
import React from 'react';
import { MapPin } from 'lucide-react';
import CustomPlacesAutocomplete from '@/components/places/CustomPlacesAutocomplete';
import { cn } from '@/lib/utils';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (address: string, placeId?: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

export function LocationInput({
  value,
  onChange,
  onPlaceSelect,
  placeholder,
  className,
  required,
  disabled
}: LocationInputProps) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground pointer-events-none z-10">
        <MapPin className="h-4 w-4" />
      </div>
      
      <CustomPlacesAutocomplete
        value={value}
        onChange={onChange}
        onPlaceSelect={onPlaceSelect}
        placeholder={placeholder}
        className={cn("pl-10", className)}
        required={required}
        disabled={disabled}
      />
    </div>
  );
}

export default LocationInput;
