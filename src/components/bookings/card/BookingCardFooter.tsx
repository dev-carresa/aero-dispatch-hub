
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BookingCardFooterProps {
  price: string;
  driver: string;
  onAssignDriver: () => void;
  onAssignVehicle: () => void;
}

export function BookingCardFooter({
  driver,
  onAssignDriver,
  onAssignVehicle
}: BookingCardFooterProps) {
  return (
    <CardFooter className="px-4 py-2 border-t flex justify-end gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs"
            onClick={onAssignDriver}
          >
            {driver ? "Change Driver" : "Assign Driver"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {driver ? "Change assigned driver" : "Assign a driver to this booking"}
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs"
            onClick={onAssignVehicle}
          >
            Assign Fleet
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Assign a fleet to this booking
        </TooltipContent>
      </Tooltip>
      
      <Button 
        className="h-7 ml-2"
        size="sm"
      >
        View Details
      </Button>
    </CardFooter>
  );
}
