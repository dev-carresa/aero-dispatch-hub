
import { MapPin, Airplane, Hotel, TrainFront } from 'lucide-react';
import { PlaceType, detectPlaceType } from '../utils/placeTypeDetector';

interface PlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  types?: string[];
}

interface PlacePredictionItemProps {
  prediction: PlacePrediction;
  onSelect: (prediction: PlacePrediction) => void;
}

export function PlacePredictionItem({ prediction, onSelect }: PlacePredictionItemProps) {
  const placeType = detectPlaceType(prediction);
  
  return (
    <div
      key={prediction.place_id}
      className="px-3 py-2 hover:bg-muted cursor-pointer flex items-start gap-2"
      onClick={() => onSelect(prediction)}
    >
      {renderIcon(placeType)}
      <div className="flex-1 overflow-hidden">
        <div className="text-sm font-medium truncate">
          {prediction.structured_formatting.main_text}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {prediction.structured_formatting.secondary_text}
        </div>
      </div>
    </div>
  );
}

function renderIcon(type: PlaceType) {
  switch (type) {
    case 'airport':
      return <Airplane className="h-4 w-4 mt-1 flex-shrink-0 text-blue-500" />;
    case 'hotel':
      return <Hotel className="h-4 w-4 mt-1 flex-shrink-0 text-amber-500" />;
    case 'train':
      return <TrainFront className="h-4 w-4 mt-1 flex-shrink-0 text-green-500" />;
    default:
      return <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-muted-foreground" />;
  }
}
