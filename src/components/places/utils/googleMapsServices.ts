
/**
 * Creates and initializes the AutocompleteService
 * @returns The initialized AutocompleteService or null if not available
 */
export function createAutocompleteService(): google.maps.places.AutocompleteService | null {
  try {
    if (window.google?.maps?.places?.AutocompleteService) {
      return new window.google.maps.places.AutocompleteService();
    }
  } catch (error) {
    console.error("Error initializing AutocompleteService:", error);
  }
  return null;
}

/**
 * Creates and initializes the PlacesService with a dummy element
 * @returns The initialized PlacesService or null if not available
 */
export function createPlacesService(): any {
  try {
    if (window.google?.maps?.places) {
      const dummyElement = document.createElement('div');
      // Using any temporarily due to type issues
      return new (google.maps.places as any).PlacesService(dummyElement);
    }
  } catch (error) {
    console.error("Error initializing PlacesService:", error);
  }
  return null;
}

/**
 * Gets place predictions from the Google Maps Places API
 * @param service The AutocompleteService instance
 * @param input The input text to search for
 * @returns A promise that resolves to the place predictions
 */
export function getPlacePredictions(
  service: google.maps.places.AutocompleteService | null, 
  input: string
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    if (!service) {
      reject(new Error("Autocomplete service not available"));
      return;
    }

    try {
      service.getPlacePredictions(
        { 
          input,
          types: [] // Empty array to get all types
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            resolve(predictions);
          } else {
            resolve([]);
          }
        }
      );
    } catch (error) {
      console.error("Error getting place predictions:", error);
      resolve([]);
    }
  });
}

/**
 * Gets place details from the Google Maps Places API
 * @param service The PlacesService instance
 * @param placeId The ID of the place to get details for
 * @returns A promise that resolves to the place details
 */
export function getPlaceDetails(service: any, placeId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!service) {
      if (window.google?.maps?.places) {
        try {
          const dummyElement = document.createElement('div');
          // Using any temporarily due to type issues
          service = new (google.maps.places as any).PlacesService(dummyElement);
        } catch (error) {
          console.error("Error initializing PlacesService:", error);
          reject(error);
          return;
        }
      } else {
        reject(new Error("Google Maps Places API not loaded"));
        return;
      }
    }
    
    try {
      service.getDetails(
        {
          placeId: placeId,
          fields: ['geometry', 'formatted_address', 'name']
        },
        (result: any, status: any) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && result) {
            resolve(result);
          } else {
            console.error("Error getting place details:", status);
            reject(new Error(`Error getting place details: ${status}`));
          }
        }
      );
    } catch (error) {
      console.error("Exception getting place details:", error);
      reject(error);
    }
  });
}
