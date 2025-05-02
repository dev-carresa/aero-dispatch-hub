
import { TripType } from '@/lib/schemas/bookingSchema';
import { getTripTypeInfo } from '@/components/places/utils/tripTypeDetector';
import { Plane, ArrowRightLeft, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TripTypeBadgeProps {
  tripType: TripType;
}

export function TripTypeBadge({ tripType }: TripTypeBadgeProps) {
  const { label, className, description } = getTripTypeInfo(tripType);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${className} border`}>
            {tripType === 'arrival' ? (
              <Plane className="h-3 w-3 mr-1" />
            ) : tripType === 'departure' ? (
              <Plane className="h-3 w-3 mr-1 rotate-45" />
            ) : (
              <ArrowRightLeft className="h-3 w-3 mr-1" />
            )}
            {label}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center">
            <Info className="h-3 w-3 mr-1 text-muted-foreground" />
            <span>{description}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
