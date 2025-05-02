
/**
 * Detects the type of place based on the prediction data from Google Places API
 */
export type PlaceType = 'airport' | 'hotel' | 'train' | 'other';

export function detectPlaceType(prediction: any): PlaceType {
  if (!prediction || !prediction.types) {
    return 'other';
  }

  const types = prediction.types;

  if (types.includes('airport') || types.includes('transit_station') && prediction.description.toLowerCase().includes('airport')) {
    return 'airport';
  }

  if (types.includes('lodging') || types.includes('hotel')) {
    return 'hotel';
  }

  if (
    types.includes('transit_station') || 
    types.includes('train_station') || 
    types.includes('subway_station') || 
    prediction.description.toLowerCase().includes('gare')
  ) {
    return 'train';
  }

  return 'other';
}
