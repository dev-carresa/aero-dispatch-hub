
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchIcon, Loader2 } from "lucide-react";

interface FetchControlsFormProps {
  onFetch?: () => void;
  onSubmit?: (params: any) => Promise<void>;
  isLoading?: boolean;
}

export function FetchControlsForm({ onFetch, onSubmit, isLoading = false }: FetchControlsFormProps) {
  const handleAction = () => {
    if (onSubmit) {
      onSubmit({});
    } else if (onFetch) {
      onFetch();
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Fetch Bookings</CardTitle>
        <CardDescription>
          Retrieve all bookings from the Booking.com API using OAuth authentication
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleAction} 
          className="w-full gap-2" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Fetching...
            </>
          ) : (
            <>
              <SearchIcon className="h-4 w-4" />
              Fetch All Bookings
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
