import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MeetingPointsList } from "@/components/airports/meeting-points/MeetingPointsList";
import { sampleAirports } from "@/data/sampleAirports";
import { getMeetingPointsByAirport } from "@/data/sampleMeetingPoints";
import { Airport, MeetingPoint } from "@/types/airport";
import { useToast } from "@/hooks/use-toast";
import { AirportBreadcrumbs } from "@/components/airports/AirportBreadcrumbs";
import { AirportStats } from "@/components/airports/AirportStats";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AirportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [airport, setAirport] = useState<Airport | null>(null);
  const [meetingPoints, setMeetingPoints] = useState<MeetingPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate API call
    const airportId = parseInt(id || "0");
    const foundAirport = sampleAirports.find(a => a.id === airportId);
    
    if (foundAirport) {
      setAirport(foundAirport);
      const points = getMeetingPointsByAirport(airportId);
      setMeetingPoints(points);
    } else {
      toast({
        title: "Error",
        description: "Airport not found",
        variant: "destructive",
      });
      navigate("/airports", { replace: true });
    }
    
    setIsLoading(false);
  }, [id, navigate, toast]);

  const handleDeleteMeetingPoint = (meetingPointId: number) => {
    // Simulate API call to delete meeting point
    setMeetingPoints(prev => prev.filter(mp => mp.id !== meetingPointId));
    
    toast({
      title: "Meeting point deleted",
      description: "The meeting point has been successfully deleted",
    });
  };

  // Calculate stats for the stats component
  const getUniqueTerminals = () => {
    if (!meetingPoints.length) return 0;
    return new Set(meetingPoints.map(mp => mp.terminal)).size;
  };

  const getUniqueFleets = () => {
    if (!meetingPoints.length) return 0;
    const fleetIds = meetingPoints
      .filter(mp => mp.fleetId !== undefined)
      .map(mp => mp.fleetId);
    return new Set(fleetIds).size;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40 mt-2" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!airport) {
    return <div>Airport not found</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/airports">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {airport.name} ({airport.code})
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>{airport.city}, {airport.country}</span>
              <Badge variant="outline" className="text-xs font-normal">
                {meetingPoints.length} Meeting Point{meetingPoints.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild className="shadow-sm">
            <Link to={`/airports/${airport.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Airport
            </Link>
          </Button>
          <Button asChild className="shadow-sm">
            <Link to={`/airports/meeting-points/new?airportId=${airport.id}`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Meeting Point
            </Link>
          </Button>
        </div>
      </div>

      <AirportBreadcrumbs airport={airport} />

      <AirportStats 
        meetingPointsCount={meetingPoints.length}
        terminalsCount={getUniqueTerminals()}
        fleetsCount={getUniqueFleets()}
        lastUpdated={airport.updatedAt}
      />

      {/* Airport details */}
      <Card className="overflow-hidden shadow-sm hover:shadow transition-shadow duration-200 card-gradient">
        <CardHeader>
          <CardTitle>Airport Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Information</h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              <dt className="text-sm font-medium text-gray-500">Airport Code</dt>
              <dd className="text-sm font-semibold">{airport.code}</dd>
              
              <dt className="text-sm font-medium text-gray-500">City</dt>
              <dd className="text-sm font-semibold">{airport.city}</dd>
              
              <dt className="text-sm font-medium text-gray-500">Country</dt>
              <dd className="text-sm font-semibold">{airport.country}</dd>
              
              <dt className="text-sm font-medium text-gray-500">Meeting Points</dt>
              <dd className="text-sm font-semibold">{meetingPoints.length}</dd>
              
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="text-sm font-semibold">
                {new Date(airport.updatedAt).toLocaleDateString()}
              </dd>
            </dl>
          </div>
          {airport.imageUrl && (
            <div className="rounded-md overflow-hidden bg-gray-50 border">
              <img
                src={airport.imageUrl}
                alt={airport.name}
                className="w-full h-48 md:h-60 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Meeting Points */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold tracking-tight">Meeting Points</h2>
          {meetingPoints.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Showing {meetingPoints.length} meeting point{meetingPoints.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <MeetingPointsList 
          meetingPoints={meetingPoints} 
          onDelete={handleDeleteMeetingPoint} 
        />
      </div>
    </div>
  );
}
