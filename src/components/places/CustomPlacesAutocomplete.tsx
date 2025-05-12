
import { useState, useRef, forwardRef, useCallback, memo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { usePlacesAutocomplete } from './hooks/usePlacesAutoComplete';
import { PredictionsList } from './components/PredictionsList';
import { SearchInputWithClear } from './components/SearchInputWithClear';

interface CustomPlacesAutocompleteProps {
  onPlaceSelect: (address: string, placeId?: string, latitude?: number, longitude?: number) => void;
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
    const inputRef = useRef<HTMLInputElement>(null);
    
    // Update internal state when value prop changes
    useEffect(() => {
      setInputValue(value);
    }, [value]);
    
    const { 
      isLoading, 
      predictions, 
      showDropdown, 
      setShowDropdown, 
      handlePlaceSelect,
      getPlaceDetails 
    } = usePlacesAutocomplete({ 
      inputValue, 
      onPlaceSelect: (address, placeId) => {
        // Get place details including coordinates when a place is selected
        if (placeId) {
          getPlaceDetails(placeId).then(placeDetails => {
            const latitude = placeDetails?.geometry?.location?.lat();
            const longitude = placeDetails?.geometry?.location?.lng();
            
            // Update the input value to display the selected address
            setInputValue(address);
            
            // Call the parent component's onPlaceSelect callback with all data
            onPlaceSelect(address, placeId, latitude, longitude);
            
            // Also call onChange if it exists
            if (onChange) {
              onChange(address);
            }
          });
        } else {
          // If no placeId, just update with address
          setInputValue(address);
          onPlaceSelect(address);
          if (onChange) {
            onChange(address);
          }
        }
        
        // Immediately hide dropdown after selection
        setShowDropdown(false);
      }
    });

    // Handle input change with useCallback
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      
      if (onChange) {
        onChange(value);
      }
    }, [onChange]);

    // Clear input with useCallback
    const clearInput = useCallback(() => {
      setInputValue('');
      if (onChange) {
        onChange('');
      }
      // Focus the input after clearing
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [onChange]);

    // Handle focus event with useCallback
    const handleFocus = useCallback(() => {
      if (inputValue.length > 2 && predictions.length > 0) {
        setShowDropdown(true);
      }
    }, [inputValue, predictions.length, setShowDropdown]);

    // Handle place selection wrapper
    const onSelectPlace = useCallback((prediction: any) => {
      handlePlaceSelect(prediction);
      // Ensure dropdown is closed
      setShowDropdown(false);
      // Ensure field maintains focus after selection
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [handlePlaceSelect, setShowDropdown]);

    return (
      <div className="relative w-full">
        <SearchInputWithClear 
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onClear={clearInput}
          isLoading={isLoading}
          placeholder={placeholder}
          className={className}
          disabled={disabled}
          required={required}
          inputRef={(node) => {
            // Handle both refs
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            inputRef.current = node;
          }}
        />

        {showDropdown && predictions.length > 0 && (
          <PredictionsList 
            predictions={predictions}
            onSelect={onSelectPlace}
            inputRef={inputRef}
            setShowDropdown={setShowDropdown}
          />
        )}
      </div>
    );
  }
);

CustomPlacesAutocomplete.displayName = "CustomPlacesAutocomplete";

// Use memo to prevent unnecessary re-renders
export default memo(CustomPlacesAutocomplete);
