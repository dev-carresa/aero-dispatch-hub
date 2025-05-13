
import { PageTitle } from "@/components/ui/page-title";
import { Separator } from "@/components/ui/separator";
import { BookingApiTestTabs } from "./BookingApiTestTabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function BookingApiTestPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <PageTitle heading="Booking.com API Integration" />
      </div>
      
      <Separator />
      
      {!isAuthenticated && (
        <Alert className="border-amber-300 bg-amber-50">
          <LogIn className="h-5 w-5 text-amber-500" />
          <AlertTitle className="text-amber-700">Not logged in</AlertTitle>
          <AlertDescription className="text-amber-600 flex flex-col gap-4">
            <p>You're not currently logged in. You can still test the API and save bookings, but for a better experience, we recommend logging in.</p>
            
            <div>
              <Button 
                variant="outline" 
                className="border-amber-500 text-amber-700 hover:bg-amber-100"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="bg-white rounded-lg border shadow p-6">
        <BookingApiTestTabs />
      </div>
    </div>
  );
}
