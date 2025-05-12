
import { useState, useEffect, useCallback } from 'react';

// Singleton pattern to track API loading state across all component instances
const googleMapsState = {
  isScriptLoading: false,
  isScriptLoaded: false,
  hasInitialized: false,
  errorOccurred: false,
  scriptLoadTimeout: null as number | null
};

interface UseGoogleMapsApiResult {
  isLoading: boolean;
  isLoaded: boolean;
  hasError: boolean;
  initializeGoogleMaps: () => void;
}

/**
 * Hook to handle Google Maps API loading and initialization
 * Uses a singleton pattern to manage the API loading state across components
 */
export function useGoogleMapsApi(): UseGoogleMapsApiResult {
  const [isLoading, setIsLoading] = useState(googleMapsState.isScriptLoading);
  const [isLoaded, setIsLoaded] = useState(googleMapsState.isScriptLoaded);
  const [hasError, setHasError] = useState(googleMapsState.errorOccurred);

  // Initialize Google Maps API
  const initializeGoogleMaps = useCallback(() => {
    // Check if Google Maps API is already available
    if (window.google?.maps?.places?.AutocompleteService) {
      googleMapsState.isScriptLoaded = true;
      googleMapsState.hasInitialized = true;
      setIsLoaded(true);
      setIsLoading(false);
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
        setIsLoaded(true);
        setIsLoading(false);
        
        // Clear the script loading timeout
        if (googleMapsState.scriptLoadTimeout) {
          window.clearTimeout(googleMapsState.scriptLoadTimeout);
          googleMapsState.scriptLoadTimeout = null;
        }
      };

      // Add error handling for script loading
      script.onerror = () => {
        console.error("Google Maps script failed to load");
        googleMapsState.isScriptLoading = false;
        googleMapsState.errorOccurred = true;
        setIsLoading(false);
        setHasError(true);
        
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
          setHasError(true);
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
      setIsLoaded(true);
    } else if (!googleMapsState.isScriptLoading && !googleMapsState.isScriptLoaded) {
      // Need to load the script
      initializeGoogleMaps();
    }
    
    return () => {
      // Clean up the script loading timeout
      if (googleMapsState.scriptLoadTimeout) {
        window.clearTimeout(googleMapsState.scriptLoadTimeout);
        googleMapsState.scriptLoadTimeout = null;
      }
    };
  }, [initializeGoogleMaps]);

  return {
    isLoading,
    isLoaded,
    hasError,
    initializeGoogleMaps
  };
}
