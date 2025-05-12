
import { useState } from "react";
import { ExternalBookingsTable } from "@/components/bookings/api-integration/ExternalBookingsTable";
import { ExternalBooking } from "@/types/externalBooking";
import { bookingConverter } from "@/components/bookings/api-integration/utils/bookingConverter";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Filter, RefreshCcw } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [progressValue, setProgressValue] = useState(0);
  const [importResults, setImportResults] = useState<any>(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  
  // Filter and pagination state
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Get filtered bookings based on status filter
  const filteredBookings = statusFilter 
    ? bookings.filter(booking => booking.status === statusFilter)
    : bookings;
  
  // Get importable bookings
  const importableBookings = bookings.filter(booking => 
    bookingConverter.canImportBooking(booking)
  );
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
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
      setProgressValue(5); // Start progress
      
      // Use the improved batch conversion method
      const result = await bookingConverter.batchConvertBookings(bookingIds);
      setProgressValue(100); // Complete progress
      
      // Store results for displaying later
      setImportResults(result);
      
      // Show success dialog with detailed results
      setSuccessDialogOpen(true);
      
      // Update notification based on results
      if (result.successful > 0) {
        toast.success(`Successfully imported ${result.successful} bookings`);
      }
      
      if (result.failed > 0) {
        toast.error(`Failed to import ${result.failed} bookings`);
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
  
  // Get counts for status badges
  const getStatusCounts = () => {
    const counts = {
      all: bookings.length,
      pending: 0,
      imported: 0,
      error: 0
    };
    
    bookings.forEach(booking => {
      if (booking.status === 'pending') counts.pending++;
      else if (booking.status === 'imported') counts.imported++;
      else if (booking.status === 'error') counts.error++;
    });
    
    return counts;
  };
  
  const statusCounts = getStatusCounts();
  
  return (
    <div className="space-y-4">
      {/* Filters section */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex-1">
          <div className="flex gap-2 flex-wrap">
            <Badge
              variant={statusFilter === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setStatusFilter(null)}
            >
              All ({statusCounts.all})
            </Badge>
            <Badge
              variant={statusFilter === 'pending' ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setStatusFilter('pending')}
            >
              Pending ({statusCounts.pending})
            </Badge>
            <Badge
              variant={statusFilter === 'imported' ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setStatusFilter('imported')}
            >
              Imported ({statusCounts.imported})
            </Badge>
            <Badge
              variant={statusFilter === 'error' ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setStatusFilter('error')}
            >
              Error ({statusCounts.error})
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline" 
            size="sm"
            onClick={refreshBookings}
            disabled={isLoading}
          >
            <RefreshCcw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>
      
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
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-yellow-600">
                    <RefreshCcw className="h-4 w-4 animate-spin" />
                    Importing {importableBookings.length} bookings...
                  </div>
                  <Progress value={progressValue} className="h-2" />
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
        bookings={paginatedBookings}
        isLoading={isLoading}
        onSaveBooking={onSaveBooking}
        onViewDetails={onViewDetails}
      />
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePageChange(1)} 
              disabled={currentPage === 1}
            >
              First
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePageChange(totalPages)} 
              disabled={currentPage === totalPages}
            >
              Last
            </Button>
          </Pagination>
        </div>
      )}
      
      {/* Batch import confirmation dialog */}
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
      
      {/* Success dialog with detailed results */}
      <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <AlertDialogContent className="max-w-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Import Results</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="pt-2 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <div className="border rounded p-3 text-center">
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="text-xl font-bold">{importResults?.total || 0}</div>
                  </div>
                  <div className="border rounded p-3 text-center bg-green-50">
                    <div className="text-sm text-green-600">Successful</div>
                    <div className="text-xl font-bold text-green-600">{importResults?.successful || 0}</div>
                  </div>
                  <div className="border rounded p-3 text-center bg-red-50">
                    <div className="text-sm text-red-600">Failed</div>
                    <div className="text-xl font-bold text-red-600">{importResults?.failed || 0}</div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Detailed Results:</h4>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {importResults?.results?.map((result: any, index: number) => (
                        <div 
                          key={index} 
                          className={`text-sm p-2 rounded border ${
                            result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <div className="flex justify-between">
                            <span className="font-medium">Booking ID: {result.bookingId}</span>
                            <span>{result.success ? '✓ Success' : '✗ Failed'}</span>
                          </div>
                          <p className="text-xs mt-1">{result.message}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
