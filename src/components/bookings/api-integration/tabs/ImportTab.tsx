
import { useState } from "react";
import { ExternalBookingsTable } from "@/components/bookings/api-integration/ExternalBookingsTable";
import { ExternalBooking } from "@/types/externalBooking";
import { bookingConverter } from "@/components/bookings/api-integration/utils/bookingConverter";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, RefreshCcw } from "lucide-react";

interface ImportTabProps {
  bookings: ExternalBooking[];
  isLoading: boolean;
  onSaveBooking: (booking: ExternalBooking) => Promise<void>;
  onViewDetails: (booking: ExternalBooking) => void;
  refreshBookings?: () => Promise<void>;
}

export function ImportTab({ 
  bookings, 
  isLoading, 
  onSaveBooking, 
  onViewDetails,
  refreshBookings 
}: ImportTabProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [batchImportOpen, setBatchImportOpen] = useState(false);
  
  // Get count of bookings that can be imported
  const importableBookings = bookings.filter(booking => 
    bookingConverter.canImportBooking(booking)
  );
  
  // Handle batch import of all importable bookings
  const handleBatchImport = async () => {
    try {
      if (importableBookings.length === 0) {
        toast.warning("No bookings available to import");
        return;
      }
      
      setIsImporting(true);
      setBatchImportOpen(false);
      
      const bookingIds = importableBookings.map(booking => booking.id);
      const result = await bookingConverter.convertMultipleBookings(bookingIds);
      
      if (result.success > 0) {
        toast.success(`Successfully imported ${result.success} bookings`);
      }
      
      if (result.failed > 0) {
        toast.error(`Failed to import ${result.failed} bookings`);
        console.error("Import failures:", result.messages.filter(msg => msg.includes("Failed")));
      }
      
      // Refresh the bookings list
      if (refreshBookings) {
        await refreshBookings();
      }
      
    } catch (error) {
      console.error("Error during batch import:", error);
      toast.error("An error occurred during batch import");
    } finally {
      setIsImporting(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {importableBookings.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Batch Import</CardTitle>
                <CardDescription>
                  Import all pending external bookings at once
                </CardDescription>
              </div>
              <Button
                onClick={() => setBatchImportOpen(true)}
                variant="outline"
                className="flex items-center gap-1"
                disabled={isImporting || importableBookings.length === 0}
              >
                <Download className="h-4 w-4" />
                Import All ({importableBookings.length})
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {isImporting ? (
                <div className="flex items-center gap-2 text-yellow-600">
                  <RefreshCcw className="h-4 w-4 animate-spin" />
                  Importing {importableBookings.length} bookings...
                </div>
              ) : (
                <span className="text-muted-foreground">
                  This will import all {importableBookings.length} pending external bookings into your system.
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      <ExternalBookingsTable
        bookings={bookings}
        isLoading={isLoading}
        onSaveBooking={onSaveBooking}
        onViewDetails={onViewDetails}
      />
      
      <AlertDialog open={batchImportOpen} onOpenChange={setBatchImportOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import All Bookings</AlertDialogTitle>
            <AlertDialogDescription>
              This will import {importableBookings.length} external bookings into your system as new bookings.
              Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBatchImport}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
