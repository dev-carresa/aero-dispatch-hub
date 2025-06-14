
/// <reference types="vite/client" />

// Google Maps API type declarations
declare namespace google {
  namespace maps {
    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    class LatLngBounds {
      constructor(sw?: LatLng, ne?: LatLng);
      extend(latLng: LatLng): LatLngBounds;
    }

    namespace places {
      class AutocompleteService {
        getPlacePredictions(
          request: AutocompletionRequest,
          callback: (results: AutocompletePrediction[] | null, status: PlacesServiceStatus) => void
        ): void;
      }

      interface AutocompletionRequest {
        input: string;
        bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
        componentRestrictions?: { country: string | string[] };
        location?: google.maps.LatLng;
        offset?: number;
        radius?: number;
        sessionToken?: google.maps.places.AutocompleteSessionToken;
        types?: string[];
      }

      interface AutocompletePrediction {
        description: string;
        place_id: string;
        structured_formatting: {
          main_text: string;
          main_text_matched_substrings: Array<{
            offset: number;
            length: number;
          }>;
          secondary_text: string;
        };
        matched_substrings: Array<{
          offset: number;
          length: number;
        }>;
        terms: Array<{
          offset: number;
          value: string;
        }>;
        types: string[];
      }

      interface PlaceResult {
        address_components?: google.maps.GeocoderAddressComponent[];
        formatted_address?: string;
        geometry?: {
          location: LatLng;
          viewport?: LatLngBounds;
        };
        place_id?: string;
        name?: string;
      }

      // Add the enum for PlacesServiceStatus
      enum PlacesServiceStatus {
        OK = 'OK',
        ZERO_RESULTS = 'ZERO_RESULTS',
        OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
        REQUEST_DENIED = 'REQUEST_DENIED',
        INVALID_REQUEST = 'INVALID_REQUEST',
        UNKNOWN_ERROR = 'UNKNOWN_ERROR',
        NOT_FOUND = 'NOT_FOUND'
      }

      class AutocompleteSessionToken {}

      interface AutocompleteOptions {
        bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
        componentRestrictions?: { country: string | string[] };
        fields?: string[];
        strictBounds?: boolean;
        types?: string[];
      }

      class Autocomplete {
        constructor(inputField: HTMLInputElement, options?: AutocompleteOptions);
        addListener(eventName: string, handler: () => void): google.maps.MapsEventListener;
        getPlace(): PlaceResult;
      }
      
      // Add the missing PlacesService class
      class PlacesService {
        constructor(attrContainer: HTMLElement | google.maps.Map);
        getDetails(
          request: PlaceDetailsRequest,
          callback: (result: PlaceResult | null, status: PlacesServiceStatus) => void
        ): void;
        findPlaceFromQuery(
          request: FindPlaceFromQueryRequest,
          callback: (results: PlaceResult[] | null, status: PlacesServiceStatus) => void
        ): void;
        nearbySearch(
          request: PlaceSearchRequest,
          callback: (results: PlaceResult[] | null, status: PlacesServiceStatus, pagination: PlaceSearchPagination | null) => void
        ): void;
        textSearch(
          request: TextSearchRequest,
          callback: (results: PlaceResult[] | null, status: PlacesServiceStatus, pagination: PlaceSearchPagination | null) => void
        ): void;
      }

      interface PlaceDetailsRequest {
        placeId: string;
        fields?: string[];
        sessionToken?: google.maps.places.AutocompleteSessionToken;
      }

      interface FindPlaceFromQueryRequest {
        query: string;
        fields?: string[];
        locationBias?: google.maps.LatLng | google.maps.LatLngLiteral | google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral | google.maps.Circle | google.maps.CircleLiteral | string;
      }

      interface PlaceSearchRequest {
        bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
        location?: google.maps.LatLng | google.maps.LatLngLiteral;
        radius?: number;
        keyword?: string;
        minPriceLevel?: number;
        maxPriceLevel?: number;
        name?: string;
        openNow?: boolean;
        rankBy?: number;
        type?: string;
      }

      interface TextSearchRequest {
        location?: google.maps.LatLng | google.maps.LatLngLiteral;
        radius?: number;
        query: string;
        bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
        type?: string;
      }

      interface PlaceSearchPagination {
        nextPage(): void;
        hasNextPage: boolean;
      }
    }

    interface GeocoderAddressComponent {
      long_name: string;
      short_name: string;
      types: string[];
    }

    interface MapsEventListener {
      remove(): void;
    }

    namespace event {
      function clearInstanceListeners(instance: object): void;
    }
  }
}

// Add a global callback function for Google Maps API
interface Window {
  initializeAutocomplete?: () => void;
}
