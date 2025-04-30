
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, Power, PowerOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ApiKeyDisplay } from "@/components/api-users/ApiKeyDisplay";
import { ApiUserDeleteDialog } from "@/components/api-users/ApiUserDeleteDialog";
import { ApiUserStatusDialog } from "@/components/api-users/ApiUserStatusDialog";
import { useToast } from "@/hooks/use-toast";
import { sampleApiUsers } from "@/data/sampleApiUsers";
import { ApiUser } from "@/types/apiUser";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ApiUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [apiUser, setApiUser] = useState<ApiUser | null>(null);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

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

  const handleEdit = () => {
    navigate(`/api-users/${id}/edit`);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // In a real app, you would delete the API user from your database
    const userIndex = sampleApiUsers.findIndex(u => u.id === parseInt(id || "0"));
    if (userIndex !== -1) {
      sampleApiUsers.splice(userIndex, 1);
    }
    
    toast({
      title: "API user deleted",
      description: "The API user has been permanently removed",
    });
    
    navigate("/api-users");
  };

  const handleToggleStatus = () => {
    setIsStatusDialogOpen(true);
  };

  const confirmToggleStatus = () => {
    if (!apiUser) return;
    
    // Update the user's status
    const newStatus = apiUser.status === "active" ? "inactive" : "active";
    const userIndex = sampleApiUsers.findIndex(u => u.id === apiUser.id);
    
    if (userIndex !== -1) {
      sampleApiUsers[userIndex] = {
        ...sampleApiUsers[userIndex],
        status: newStatus,
      };
      
      setApiUser({
        ...apiUser,
        status: newStatus,
      });
    }
    
    // Show success toast
    const statusMessage = newStatus === "active" ? "activated" : "deactivated";
    toast({
      title: `API user ${statusMessage}`,
      description: `The API user has been ${statusMessage} successfully`,
    });
    
    setIsStatusDialogOpen(false);
  };

  const getServiceTypeLabel = (type: string) => {
    switch (type) {
      case "api_access": return "API Access";
      case "white_label": return "White Label";
      case "both": return "API & White Label";
      default: return type;
    }
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

  if (!apiUser) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/api-users">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{apiUser.name}</h1>
            <p className="text-muted-foreground">{apiUser.email}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleToggleStatus}>
            {apiUser.status === "active" ? (
              <>
                <PowerOff className="mr-2 h-4 w-4" /> Deactivate
              </>
            ) : (
              <>
                <Power className="mr-2 h-4 w-4" /> Activate
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" onClick={handleDelete} className="border-red-200 text-red-600 hover:bg-red-50">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge 
                  variant={apiUser.status === "active" ? "default" : "secondary"}
                  className={apiUser.status === "active" ? "bg-green-100 text-green-800 mt-1" : "bg-gray-100 text-gray-800 mt-1"}
                >
                  {apiUser.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Service Type</p>
                <Badge variant="outline" className="mt-1">
                  {getServiceTypeLabel(apiUser.serviceType)}
                </Badge>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Company</p>
              <p className="mt-1">{apiUser.company || "-"}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
              <p className="mt-1">{apiUser.phone || "-"}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Country</p>
              <p className="mt-1">{apiUser.country}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date Created</p>
              <p className="mt-1">{new Date(apiUser.createdAt).toLocaleString()}</p>
            </div>
            
            {apiUser.lastUsed && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last API Call</p>
                <p className="mt-1">{new Date(apiUser.lastUsed).toLocaleString()}</p>
              </div>
            )}
            
            {apiUser.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="mt-1 text-sm">{apiUser.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>API Credentials</CardTitle>
            <CardDescription>
              These credentials grant access to your services and API endpoints
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ApiKeyDisplay apiKey={apiUser.apiKey} label="API Key" />
            
            {apiUser.secretKey && (
              <ApiKeyDisplay apiKey={apiUser.secretKey} label="Secret Key" />
            )}
            
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
              <p className="text-sm text-blue-700">
                <strong>Security Note:</strong> These credentials should be kept secure.
                Do not share them in public repositories or client-side code.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Usage Example</h3>
              <div className="bg-gray-100 p-3 rounded-md">
                <pre className="text-xs overflow-x-auto">
                  <code>
{`// Example API call using credentials
fetch('https://api.example.com/data', {
  headers: {
    'Authorization': 'Bearer ${apiUser.apiKey}',
    'Content-Type': 'application/json'
  }
})`}
                  </code>
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <ApiUserDeleteDialog
        apiUser={apiUser}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />
      
      <ApiUserStatusDialog
        apiUser={apiUser}
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        onConfirm={confirmToggleStatus}
      />
    </div>
  );
}
