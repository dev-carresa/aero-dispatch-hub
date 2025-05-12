
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, Check, Download, Inbox, X, ExternalLink, Eye } from "lucide-react";
import { format } from "date-fns";
import { ExternalBooking } from "@/types/externalBooking";
import { bookingConverter } from "./utils/bookingConverter";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ExternalBookingsTableProps {
  bookings: ExternalBooking[];
  isLoading: boolean;
  onSaveBooking: (booking: ExternalBooking) => void;
  onViewDetails: (booking: ExternalBooking) => void;
}

export function ExternalBookingsTable({
  bookings,
  isLoading,
  onSaveBooking,
  onViewDetails
}: ExternalBookingsTableProps) {
  const [importingBookings, setImportingBookings] = useState<Record<string, boolean>>({});
  const [selectedBooking, setSelectedBooking] = useState<ExternalBooking | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  // Return status badge based on booking status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">Pending</Badge>;
      case "imported":
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Imported</Badge>;
      case "error":
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Error</Badge>;
      case "duplicate":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">Duplicate</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Handle import button click
  const handleImportClick = async (booking: ExternalBooking) => {
    setImportingBookings(prev => ({ ...prev, [booking.id]: true }));
    await onSaveBooking(booking);
    setImportingBookings(prev => ({ ...prev, [booking.id]: false }));
  };
  
  // Handle view details button click
  const handleViewDetails = (booking: ExternalBooking) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
    onViewDetails(booking);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <Spinner size="lg" />
            <p className="text-sm text-muted-foreground">Loading external bookings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!bookings || bookings.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 rounded-full bg-muted p-3">
              <Inbox className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No external bookings</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              No external bookings have been imported or retrieved yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>External Bookings</CardTitle>
          <CardDescription>
            View and manage bookings imported from external sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>External ID</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.external_id}</TableCell>
                    <TableCell>{booking.external_source}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getStatusBadge(booking.status)}
                        {booking.status === "error" && booking.error_message && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">{booking.error_message}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(booking.created_at), "MMM d, yyyy h:mm a")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(booking)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View
                        </Button>
                        
                        {booking.status === "imported" && booking.mapped_booking_id && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="flex items-center gap-1"
                          >
                            <Link to={`/bookings/${booking.mapped_booking_id}`}>
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span>Open Booking</span>
                            </Link>
                          </Button>
                        )}
                        
                        {bookingConverter.canImportBooking(booking) && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => handleImportClick(booking)}
                            disabled={importingBookings[booking.id]}
                          >
                            {importingBookings[booking.id] ? (
                              <>
                                <Spinner size="sm" />
                                <span>Importing...</span>
                              </>
                            ) : (
                              <>
                                <Download className="h-3.5 w-3.5" />
                                <span>Import</span>
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Booking Details: {selectedBooking?.external_id}</DialogTitle>
            <DialogDescription>
              From {selectedBooking?.external_source}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh]">
            {selectedBooking && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Status</h3>
                    <div>{getStatusBadge(selectedBooking.status)}</div>
                    
                    <h3 className="text-sm font-medium mt-4">Created At</h3>
                    <div className="text-sm">
                      {format(new Date(selectedBooking.created_at), "PPp")}
                    </div>
                    
                    {selectedBooking.mapped_booking_id && (
                      <>
                        <h3 className="text-sm font-medium mt-4">Mapped Booking</h3>
                        <div className="text-sm">
                          <Link 
                            to={`/bookings/${selectedBooking.mapped_booking_id}`}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            {selectedBooking.mapped_booking_id.substring(0, 8)}...
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </>
                    )}
                    
                    {selectedBooking.error_message && (
                      <>
                        <h3 className="text-sm font-medium mt-4">Error Message</h3>
                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          {selectedBooking.error_message}
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {selectedBooking.booking_data?.guest && (
                      <>
                        <h3 className="text-sm font-medium">Guest Information</h3>
                        <div className="text-sm grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-muted-foreground">Name:</span>{" "}
                            {`${selectedBooking.booking_data.guest.first_name || ''} ${selectedBooking.booking_data.guest.last_name || ''}`}
                          </div>
                          {selectedBooking.booking_data.guest.email && (
                            <div>
                              <span className="text-muted-foreground">Email:</span>{" "}
                              {selectedBooking.booking_data.guest.email}
                            </div>
                          )}
                          {selectedBooking.booking_data.guest.phone && (
                            <div>
                              <span className="text-muted-foreground">Phone:</span>{" "}
                              {selectedBooking.booking_data.guest.phone}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    
                    {(selectedBooking.booking_data?.check_in || 
                      selectedBooking.booking_data?.check_out) && (
                      <>
                        <h3 className="text-sm font-medium mt-4">Dates</h3>
                        <div className="text-sm grid grid-cols-2 gap-2">
                          {selectedBooking.booking_data.check_in && (
                            <div>
                              <span className="text-muted-foreground">Check-in:</span>{" "}
                              {selectedBooking.booking_data.check_in}
                            </div>
                          )}
                          {selectedBooking.booking_data.check_out && (
                            <div>
                              <span className="text-muted-foreground">Check-out:</span>{" "}
                              {selectedBooking.booking_data.check_out}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium">Raw Booking Data</h3>
                  <div className="bg-gray-50 p-3 rounded mt-1 overflow-auto">
                    <pre className="text-xs">
                      {JSON.stringify(selectedBooking.booking_data, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
          
          <DialogFooter>
            {selectedBooking && bookingConverter.canImportBooking(selectedBooking) && (
              <Button 
                variant="default"
                onClick={() => {
                  setDetailsOpen(false);
                  handleImportClick(selectedBooking);
                }}
                disabled={importingBookings[selectedBooking.id]}
              >
                {importingBookings[selectedBooking.id] ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Importing...
                  </>
                ) : (
                  <>Import Booking</>
                )}
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => setDetailsOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
