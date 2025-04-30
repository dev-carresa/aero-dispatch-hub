
# Google Places Autocomplete Integration

This component adds Google Places autocomplete functionality to your input fields. It allows users to search for and select locations when entering addresses.

## Setup

1. **Get a Google Maps API key**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the "Places API" and "Maps JavaScript API"
   - Create an API key with appropriate restrictions

2. **Replace the API key**:
   - In `src/components/places/PlacesAutocompleteInput.tsx`, replace `GOOGLE_API_KEY_PLACEHOLDER` with your actual Google API key.

## Usage

```tsx
import PlacesAutocompleteInput from "@/components/places/PlacesAutocompleteInput";

function MyForm() {
  const handlePlaceSelect = (address: string, placeId?: string) => {
    console.log('Selected address:', address);
    console.log('Place ID:', placeId);
    // Update your form state or do something with the selected address
  };

  return (
    <PlacesAutocompleteInput
      onPlaceSelect={handlePlaceSelect}
      placeholder="Enter an address"
    />
  );
}
```

## Security Note

For production, always add proper restrictions to your Google Maps API key to prevent unauthorized use:
- HTTP referrer restrictions
- IP address restrictions
- Use environment variables for API keys in production
