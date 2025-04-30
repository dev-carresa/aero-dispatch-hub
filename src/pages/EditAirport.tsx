
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AirportForm } from "@/components/airports/AirportForm";
import { useToast } from "@/hooks/use-toast";
import { sampleAirports } from "@/data/sampleAirports";
import { Airport } from "@/types/airport";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditAirport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [airport, setAirport] = useState<Airport | null>(null);

  useEffect(() => {
    // Simulate API call
    const airportId = parseInt(id || "0");
    const foundAirport = sampleAirports.find(a => a.id === airportId);
    
    if (foundAirport) {
      setAirport(foundAirport);
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

  const handleSubmit = (data: any) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // In a real app, you would update the airport in your database
      console.log("Updated airport:", data);
      
      toast({
        title: "Airport updated",
        description: "The airport has been successfully updated",
      });
      
      setIsLoading(false);
      
      // Navigate to the airport details page
      navigate(`/airports/${id}`);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" asChild>
          <Link to={`/airports/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Edit Airport</h1>
      </div>

      <Card className="shadow-sm hover:shadow transition-shadow duration-200">
        <CardHeader>
          <CardTitle>Airport Details</CardTitle>
        </CardHeader>
        <CardContent>
          <AirportForm 
            airport={airport} 
            onSubmit={handleSubmit} 
            isLoading={isLoading} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
