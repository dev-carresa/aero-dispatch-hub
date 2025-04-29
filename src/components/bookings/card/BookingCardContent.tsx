
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
    <CardContent className="p-3 flex flex-col md:flex-row gap-4">
      {/* Left Section - Main Service Info */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
            <Car className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{vehicle}</h3>
            <p className="text-xs text-muted-foreground">Premium Transportation</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-1.5 mt-2">
          <div className="flex items-start gap-1.5">
            <User className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <span className="text-xs">{customer}</span>
          </div>
          
          <div className="flex items-start gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground leading-none">From:</span>
              <span className="text-xs font-medium line-clamp-1">{origin}</span>
            </div>
          </div>
          
          <div className="flex items-start gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground leading-none">To:</span>
              <span className="text-xs font-medium line-clamp-1">{destination}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Section - Details */}
      <div className="flex-1 space-y-2">
        <div className="bg-slate-50 p-2 rounded-lg">
          <div className="flex items-center gap-1.5 mb-1">
            <CalendarClock className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-xs font-medium">{date} at {time}</span>
          </div>
          
          {driver && (
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-xs">Driver: {driver}</span>
            </div>
          )}
          
          {flightNumber && (
            <div className="flex items-center gap-1.5">
              <Plane className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-xs">Flight: {flightNumber}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {fleet && (
            <Badge variant="outline" className="text-xs bg-blue-50 h-5 px-1.5">
              Fleet: {fleet}
            </Badge>
          )}
          
          {source && (
            <Badge variant="outline" className="text-xs h-5 px-1.5">
              <FileText className="h-2.5 w-2.5 mr-1" />
              {source}
            </Badge>
          )}
        </div>
      </div>
    </CardContent>
  );
}
