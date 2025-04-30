
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiUserForm } from "@/components/api-users/ApiUserForm";
import { useToast } from "@/hooks/use-toast";
import { sampleApiUsers } from "@/data/sampleApiUsers";
import { ApiUser } from "@/types/apiUser";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditApiUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [apiUser, setApiUser] = useState<ApiUser | null>(null);

  useEffect(() => {
    // Simulate API call
    const apiUserId = parseInt(id || "0");
    const foundApiUser = sampleApiUsers.find(a => a.id === apiUserId);
    
    if (foundApiUser) {
      setApiUser(foundApiUser);
    } else {
      toast({
        title: "Error",
        description: "API user not found",
        variant: "destructive",
      });
      navigate("/api-users", { replace: true });
    }
    
    setIsLoading(false);
  }, [id, navigate, toast]);

  const handleSubmit = (data: any) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // In a real app, you would update the API user in your database
      console.log("Updated API user:", data);
      
      // Update the user in our sample data (just for demo purposes)
      if (apiUser) {
        const userIndex = sampleApiUsers.findIndex(u => u.id === apiUser.id);
        if (userIndex !== -1) {
          sampleApiUsers[userIndex] = {
            ...sampleApiUsers[userIndex],
            ...data,
          };
        }
      }
      
      toast({
        title: "API user updated",
        description: "The API user has been successfully updated",
      });
      
      setIsLoading(false);
      
      // Navigate to the API users page
      navigate("/api-users");
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
          <Link to="/api-users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Edit API User</h1>
      </div>

      <Card className="shadow-sm hover:shadow transition-shadow duration-200">
        <CardHeader>
          <CardTitle>API User Details</CardTitle>
        </CardHeader>
        <CardContent>
          {apiUser && (
            <ApiUserForm 
              apiUser={apiUser}
              onSubmit={handleSubmit} 
              isLoading={isLoading} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
