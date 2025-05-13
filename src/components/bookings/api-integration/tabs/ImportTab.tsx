
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FetchControlsForm } from "../FetchControlsForm";
import { ExternalBookingsTable } from "../ExternalBookingsTable";
import { BookingDataPreview } from "../BookingDataPreview";
import { useToast } from "@/components/ui/use-toast";
import { BookingComBooking, ExternalBooking } from "@/types/externalBooking";
import { externalBookingService } from "@/services/externalBookingService";
import { Loader2 } from "lucide-react";

interface ImportTabProps {
  onImportComplete?: (stats: {
    saved: number;
    errors: number;
    duplicates: number;
  }) => void;
}

export function ImportTab({ onImportComplete }: ImportTabProps) {
  const [bookings, setBookings] = useState<BookingComBooking[]>([]);
  const [selectedBookings, setSelectedBookings] = useState<BookingComBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [previewBooking, setPreviewBooking] = useState<BookingComBooking | null>(null);
  
  const { toast } = useToast();

  const handleFetch = async (params: any) => {
    setFetching(true);
    
    try {
      const response = await externalBookingService.fetchBookingsFromBookingCom(params);
      setBookings(response.bookings || []);
      
      if ((response.bookings?.length || 0) === 0) {
        toast({
          title: "No bookings found",
          description: "No bookings match your search criteria.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error fetching bookings",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      setBookings([]);
    } finally {
      setFetching(false);
    }
  };

  const handleRowSelect = (booking: BookingComBooking, isSelected: boolean) => {
    if (isSelected) {
      setSelectedBookings(prev => [...prev, booking]);
    } else {
      setSelectedBookings(prev => prev.filter(b => b.id !== booking.id));
    }
  };

  const handleViewBooking = (booking: BookingComBooking) => {
    setPreviewBooking(booking);
  };

  const handleImport = async () => {
    if (selectedBookings.length === 0) {
      toast({
        title: "No bookings selected",
        description: "Please select at least one booking to import",
        variant: "default",
      });
      return;
    }

    setLoading(true);
    
    try {
      const result = await externalBookingService.saveExternalBookings(
        selectedBookings,
        'booking.com'
      );
      
      toast({
        title: "Bookings imported",
        description: `Successfully imported ${result.saved} bookings. ${
          result.duplicates > 0 ? `${result.duplicates} duplicates skipped.` : ''
        } ${result.errors > 0 ? `${result.errors} errors encountered.` : ''}`,
        variant: result.success ? "default" : "destructive",
      });
      
      // Remove imported bookings from the list
      setBookings(prev => prev.filter(b => !selectedBookings.some(s => s.id === b.id)));
      setSelectedBookings([]);
      
      // Call the onImportComplete callback
      if (onImportComplete && result.success) {
        onImportComplete({
          saved: result.saved,
          errors: result.errors,
          duplicates: result.duplicates
        });
      }
    } catch (error) {
      console.error("Error importing bookings:", error);
      toast({
        title: "Error importing bookings",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Fetch External Bookings</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Retrieve bookings from Booking.com that can be imported into your system.
        </p>
        
        <FetchControlsForm onSubmit={handleFetch} isLoading={fetching} />
      </div>
      
      {bookings.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              {bookings.length} bookings found
            </h3>
            <Button 
              onClick={handleImport} 
              disabled={selectedBookings.length === 0 || loading}
              className="min-w-[140px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                `Import ${selectedBookings.length} Bookings`
              )}
            </Button>
          </div>
          
          <ExternalBookingsTable 
            bookings={bookings}
            onRowSelect={handleRowSelect}
            onViewBooking={handleViewBooking}
            selectedBookings={selectedBookings}
          />
        </div>
      )}

      {previewBooking && (
        <BookingDataPreview 
          bookings={[previewBooking]}
          onClose={() => setPreviewBooking(null)}
          isLoading={false}
          onSaveAll={() => {}}
          currentProgress={0}
          totalProgress={0}
        />
      )}
    </div>
  );
}
