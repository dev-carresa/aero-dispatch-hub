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

// Keep track of script loading state globally
let isScriptLoading = false;
let isScriptLoaded = false;

export function usePlacesAutocomplete({ inputValue, onPlaceSelect }: UsePlacesAutocompleteProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);

  // Load Google Maps script only once
  useEffect(() => {
    if (!window.google && !isScriptLoading && !isScriptLoaded) {
      const loadGoogleMapsScript = () => {
        isScriptLoading = true;
        setIsLoading(true);
        
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA4fi6Kf6-HgLZkON89ASKUn-u2pdIEspE&libraries=places&callback=initializeAutocomplete`;
        script.async = true;
        script.defer = true;
        
        window.initializeAutocomplete = () => {
          isScriptLoaded = true;
          isScriptLoading = false;
          setIsLoading(false);
        };

        script.onerror = () => {
          console.error("Google Maps script failed to load");
          isScriptLoading = false;
          setIsLoading(false);
        };
        
        document.head.appendChild(script);
      };
      
      loadGoogleMapsScript();
      
      return () => {
        // Don't remove the script on component unmount
        // Just clean up the global callback
        if (window.initializeAutocomplete) {
          delete window.initializeAutocomplete;
        }
      };
    } else if (window.google) {
      // If Google is already available, no need to load
      isScriptLoaded = true;
    }
  }, []);

  // Initialize autocomplete service
  useEffect(() => {
    if (isScriptLoaded && window.google && !autocompleteService.current) {
      try {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
      } catch (error) {
        console.error("Error initializing AutocompleteService:", error);
      }
    }
  }, [isScriptLoaded]);

  // Fetch predictions when input changes
  useEffect(() => {
    // Cancel any previous requests
    const timeoutId = setTimeout(() => {
      if (inputValue.length > 2 && autocompleteService.current) {
        try {
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
        } catch (error) {
          console.error("Error getting place predictions:", error);
          setPredictions([]);
          setShowDropdown(false);
        }
      } else {
        setPredictions([]);
        setShowDropdown(false);
      }
    }, 300); // Debounce the API calls

    return () => clearTimeout(timeoutId);
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
