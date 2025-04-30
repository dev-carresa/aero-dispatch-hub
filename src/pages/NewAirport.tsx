
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AirportForm } from "@/components/airports/AirportForm";
import { useToast } from "@/hooks/use-toast";

export default function NewAirport() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (data: any) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // In a real app, you would save the airport to your database
      console.log("Created airport:", data);
      
      toast({
        title: "Airport created",
        description: "The airport has been successfully created",
      });
      
      setIsLoading(false);
      // Navigate to the airports page
      navigate("/airports");
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" asChild>
          <Link to="/airports">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Add New Airport</h1>
      </div>

      <Card className="shadow-sm hover:shadow transition-shadow duration-200">
        <CardHeader>
          <CardTitle>Airport Details</CardTitle>
        </CardHeader>
        <CardContent>
          <AirportForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
