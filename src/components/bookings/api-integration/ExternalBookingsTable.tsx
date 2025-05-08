
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, Check, Download, Inbox, X, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ExternalBooking } from "@/types/externalBooking";
import { bookingConverter } from "./utils/bookingConverter";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { Link } from "react-router-dom";

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
                        onClick={() => onViewDetails(booking)}
                      >
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
                          onClick={() => onSaveBooking(booking)}
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
  );
}
