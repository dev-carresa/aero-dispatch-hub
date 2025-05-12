
import { useState, useRef, useEffect, useCallback } from 'react';
import { useGoogleMapsApi } from './useGoogleMapsApi';
import { 
  createAutocompleteService, 
  createPlacesService, 
  getPlacePredictions, 
  getPlaceDetails 
} from '../utils/googleMapsServices';

interface PlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  types?: string[];
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
  // Use any type temporarily for placesService
  const placesService = useRef<any>(null);
  const timeoutRef = useRef<number | null>(null);
  const { isLoaded, initializeGoogleMaps } = useGoogleMapsApi();

  // Initialize services when Google Maps API is loaded
  useEffect(() => {
    if (isLoaded && window.google?.maps?.places) {
      if (!autocompleteService.current) {
        autocompleteService.current = createAutocompleteService();
      }
      if (!placesService.current) {
        placesService.current = createPlacesService();
      }
    }
  }, [isLoaded]);

  // Fetch predictions when input changes
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only search if we have an input and the service is available
    if (inputValue.length > 2) {
      setIsLoading(true);
      
      // Debounce the API calls
      timeoutRef.current = window.setTimeout(async () => {
        // Check if the service is available
        if (!autocompleteService.current) {
          if (window.google?.maps?.places) {
            autocompleteService.current = createAutocompleteService();
          } else {
            // Service not available, try to initialize Google Maps
            if (!isLoaded) {
              initializeGoogleMaps();
            }
            setIsLoading(false);
            return;
          }
        }
        
        // If service is still not available, exit
        if (!autocompleteService.current) {
          setIsLoading(false);
          return;
        }

        try {
          const results = await getPlacePredictions(autocompleteService.current, inputValue);
          setPredictions(results);
          setShowDropdown(results.length > 0);
        } catch (error) {
          console.error("Error getting predictions:", error);
          setPredictions([]);
          setShowDropdown(false);
        }
        
        setIsLoading(false);
      }, 300);
    } else {
      setPredictions([]);
      setShowDropdown(false);
      setIsLoading(false);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inputValue, isLoaded, initializeGoogleMaps]);

  // Get place details with coordinates
  const getPlaceDetailsWithCoordinates = useCallback((placeId: string): Promise<any> => {
    return getPlaceDetails(placesService.current, placeId);
  }, []);

  // Handle place selection
  const handlePlaceSelect = (prediction: PlacePrediction) => {
    // Call the onPlaceSelect callback with the address and placeId
    onPlaceSelect(prediction.description, prediction.place_id);
    // Explicitly clear predictions and hide dropdown
    setPredictions([]);
    setShowDropdown(false);
  };

  return {
    isLoading,
    predictions,
    showDropdown,
    setShowDropdown,
    handlePlaceSelect,
    getPlaceDetails: getPlaceDetailsWithCoordinates
  };
}
