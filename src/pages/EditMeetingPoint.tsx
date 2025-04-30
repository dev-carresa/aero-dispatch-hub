
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MeetingPointForm } from "@/components/airports/meeting-points/MeetingPointForm";
import { useToast } from "@/hooks/use-toast";
import { getMeetingPointById } from "@/data/sampleMeetingPoints";
import { MeetingPoint } from "@/types/airport";

export default function EditMeetingPoint() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [meetingPoint, setMeetingPoint] = useState<MeetingPoint | undefined>();

  useEffect(() => {
    if (!id) return;
    
    // Simulate API call
    const meetingPointId = parseInt(id);
    const foundMeetingPoint = getMeetingPointById(meetingPointId);
    
    if (foundMeetingPoint) {
      setMeetingPoint(foundMeetingPoint);
    } else {
      toast({
        title: "Error",
        description: "Meeting point not found",
        variant: "destructive",
      });
      navigate("/airports");
    }
    
    setIsLoading(false);
  }, [id, navigate, toast]);

  const handleSubmit = (data: any) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // In a real app, you would update the meeting point in your database
      console.log("Updated meeting point:", data);
      
      toast({
        title: "Meeting point updated",
        description: "The meeting point has been successfully updated",
      });
      
      setIsLoading(false);
      
      // Navigate to the airport details page
      navigate(`/airports/${data.airportId}`);
    }, 1000);
  };

  if (isLoading && !meetingPoint) {
    return <div>Loading...</div>;
  }

  if (!meetingPoint) {
    return <div>Meeting point not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" asChild>
          <Link to={`/airports/${meetingPoint.airportId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Edit Meeting Point</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meeting Point Details</CardTitle>
        </CardHeader>
        <CardContent>
          <MeetingPointForm 
            meetingPoint={meetingPoint}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
