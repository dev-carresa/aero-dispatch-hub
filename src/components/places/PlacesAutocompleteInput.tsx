
import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlacesAutocompleteInputProps {
  onPlaceSelect: (address: string, placeId?: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
}

// Remove the conflicting declaration
// Instead of redeclaring, use the global declaration from vite-env.d.ts

export const PlacesAutocompleteInput = ({
  onPlaceSelect,
  placeholder = "Enter address",
  className,
  value = "",
  disabled = false,
  required = false,
}: PlacesAutocompleteInputProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Load Google Maps script
  useEffect(() => {
    if (!window.google) {
      setIsLoading(true);
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA4fi6Kf6-HgLZkON89ASKUn-u2pdIEspE&libraries=places&callback=initializeAutocomplete`;
      script.async = true;
      script.defer = true;
      
      window.initializeAutocomplete = () => {
        setIsLoading(false);
      };

      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
        delete window.initializeAutocomplete;
      };
    }
  }, []);

  // Initialize autocomplete
  useEffect(() => {
    if (!isLoading && inputRef.current && window.google) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        fields: ['formatted_address', 'place_id', 'geometry'],
      });
      
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.formatted_address) {
          setInputValue(place.formatted_address);
          onPlaceSelect(place.formatted_address, place.place_id);
        }
      });
    }
    
    return () => {
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoading, onPlaceSelect]);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className={cn(className)}
        disabled={disabled || isLoading}
        required={required}
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default PlacesAutocompleteInput;
