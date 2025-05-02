
import { BookingFilters } from "@/components/bookings/BookingFilters";
import { BookingPagination } from "@/components/bookings/BookingPagination";
import { useState } from "react";
import { BookingsHeader } from "@/components/bookings/BookingsHeader";
import { BookingsTabs } from "@/components/bookings/BookingsTabs";
import { BookingSort, SortOption } from "@/components/bookings/BookingSort";
import { BookingsList } from "@/components/bookings/BookingsList";
import { useQuery } from "@tanstack/react-query";
import { bookingService } from "@/services/bookingService";

const BookingsIndex = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("date-desc");
  
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: bookingService.getBookings
  });
  
  // Filtre et tri des réservations
  const filteredBookings = bookings ? filterBookings(bookings, activeTab) : [];
  const sortedBookings = sortBookings(filteredBookings, sortOption);
  
  // Pagination simple
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);
  const currentBookings = sortedBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Fonction de filtrage des réservations
  function filterBookings(bookings: any[], activeTab: string) {
    return bookings.filter(booking => {
      if (activeTab === "all") return true;
      if (activeTab === "next24h") {
        // Vérifier si la réservation est dans les prochaines 24h
        const bookingDate = new Date(booking.pickup_date);
        const now = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(now.getDate() + 1);
        return bookingDate >= now && bookingDate <= tomorrow;
      }
      if (activeTab === "confirmed") return booking.status === "confirmed";
      if (activeTab === "completed") return booking.status === "completed";
      if (activeTab === "cancelled") return booking.status === "cancelled";
      if (activeTab === "latest") {
        // Prendre les 5 dernières réservations créées
        const latestBookings = [...bookings].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ).slice(0, 5);
        return latestBookings.includes(booking);
      }
      return true;
    });
  }

  // Fonction de tri des réservations
  function sortBookings(bookings: any[], sortOption: SortOption) {
    return [...bookings].sort((a, b) => {
      switch (sortOption) {
        case "date-asc":
          return new Date(a.pickup_date).getTime() - new Date(b.pickup_date).getTime();
        case "date-desc":
          return new Date(b.pickup_date).getTime() - new Date(a.pickup_date).getTime();
        case "price-asc":
          return Number(a.price) - Number(b.price);
        case "price-desc":
          return Number(b.price) - Number(a.price);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  }

  // Conversion des données de la BD au format attendu par BookingsList
  const formattedBookings = currentBookings.map(booking => ({
    id: booking.id,
    reference: `REF-${booking.id.substring(0, 6)}`,
    customer: booking.customer_name,
    origin: booking.pickup_location,
    destination: booking.destination,
    date: new Date(booking.pickup_date).toISOString().split('T')[0],
    time: booking.pickup_time,
    vehicle: `${booking.vehicle_type.charAt(0).toUpperCase() + booking.vehicle_type.slice(1)}`,
    driver: "",
    status: booking.status,
    price: `$${booking.price}`,
    fleet: "",
    source: "",
    flightNumber: booking.flight_number,
    serviceType: ""
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <BookingsHeader />
      
      <BookingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <BookingFilters />
      
      <BookingSort 
        sortOption={sortOption} 
        setSortOption={setSortOption} 
        bookingsCount={sortedBookings.length}
      />
      
      <BookingsList bookings={formattedBookings} />
      
      <div className="flex justify-center">
        <BookingPagination 
          currentPage={currentPage} 
          totalPages={totalPages || 1} 
          onPageChange={handlePageChange} 
        />
      </div>
    </div>
  );
};

export default BookingsIndex;
