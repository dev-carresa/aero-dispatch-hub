
import { BookingCard } from "@/components/bookings/BookingCard";
import { Booking } from "@/components/bookings/types/booking";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface BookingsListProps {
  bookings: Booking[];
}

export function BookingsList({ bookings }: BookingsListProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
      
      {bookings.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No bookings found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or create a new booking.</p>
          <Link to="/bookings/new" className="mt-4 inline-block">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}
