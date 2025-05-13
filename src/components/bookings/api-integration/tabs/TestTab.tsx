
import React from 'react';
import { FetchControlsForm } from "@/components/bookings/api-integration/FetchControlsForm";
import { BookingDataPreview } from "@/components/bookings/api-integration/BookingDataPreview";
import { BookingComBooking } from "@/types/externalBooking";
import { OAuthTokenHandler } from "@/components/bookings/api-integration/OAuthTokenHandler";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertTriangle, LogIn } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

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
  errorDetails?: string | null;
}

export function TestTab({ 
  onFetch, 
  isFetching, 
  fetchedBookings = [],
  isSaving, 
  onSaveAll, 
  saveProgress = { current: 0, total: 0 },
  onTokenReceived = () => {},
  hasValidToken = false,
  rawApiResponse,
  hasNextPage = false,
  onLoadMore = () => {},
  isPaginationLoading = false,
  totalBookingsLoaded = 0,
  errorDetails = null
}: TestTabProps) {
  const { isAuthenticated, user } = useAuth();

  // Check if error details contain authentication errors
  const isAuthError = errorDetails && 
    (errorDetails.includes('Authentication required') || 
     errorDetails.includes('No authenticated session') || 
     errorDetails.includes('Authentication failed') ||
     errorDetails.includes('No user authenticated') ||
     errorDetails.includes('401'));

  // Handle save click with authentication check
  const handleSaveClick = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to save bookings");
      return;
    }
    await onSaveAll();
  };

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

          {/* Show authentication alert if user is not logged in */}
          {!isAuthenticated && (
            <Alert className="mb-4 border-amber-300 bg-amber-50">
              <LogIn className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-700">Login Required</AlertTitle>
              <AlertDescription className="text-amber-600">
                You must be logged in to save bookings. Please log in to continue.
              </AlertDescription>
            </Alert>
          )}
          
          <FetchControlsForm
            onFetch={onFetch}
            isLoading={isFetching}
          />
        </div>
        <OAuthTokenHandler onTokenReceived={onTokenReceived} />
      </div>

      {/* Authentication error alert */}
      {isAuthError && (
        <Card className="mb-6 border-red-300">
          <CardHeader className="pb-2 bg-red-50">
            <CardTitle className="text-lg flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Authentication Error
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Not Authenticated</AlertTitle>
              <AlertDescription className="flex flex-col gap-2">
                <p>You need to be logged in to save bookings. Please log in to your account and try again.</p>
                <p className="text-sm text-gray-700">Error details: Authentication failed or session expired</p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Display error details if available and not authentication error */}
      {errorDetails && !isAuthError && (
        <Card className="mb-6 border-red-300">
          <CardHeader className="pb-2 bg-red-50">
            <CardTitle className="text-lg flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Error Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] w-full rounded border p-4 bg-slate-50">
              <pre className="text-xs text-slate-800 whitespace-pre-wrap">
                {errorDetails}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

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
            onSaveAll={handleSaveClick} // Use our wrapper function with auth check
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
