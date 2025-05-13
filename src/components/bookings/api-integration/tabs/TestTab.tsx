
import { FetchControlsForm } from "@/components/bookings/api-integration/FetchControlsForm";
import { BookingDataPreview } from "@/components/bookings/api-integration/BookingDataPreview";
import { BookingComBooking } from "@/types/externalBooking";
import { OAuthTokenHandler } from "@/components/bookings/api-integration/OAuthTokenHandler";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";

interface TestTabProps {
  onFetch: () => Promise<void>;
  isFetching: boolean;
  fetchedBookings: BookingComBooking[];
  isSaving: boolean;
  onSaveAll: () => Promise<void>;
  saveProgress: { current: number; total: number };
  onTokenReceived?: (token: string) => void;
  hasValidToken: boolean;
  rawApiResponse?: any;
  hasNextPage: boolean;
  onLoadMore: () => void;
  isPaginationLoading: boolean;
  totalBookingsLoaded: number;
}

export function TestTab({ 
  onFetch, 
  isFetching, 
  fetchedBookings, 
  isSaving, 
  onSaveAll, 
  saveProgress,
  onTokenReceived,
  hasValidToken,
  rawApiResponse,
  hasNextPage,
  onLoadMore,
  isPaginationLoading,
  totalBookingsLoaded
}: TestTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {!hasValidToken ? (
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>Authentication Required</AlertTitle>
              <AlertDescription>
                Please get an OAuth token first to fetch bookings from Booking.com API
              </AlertDescription>
            </Alert>
          ) : null}
          
          <FetchControlsForm
            onFetch={onFetch}
            isLoading={isFetching}
          />
        </div>
        <OAuthTokenHandler onTokenReceived={onTokenReceived || (() => {})} />
      </div>

      {rawApiResponse && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Raw API Response</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full rounded border p-4 bg-slate-50">
              <pre className="text-xs text-slate-800 whitespace-pre-wrap">
                {JSON.stringify(rawApiResponse, null, 2)}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
      
      {fetchedBookings.length > 0 && (
        <>
          <BookingDataPreview
            bookings={fetchedBookings}
            isLoading={isSaving}
            onSaveAll={onSaveAll}
            currentProgress={saveProgress.current}
            totalProgress={saveProgress.total}
          />
          
          {/* Pagination controls */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Loaded {totalBookingsLoaded} bookings
            </div>
            
            {hasNextPage && (
              <Button 
                onClick={onLoadMore} 
                disabled={isPaginationLoading}
                variant="outline"
                className="ml-auto"
              >
                {isPaginationLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Load More
                  </>
                )}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
