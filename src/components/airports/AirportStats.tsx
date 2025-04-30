
import { Card, CardContent } from "@/components/ui/card";
import { Building, MapPin, Users, Clock } from "lucide-react";
import { MeetingPoint } from "@/types/airport";

interface AirportStatsProps {
  meetingPointsCount: number;
  terminalsCount: number;
  fleetsCount: number;
  lastUpdated?: string;
}

export function AirportStats({ 
  meetingPointsCount, 
  terminalsCount, 
  fleetsCount, 
  lastUpdated 
}: AirportStatsProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="hover-scale card-gradient">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Meeting Points</p>
              <p className="text-2xl font-bold">{meetingPointsCount}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover-scale card-gradient">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Terminals</p>
              <p className="text-2xl font-bold">{terminalsCount}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover-scale card-gradient">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fleets Assigned</p>
              <p className="text-2xl font-bold">{fleetsCount}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover-scale card-gradient">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p className="text-2xl font-bold">{formatDate(lastUpdated)}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
