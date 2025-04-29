
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
    <CardContent className="p-4 flex flex-col md:flex-row gap-6">
      {/* Left Section - Main Service Info */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base">{vehicle}</h3>
            <p className="text-sm text-muted-foreground">Premium Transportation</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-2 mt-4">
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <span className="text-sm">{customer}</span>
          </div>
          
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">From:</span>
              <span className="text-sm font-medium line-clamp-1">{origin}</span>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">To:</span>
              <span className="text-sm font-medium line-clamp-1">{destination}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Section - Details */}
      <div className="flex-1 space-y-3">
        <div className="bg-slate-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CalendarClock className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">{date} at {time}</span>
          </div>
          
          {driver && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm">Driver: {driver}</span>
            </div>
          )}
          
          {flightNumber && (
            <div className="flex items-center gap-2">
              <Plane className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm">Flight: {flightNumber}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {fleet && (
            <Badge variant="outline" className="text-xs bg-blue-50">
              Fleet: {fleet}
            </Badge>
          )}
          
          {source && (
            <Badge variant="outline" className="text-xs">
              <FileText className="h-3 w-3 mr-1" />
              {source}
            </Badge>
          )}
        </div>
      </div>
    </CardContent>
  );
}
