
import { useRef, useEffect } from 'react';
import { PlacePredictionItem } from './PlacePredictionItem';

interface PlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  types?: string[];
}

interface PredictionsListProps {
  predictions: PlacePrediction[];
  onSelect: (prediction: PlacePrediction) => void;
  inputRef: React.RefObject<HTMLElement>;
  setShowDropdown: (show: boolean) => void;
}

export function PredictionsList({ predictions, onSelect, inputRef, setShowDropdown }: PredictionsListProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

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
  }, [inputRef, setShowDropdown]);

  if (predictions.length === 0) {
    return null;
  }

  return (
    <div 
      ref={dropdownRef}
      className="absolute z-50 mt-1 w-full bg-background border border-input rounded-md shadow-lg max-h-[300px] overflow-auto"
      style={{ minWidth: '300px', width: '100%', left: 0 }} 
    >
      <div className="py-1">
        {predictions.map((prediction) => (
          <PlacePredictionItem 
            key={prediction.place_id} 
            prediction={prediction} 
            onSelect={onSelect} 
          />
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
  );
}
