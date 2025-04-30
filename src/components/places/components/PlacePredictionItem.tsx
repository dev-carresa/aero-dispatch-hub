
import { MapPin } from 'lucide-react';

interface PlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface PlacePredictionItemProps {
  prediction: PlacePrediction;
  onSelect: (prediction: PlacePrediction) => void;
}

export function PlacePredictionItem({ prediction, onSelect }: PlacePredictionItemProps) {
  return (
    <div
      key={prediction.place_id}
      className="px-3 py-2 hover:bg-muted cursor-pointer flex items-start gap-2"
      onClick={() => onSelect(prediction)}
    >
      <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-muted-foreground" />
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
