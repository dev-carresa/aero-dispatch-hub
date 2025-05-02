
import { PlaceType, detectPlaceType } from './placeTypeDetector';

export type TripType = "arrival" | "departure" | "transfer";

interface LocationData {
  description: string;
  placeType?: PlaceType;
}

/**
 * Detects the trip type based on origin and destination
 * - arrival: from airport to hotel/other
 * - departure: from hotel/other to airport
 * - transfer: between non-airport locations or between airports
 */
export const detectTripType = (
  origin: LocationData,
  destination: LocationData
): TripType => {
  // First try with already detected place types
  const originType = origin.placeType;
  const destType = destination.placeType;
  
  if (originType === 'airport' && destType !== 'airport') {
    return 'arrival';
  } else if (originType !== 'airport' && destType === 'airport') {
    return 'departure';
  }
  
  // If place types aren't available, try to detect from the text
  const originLower = origin.description.toLowerCase();
  const destLower = destination.description.toLowerCase();
  
  const airportKeywords = ['airport', 'aeroport', 'aeropuerto', 'flughafen', 'terminal'];
  
  const isOriginAirport = airportKeywords.some(keyword => originLower.includes(keyword));
  const isDestAirport = airportKeywords.some(keyword => destLower.includes(keyword));
  
  if (isOriginAirport && !isDestAirport) {
    return 'arrival';
  } else if (!isOriginAirport && isDestAirport) {
    return 'departure';
  }
  
  return 'transfer';
};

// Helper function to get trip type badge information
export const getTripTypeInfo = (tripType: TripType) => {
  switch (tripType) {
    case 'arrival':
      return { 
        label: 'Arrival', 
        className: 'bg-blue-100 text-blue-700 border-blue-200',
        description: 'From airport to destination'
      };
    case 'departure':
      return { 
        label: 'Departure', 
        className: 'bg-green-100 text-green-700 border-green-200',
        description: 'To airport from origin' 
      };
    case 'transfer':
      return { 
        label: 'Transfer', 
        className: 'bg-amber-100 text-amber-700 border-amber-200',
        description: 'Between non-airport locations' 
      };
    default:
      return { 
        label: 'Unknown', 
        className: 'bg-gray-100 text-gray-700 border-gray-200',
        description: 'Route type not determined' 
      };
  }
};
