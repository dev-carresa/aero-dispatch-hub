
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, MapPin, Calendar } from "lucide-react";
import { BookingComBooking } from "@/types/externalBooking";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface ExternalBookingsTableProps {
  bookingData: BookingComBooking[];
  selectedBookings: BookingComBooking[];
  onRowSelect: (booking: BookingComBooking, isSelected: boolean) => void;
  onViewBooking: (booking: BookingComBooking) => void;
}

export function ExternalBookingsTable({
  bookingData,
  selectedBookings,
  onRowSelect,
  onViewBooking
}: ExternalBookingsTableProps) {
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    if (newSelectAll) {
      // Select all bookings
      bookingData.forEach(booking => {
        if (!isSelected(booking)) {
          onRowSelect(booking, true);
        }
      });
    } else {
      // Deselect all bookings
      bookingData.forEach(booking => {
        if (isSelected(booking)) {
          onRowSelect(booking, false);
        }
      });
    }
  };

  const isSelected = (booking: BookingComBooking) => {
    return selectedBookings.some(b => b.id === booking.id);
  };

  const handleRowClick = (booking: BookingComBooking) => {
    const selected = isSelected(booking);
    onRowSelect(booking, !selected);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(parseISO(dateString), "MMM d, yyyy HH:mm");
    } catch (error) {
      return dateString;
    }
  };

  const getGuestName = (booking: BookingComBooking) => {
    if (booking.passenger?.name) {
      return booking.passenger.name;
    } else if (booking.guest) {
      return `${booking.guest.first_name || ''} ${booking.guest.last_name || ''}`.trim();
    } else {
      return "No name";
    }
  };

  const getPickupLocation = (booking: BookingComBooking) => {
    if (booking.pickup?.address) {
      return booking.pickup.address;
    } else if (booking.property?.address) {
      return booking.property.address;
    } else {
      return "Unknown location";
    }
  };

  const getPickupDate = (booking: BookingComBooking) => {
    if (booking.pickup_date_time) {
      return formatDate(booking.pickup_date_time);
    } else if (booking.check_in) {
      return formatDate(booking.check_in);
    } else if (booking.booked_date) {
      return formatDate(booking.booked_date);
    } else {
      return "No date";
    }
  };

  // Get the appropriate badge variant based on status
  const getBadgeVariant = (status: string) => {
    if (status?.toLowerCase() === "accepted") {
      return "default"; // Changed from "success" to "default"
    }
    return "outline";
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={selectAll} 
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Guest</TableHead>
            <TableHead>Pickup</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookingData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No bookings found
              </TableCell>
            </TableRow>
          ) : (
            bookingData.map((booking, index) => {
              const isRowSelected = isSelected(booking);
              const bookingId = booking.id || booking.reference || booking.legId || `booking-${index}`;
              
              return (
                <TableRow 
                  key={bookingId} 
                  className={isRowSelected ? "bg-primary/5" : undefined}
                  onClick={() => handleRowClick(booking)}
                >
                  <TableCell>
                    <Checkbox 
                      checked={isRowSelected}
                      aria-label={`Select booking for ${getGuestName(booking)}`}
                      onClick={(e) => e.stopPropagation()}
                      onCheckedChange={(checked) => onRowSelect(booking, !!checked)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {getGuestName(booking)}
                    {index === 0 && (
                      <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                        First
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="truncate max-w-[150px]">
                        {getPickupLocation(booking)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{getPickupDate(booking)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(booking.status || '')}>
                      {booking.status || "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewBooking(booking);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
