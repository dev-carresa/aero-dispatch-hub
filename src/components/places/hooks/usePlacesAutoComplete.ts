
import { useState, useRef, useEffect, useCallback } from 'react';

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

// Singleton pattern to track API loading state across all component instances
const googleMapsState = {
  isScriptLoading: false,
  isScriptLoaded: false,
  hasInitialized: false,
  errorOccurred: false
};

export function usePlacesAutocomplete({ inputValue, onPlaceSelect }: UsePlacesAutocompleteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const timeoutRef = useRef<number | null>(null);

  // Initialize Google Maps API
  const initializeGoogleMaps = useCallback(() => {
    // Return early if already loaded
    if (window.google?.maps?.places?.AutocompleteService || googleMapsState.isScriptLoading) {
      return;
    }

    const loadGoogleMapsScript = () => {
      googleMapsState.isScriptLoading = true;
      setIsLoading(true);
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA4fi6Kf6-HgLZkON89ASKUn-u2pdIEspE&libraries=places&callback=initializeAutocomplete`;
      script.async = true;
      script.defer = true;
      
      window.initializeAutocomplete = () => {
        googleMapsState.isScriptLoaded = true;
        googleMapsState.isScriptLoading = false;
        googleMapsState.hasInitialized = true;
        setIsLoading(false);
        
        // Try to initialize autocomplete service right after script loads
        if (window.google?.maps?.places) {
          try {
            autocompleteService.current = new window.google.maps.places.AutocompleteService();
          } catch (error) {
            console.error("Error initializing AutocompleteService after script load:", error);
          }
        }
      };

      // Add error handling for script loading
      script.onerror = () => {
        console.error("Google Maps script failed to load");
        googleMapsState.isScriptLoading = false;
        googleMapsState.errorOccurred = true;
        setIsLoading(false);
      };
      
      document.head.appendChild(script);
    };
    
    loadGoogleMapsScript();
  }, []);

  // Try to initialize as soon as component mounts
  useEffect(() => {
    // If Google Maps is already loaded
    if (window.google?.maps?.places) {
      googleMapsState.isScriptLoaded = true;
      googleMapsState.hasInitialized = true;
      setIsLoading(false);
      
      try {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
      } catch (error) {
        console.error("Error initializing existing AutocompleteService:", error);
      }
    } else if (!googleMapsState.isScriptLoading && !googleMapsState.isScriptLoaded) {
      // Need to load the script
      initializeGoogleMaps();
    }

    // Add a timeout to stop showing loading state after 5 seconds
    // to prevent infinite loading if Google Maps fails silently
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    
    return () => {
      if (loadingTimeout) clearTimeout(loadingTimeout);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [initializeGoogleMaps]);

  // Fetch predictions when input changes
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only search if we have an input and the service is available
    if (inputValue.length > 2 && autocompleteService.current) {
      // Debounce the API calls
      timeoutRef.current = window.setTimeout(() => {
        try {
          autocompleteService.current?.getPlacePredictions(
            { 
              input: inputValue,
              types: ['establishment', 'geocode', 'address', 'transit_station', 'airport', 'lodging']
            },
            (predictions, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                setPredictions(predictions as PlacePrediction[]);
                setShowDropdown(true);
              } else {
                setPredictions([]);
                setShowDropdown(false);
              }
              // Ensure we're not stuck in loading state after attempts to get predictions
              setIsLoading(false);
            }
          );
        } catch (error) {
          console.error("Error getting place predictions:", error);
          setPredictions([]);
          setShowDropdown(false);
          setIsLoading(false);
        }
      }, 300);
    } else {
      setPredictions([]);
      setShowDropdown(false);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
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
