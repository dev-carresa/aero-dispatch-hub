
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { BookingComBooking } from "@/types/externalBooking";
import { format } from "date-fns";

interface ExternalBookingsTableProps {
  bookingData: BookingComBooking[];
  onRowSelect: (booking: BookingComBooking, isSelected: boolean) => void;
  onViewBooking: (booking: BookingComBooking) => void;
  selectedBookings: BookingComBooking[];
}

export function ExternalBookingsTable({
  bookingData,
  onRowSelect,
  onViewBooking,
  selectedBookings
}: ExternalBookingsTableProps) {
  const [selectAll, setSelectAll] = useState(false);
  
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    
    if (checked) {
      // Select all bookings that aren't already selected
      const newSelected = [...selectedBookings];
      bookingData.forEach(booking => {
        if (!selectedBookings.some(b => b.id === booking.id)) {
          newSelected.push(booking);
        }
      });
      bookingData.forEach(booking => onRowSelect(booking, true));
    } else {
      // Deselect all bookings
      bookingData.forEach(booking => onRowSelect(booking, false));
    }
  };
  
  const isBookingSelected = (booking: BookingComBooking) => {
    return selectedBookings.some(b => b.id === booking.id);
  };
  
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={selectAll || (bookingData.length > 0 && selectedBookings.length === bookingData.length)} 
                onCheckedChange={handleSelectAll}
                aria-label="Select all bookings"
              />
            </TableHead>
            <TableHead>Guest</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookingData.map(booking => {
            // Get guest name from the appropriate property depending on API response structure
            const guestName = booking.passenger?.name || 
              (booking.guest ? `${booking.guest.first_name} ${booking.guest.last_name}` : 'No name');
            
            return (
              <TableRow key={booking.id} className={isBookingSelected(booking) ? "bg-muted/50" : undefined}>
                <TableCell>
                  <Checkbox 
                    checked={isBookingSelected(booking)}
                    onCheckedChange={(checked) => onRowSelect(booking, !!checked)}
                    aria-label={`Select booking for ${guestName}`}
                  />
                </TableCell>
                <TableCell>{guestName}</TableCell>
                <TableCell>{formatDate(booking.check_in)}</TableCell>
                <TableCell>{formatDate(booking.check_out)}</TableCell>
                <TableCell>{booking.status || "pending"}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onViewBooking(booking)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
          
          {bookingData.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No bookings found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
