
import {
  CalendarClock,
  Car,
  FileText,
  MapPin,
  Plane,
  User,
} from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BookingCardContentProps {
  customer: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  vehicle: string;
  driver: string;
  fleet?: string;
  flightNumber?: string;
  source?: string;
}

export function BookingCardContent({
  customer,
  origin,
  destination,
  date,
  time,
  vehicle,
  driver,
  fleet,
  flightNumber,
  source,
}: BookingCardContentProps) {
  return (
    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-3">
      {/* Left Column - Customer & Journey Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="font-medium">{customer}</span>
        </div>
        
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">From:</span>
            <span className="line-clamp-1">{origin}</span>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">To:</span>
            <span className="line-clamp-1">{destination}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-muted-foreground shrink-0" />
          <span>{date} at {time}</span>
        </div>
      </div>
      
      {/* Right Column - Vehicle, Driver & Other Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4 text-muted-foreground shrink-0" />
          <span>{vehicle}</span>
        </div>
        
        {driver && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>Driver: {driver}</span>
          </div>
        )}
        
        {fleet && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Fleet: {fleet}
            </Badge>
          </div>
        )}
        
        {flightNumber && (
          <div className="flex items-center gap-2">
            <Plane className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>Flight: {flightNumber}</span>
          </div>
        )}
        
        {source && (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>Source: {source}</span>
          </div>
        )}
      </div>
    </CardContent>
  );
}
