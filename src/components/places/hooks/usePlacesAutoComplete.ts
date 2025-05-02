
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
  errorOccurred: false,
  scriptLoadTimeout: null as number | null
};

export function usePlacesAutocomplete({ inputValue, onPlaceSelect }: UsePlacesAutocompleteProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const timeoutRef = useRef<number | null>(null);

  // Initialize Google Maps API
  const initializeGoogleMaps = useCallback(() => {
    // Check if Google Maps API is already available
    if (window.google?.maps?.places?.AutocompleteService) {
      googleMapsState.isScriptLoaded = true;
      googleMapsState.hasInitialized = true;
      setIsLoading(false);
      
      try {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
      } catch (error) {
        console.error("Error initializing existing AutocompleteService:", error);
      }
      return;
    }
    
    // Return early if already loading
    if (googleMapsState.isScriptLoading) {
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
        
        // Clear the script loading timeout
        if (googleMapsState.scriptLoadTimeout) {
          window.clearTimeout(googleMapsState.scriptLoadTimeout);
          googleMapsState.scriptLoadTimeout = null;
        }
        
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
        
        // Clear the script loading timeout
        if (googleMapsState.scriptLoadTimeout) {
          window.clearTimeout(googleMapsState.scriptLoadTimeout);
          googleMapsState.scriptLoadTimeout = null;
        }
      };
      
      // Set a timeout to avoid infinite loading state
      googleMapsState.scriptLoadTimeout = window.setTimeout(() => {
        if (googleMapsState.isScriptLoading && !googleMapsState.isScriptLoaded) {
          console.error("Google Maps script loading timeout");
          googleMapsState.isScriptLoading = false;
          googleMapsState.errorOccurred = true;
          setIsLoading(false);
        }
      }, 10000); // 10 seconds timeout
      
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
      
      try {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
      } catch (error) {
        console.error("Error initializing existing AutocompleteService:", error);
      }
    } else if (!googleMapsState.isScriptLoading && !googleMapsState.isScriptLoaded) {
      // Need to load the script
      initializeGoogleMaps();
    }
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      // Clean up the script loading timeout
      if (googleMapsState.scriptLoadTimeout) {
        window.clearTimeout(googleMapsState.scriptLoadTimeout);
        googleMapsState.scriptLoadTimeout = null;
      }
    };
  }, [initializeGoogleMaps]);

  // Fetch predictions when input changes
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only search if we have an input and the service is available
    if (inputValue.length > 2) {
      setIsLoading(true);
      
      // Debounce the API calls
      timeoutRef.current = window.setTimeout(() => {
        // Check if the service is available
        if (!autocompleteService.current) {
          if (window.google?.maps?.places) {
            try {
              autocompleteService.current = new window.google.maps.places.AutocompleteService();
            } catch (error) {
              console.error("Error initializing AutocompleteService on demand:", error);
              setIsLoading(false);
              return;
            }
          } else {
            // Service not available, try to initialize Google Maps
            if (!googleMapsState.isScriptLoading && !googleMapsState.isScriptLoaded) {
              initializeGoogleMaps();
            }
            setIsLoading(false);
            return;
          }
        }
        
        try {
          // Using empty types array to get all types (both establishments and addresses)
          autocompleteService.current?.getPlacePredictions(
            { 
              input: inputValue,
              types: [] // Empty array to get all types
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
      setIsLoading(false);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inputValue, initializeGoogleMaps]);

  // Handle place selection
  const handlePlaceSelect = (prediction: PlacePrediction) => {
    // Call the onPlaceSelect callback with the address and placeId
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
