
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MeetingPointsList } from "@/components/airports/meeting-points/MeetingPointsList";
import { sampleAirports } from "@/data/sampleAirports";
import { getMeetingPointsByAirport } from "@/data/sampleMeetingPoints";
import { Airport, MeetingPoint } from "@/types/airport";
import { useToast } from "@/hooks/use-toast";

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
      navigate("/airports", { replace: true });
    }
    
    setIsLoading(false);
  }, [id, navigate]);

  const handleDeleteMeetingPoint = (meetingPointId: number) => {
    // Simulate API call to delete meeting point
    setMeetingPoints(prev => prev.filter(mp => mp.id !== meetingPointId));
    
    toast({
      title: "Meeting point deleted",
      description: "The meeting point has been successfully deleted",
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!airport) {
    return <div>Airport not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with back button and actions */}
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
            <p className="text-muted-foreground">
              {airport.city}, {airport.country}
            </p>
          </div>
        </div>
        <Button asChild>
          <Link to={`/airports/meeting-points/new?airportId=${airport.id}`}>
            <Plus className="mr-2 h-4 w-4" />
            Add Meeting Point
          </Link>
        </Button>
      </div>

      {/* Airport details */}
      <Card>
        <CardHeader>
          <CardTitle>Airport Details</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Information</h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
              <dt className="text-sm font-medium text-gray-500">Airport Code</dt>
              <dd>{airport.code}</dd>
              <dt className="text-sm font-medium text-gray-500">City</dt>
              <dd>{airport.city}</dd>
              <dt className="text-sm font-medium text-gray-500">Country</dt>
              <dd>{airport.country}</dd>
              <dt className="text-sm font-medium text-gray-500">Meeting Points</dt>
              <dd>{meetingPoints.length}</dd>
            </dl>
          </div>
          {airport.imageUrl && (
            <div className="rounded-md overflow-hidden">
              <img
                src={airport.imageUrl}
                alt={airport.name}
                className="w-full h-48 object-cover"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Meeting Points */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Meeting Points</h2>
        <MeetingPointsList 
          meetingPoints={meetingPoints} 
          onDelete={handleDeleteMeetingPoint} 
        />
      </div>
    </div>
  );
}
