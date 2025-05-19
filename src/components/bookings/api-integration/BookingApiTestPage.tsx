
import { PageTitle } from "@/components/ui/page-title";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { BookingApiTestTabs } from "./BookingApiTestTabs";

const BookingApiTestPage = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex justify-between items-start">
        <PageTitle 
          heading="Booking.com API Test"
          text="Configure and test Booking.com API integration"
        />
        
        <Link to="/settings/api">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            API Settings
          </Button>
        </Link>
      </div>

      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Static Authentication</AlertTitle>
        <AlertDescription>
          This page uses static credentials for testing the Booking.com API integration.
          The connection should already be established with the provided credentials.
        </AlertDescription>
      </Alert>

      <BookingApiTestTabs />
    </div>
  );
};

export default BookingApiTestPage;
