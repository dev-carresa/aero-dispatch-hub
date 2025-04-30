
import { useState, useRef, useEffect, forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Loader2, MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface CustomPlacesAutocompleteProps {
  onPlaceSelect: (address: string, placeId?: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  onChange?: (value: string) => void;
}

const CustomPlacesAutocomplete = forwardRef<HTMLInputElement, CustomPlacesAutocompleteProps>(
  ({ onPlaceSelect, placeholder = "Enter address", className, value = "", disabled = false, required = false, onChange }, ref) => {
    const [inputValue, setInputValue] = useState(value);
    const [isLoading, setIsLoading] = useState(false);
    const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    // Initialize autocomplete service
    useEffect(() => {
      if (!isLoading && window.google) {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
      }
    }, [isLoading]);

    // Handle outside click to close dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
            inputRef.current && !inputRef.current.contains(event.target as Node)) {
          setShowDropdown(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      
      if (onChange) {
        onChange(value);
      }

      if (value.length > 2 && autocompleteService.current) {
        autocompleteService.current.getPlacePredictions(
          { input: value },
          (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
              setPredictions(predictions as PlacePrediction[]);
              setShowDropdown(true);
            } else {
              setPredictions([]);
              setShowDropdown(false);
            }
          }
        );
      } else {
        setPredictions([]);
        setShowDropdown(false);
      }
    };

    // Handle place selection
    const handlePlaceSelect = (prediction: PlacePrediction) => {
      setInputValue(prediction.description);
      onPlaceSelect(prediction.description, prediction.place_id);
      setPredictions([]);
      setShowDropdown(false);
    };

    // Clear input
    const clearInput = () => {
      setInputValue('');
      setPredictions([]);
      setShowDropdown(false);
      if (onChange) {
        onChange('');
      }
    };

    return (
      <div className="relative">
        <div className="relative">
          <Input
            ref={(node) => {
              // Handle both refs
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
              inputRef.current = node;
            }}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => inputValue.length > 2 && setPredictions.length > 0 && setShowDropdown(true)}
            placeholder={placeholder}
            className={cn("pr-10", className)}
            disabled={disabled || isLoading}
            required={required}
            autoComplete="off"
          />
          {isLoading ? (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : inputValue ? (
            <button
              type="button"
              onClick={clearInput}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        {showDropdown && predictions.length > 0 && (
          <div 
            ref={dropdownRef}
            className="absolute z-50 mt-1 w-full bg-background border border-input rounded-md shadow-md max-h-[300px] overflow-auto"
          >
            <div className="py-1">
              {predictions.map((prediction) => (
                <div
                  key={prediction.place_id}
                  className="px-3 py-2 hover:bg-muted cursor-pointer flex items-start gap-2"
                  onClick={() => handlePlaceSelect(prediction)}
                >
                  <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-muted-foreground" />
                  <div className="flex-1 overflow-hidden">
                    <div className="text-sm font-medium truncate">
                      {prediction.structured_formatting.main_text}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {prediction.structured_formatting.secondary_text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t py-1 px-3">
              <div className="flex justify-end">
                <img 
                  src="https://developers.google.com/maps/documentation/images/powered_by_google_on_white.png" 
                  alt="Powered by Google" 
                  className="h-5"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

CustomPlacesAutocomplete.displayName = "CustomPlacesAutocomplete";

export default CustomPlacesAutocomplete;
