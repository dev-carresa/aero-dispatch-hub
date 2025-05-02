
import { useState, useRef, forwardRef, useCallback, memo } from 'react';
import { cn } from '@/lib/utils';
import { usePlacesAutocomplete } from './hooks/usePlacesAutoComplete';
import { PredictionsList } from './components/PredictionsList';
import { SearchInputWithClear } from './components/SearchInputWithClear';

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
      // Ensure field maintains focus after selection
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [handlePlaceSelect]);

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
