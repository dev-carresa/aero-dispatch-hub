
import { useState, useRef, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { usePlacesAutocomplete } from './hooks/usePlacesAutoComplete';
import { PredictionsList } from './components/PredictionsList';
import { SearchInputWithClear } from './components/SearchInputWithClear';

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
    const inputRef = useRef<HTMLInputElement>(null);
    
    const { 
      isLoading, 
      predictions, 
      showDropdown, 
      setShowDropdown, 
      handlePlaceSelect 
    } = usePlacesAutocomplete({ 
      inputValue, 
      onPlaceSelect 
    });

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      
      if (onChange) {
        onChange(value);
      }
    };

    // Clear input
    const clearInput = () => {
      setInputValue('');
      if (onChange) {
        onChange('');
      }
    };

    // Handle focus event
    const handleFocus = () => {
      if (inputValue.length > 2 && predictions.length > 0) {
        setShowDropdown(true);
      }
    };

    return (
      <div className="relative">
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
            onSelect={handlePlaceSelect}
            inputRef={inputRef}
            setShowDropdown={setShowDropdown}
          />
        )}
      </div>
    );
  }
);

CustomPlacesAutocomplete.displayName = "CustomPlacesAutocomplete";

export default CustomPlacesAutocomplete;
