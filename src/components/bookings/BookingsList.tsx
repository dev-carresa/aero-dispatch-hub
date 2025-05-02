
import { BookingCard } from "@/components/bookings/BookingCard";
import { Booking } from "@/components/bookings/types/booking";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { bookingService } from "@/services/bookingService";
import { Spinner } from "@/components/ui/spinner";

interface BookingsListProps {
  bookings?: Booking[];
  filter?: string;
  sortOption?: string;
}

export function BookingsList({ bookings: propBookings, filter, sortOption }: BookingsListProps) {
  // Si des réservations sont passées en prop, utiliser celles-ci
  // Sinon, charger les réservations depuis Supabase
  const { data: fetchedBookings, isLoading, error } = useQuery({
    queryKey: ['bookings', filter, sortOption],
    queryFn: async () => {
      const data = await bookingService.getBookings();
      // Convertir les données de la BD au format attendu par le composant
      return data.map(booking => ({
        id: booking.id as string,
        reference: `REF-${booking.id.substring(0, 6)}`,
        customer: booking.customer_name,
        origin: booking.pickup_location,
        destination: booking.destination,
        date: new Date(booking.pickup_date).toISOString().split('T')[0],
        time: booking.pickup_time,
        vehicle: `${booking.vehicle_type.charAt(0).toUpperCase() + booking.vehicle_type.slice(1)}`,
        driver: "",
        status: booking.status as any,
        price: `$${booking.price}`,
        fleet: "",
        source: "",
        flightNumber: booking.flight_number,
        serviceType: ""
      }));
    },
    enabled: !propBookings
  });

  const bookingsToDisplay = propBookings || fetchedBookings || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-red-500">Erreur lors du chargement des réservations</h3>
        <p className="text-muted-foreground">Veuillez réessayer plus tard</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {bookingsToDisplay.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
      
      {bookingsToDisplay.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">Aucune réservation trouvée</h3>
          <p className="text-muted-foreground">Ajustez vos filtres ou créez une nouvelle réservation.</p>
          <Link to="/bookings/new" className="mt-4 inline-block">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle réservation
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}
