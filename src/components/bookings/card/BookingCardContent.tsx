
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
    <CardContent className="px-4 py-2">
      <div className="text-sm space-y-2">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{customer}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="line-clamp-1">{origin} → {destination}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
          <span>{date} at {time}</span>
        </div>
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4 text-muted-foreground" />
          <span>{vehicle}</span>
          {fleet && (
            <Badge variant="outline" className="text-xs ml-2">
              Fleet: {fleet}
            </Badge>
          )}
        </div>
        {driver && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>Driver: {driver}</span>
          </div>
        )}
        {flightNumber && (
          <div className="flex items-center gap-2">
            <Plane className="h-4 w-4 text-muted-foreground" />
            <span>Flight: {flightNumber}</span>
          </div>
        )}
        {source && (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>Source: {source}</span>
          </div>
        )}
      </div>
    </CardContent>
  );
}
