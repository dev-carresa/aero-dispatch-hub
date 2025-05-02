
export type PlaceType = 'address' | 'airport' | 'train' | 'hotel' | 'restaurant' | 'store' | 'business' | 'other';

interface PlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  types?: string[];
}

// Detect the type of place based on the prediction data
export function detectPlaceType(prediction: PlacePrediction): PlaceType {
  if (!prediction.types || prediction.types.length === 0) {
    return 'other';
  }

  const types = prediction.types;
  const description = prediction.description.toLowerCase();
  
  // Check for airports
  if (types.includes('airport') || 
      description.includes('airport') || 
      description.includes('aéroport') ||
      description.includes('terminal')) {
    return 'airport';
  }
  
  // Check for train stations
  if (types.includes('train_station') || 
      description.includes('train station') || 
      description.includes('gare') ||
      description.includes('station')) {
    return 'train';
  }
  
  // Check for hotels
  if (types.includes('lodging') || 
      types.includes('hotel') ||
      description.includes('hotel') || 
      description.includes('hôtel') ||
      description.includes('inn') ||
      description.includes('resort')) {
    return 'hotel';
  }

  // Check for restaurants
  if (types.includes('restaurant') || 
      types.includes('food') || 
      types.includes('cafe') ||
      description.includes('restaurant') ||
      description.includes('café') ||
      description.includes('bistro')) {
    return 'restaurant';
  }

  // Check for stores/shops
  if (types.includes('store') || 
      types.includes('shopping_mall') || 
      types.includes('supermarket') ||
      description.includes('store') ||
      description.includes('shop') ||
      description.includes('mall') ||
      description.includes('magasin') ||
      description.includes('boutique')) {
    return 'store';
  }

  // Check for businesses/offices
  if (types.includes('establishment') || 
      types.includes('office') || 
      types.includes('corporate') ||
      description.includes('office') ||
      description.includes('bureau') ||
      description.includes('company') ||
      description.includes('entreprise')) {
    return 'business';
  }

  // Default to address for most common case
  if (types.includes('route') || 
      types.includes('street_address') || 
      types.includes('address') ||
      types.includes('premise')) {
    return 'address';
  }

  return 'other';
}
