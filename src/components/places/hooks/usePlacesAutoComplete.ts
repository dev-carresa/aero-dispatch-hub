
import { useState, useRef, useEffect } from 'react';

interface PlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface UsePlacesAutocompleteProps {
  inputValue: string;
  onPlaceSelect: (address: string, placeId?: string) => void;
}

export function usePlacesAutocomplete({ inputValue, onPlaceSelect }: UsePlacesAutocompleteProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);

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

  // Fetch predictions when input changes
  useEffect(() => {
    if (inputValue.length > 2 && autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(
        { input: inputValue },
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
  }, [inputValue]);

  // Handle place selection
  const handlePlaceSelect = (prediction: PlacePrediction) => {
    onPlaceSelect(prediction.description, prediction.place_id);
    setPredictions([]);
    setShowDropdown(false);
  };

  return {
    isLoading,
    predictions,
    showDropdown,
    setShowDropdown,
    handlePlaceSelect
  };
}
