
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-red-100 p-3">
            <ShieldX className="h-12 w-12 text-red-500" />
          </div>
        </div>
        
        <h1 className="mb-2 text-3xl font-bold">Access Denied</h1>
        
        <p className="mb-4 text-gray-600">
          You don't have permission to access this page. {user ? "Please contact an administrator if you believe this is an error." : "Please log in first to access this page."}
        </p>
        
        <p className="mb-8 text-sm text-gray-500 italic">
          {user ? "To access all features, you need an account with the appropriate permissions." : "Note: You need to log in first before accessing protected pages."}
        </p>
        
        <div className="flex flex-col gap-3">
          {user ? (
            <>
              <Button onClick={() => navigate("/")}>
                Go to Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={() => navigate("/auth")}
              >
                Log In
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/welcome")}
              >
                Go to Welcome Page
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
