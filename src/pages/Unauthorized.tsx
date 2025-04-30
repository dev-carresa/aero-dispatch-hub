
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-red-100 p-3">
            <ShieldX className="h-12 w-12 text-red-500" />
          </div>
        </div>
        
        <h1 className="mb-2 text-3xl font-bold">Access Denied</h1>
        
        <p className="mb-8 text-gray-600">
          You don't have permission to access this page. Please contact an administrator if you 
          believe this is an error.
        </p>
        
        <div className="flex flex-col gap-3">
          <Button onClick={() => navigate("/")}>
            Go to Dashboard
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
