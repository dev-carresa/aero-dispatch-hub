
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiUserForm } from "@/components/api-users/ApiUserForm";
import { useToast } from "@/hooks/use-toast";
import { sampleApiUsers } from "@/data/sampleApiUsers";

export default function NewApiUser() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (data: any) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // In a real app, you would save the API user to your database
      console.log("Created API user:", data);
      
      // Add the new user to our sample data (just for demo purposes)
      const newApiUser = {
        ...data,
        id: sampleApiUsers.length + 1,
        createdAt: new Date().toISOString(),
      };
      
      sampleApiUsers.push(newApiUser);
      
      toast({
        title: "API user created",
        description: "The API user has been successfully created",
      });
      
      setIsLoading(false);
      // Navigate to the API users page
      navigate("/api-users");
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" asChild>
          <Link to="/api-users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Create API User</h1>
      </div>

      <Card className="shadow-sm hover:shadow transition-shadow duration-200">
        <CardHeader>
          <CardTitle>API User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ApiUserForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
