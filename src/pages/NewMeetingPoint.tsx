
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MeetingPointForm } from "@/components/airports/meeting-points/MeetingPointForm";
import { useToast } from "@/hooks/use-toast";
import { sampleMeetingPoints } from "@/data/sampleMeetingPoints";

export default function NewMeetingPoint() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [airportId, setAirportId] = useState<string | undefined>();

  // Extract airportId from query params if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("airportId");
    if (id) {
      setAirportId(id);
    }
  }, [location]);

  const handleSubmit = (data: any) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate a new ID for the meeting point
      const newId = Math.max(...sampleMeetingPoints.map(mp => mp.id)) + 1;
      
      // Create a new meeting point with the form data
      const newMeetingPoint = {
        id: newId,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // In a real app, you would add this to your database
      console.log("Created meeting point:", newMeetingPoint);
      
      toast({
        title: "Meeting point created",
        description: "The new meeting point has been successfully created",
      });
      
      setIsLoading(false);
      
      // Navigate to the airport details page
      navigate(`/airports/${data.airportId}`);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" asChild>
          <Link to={airportId ? `/airports/${airportId}` : "/airports"}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Add Meeting Point</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meeting Point Details</CardTitle>
        </CardHeader>
        <CardContent>
          <MeetingPointForm 
            onSubmit={handleSubmit}
            isLoading={isLoading}
            airportId={airportId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
