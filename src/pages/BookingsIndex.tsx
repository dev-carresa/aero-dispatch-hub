
import { useState } from "react";
import { BookingFilters } from "@/components/bookings/BookingFilters";
import { BookingPagination } from "@/components/bookings/BookingPagination";
import { BookingsHeader } from "@/components/bookings/BookingsHeader";
import { BookingsTabs } from "@/components/bookings/BookingsTabs";
import { BookingSort, SortOption } from "@/components/bookings/BookingSort";
import { BookingsList } from "@/components/bookings/BookingsList";
import { useBookings } from "@/hooks/useBookings";
import { mapDbBookingsToDisplayBookings } from "@/components/bookings/utils/bookingMappers";
import { Spinner } from "@/components/ui/spinner";

const BookingsIndex = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("date-desc");
  const [pageSize] = useState(10); // Number of items per page
  
  const { useBookingsQuery } = useBookings();
  const { data: bookingsResponse, isLoading, error } = useBookingsQuery(currentPage, pageSize);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const totalPages = bookingsResponse?.count 
    ? Math.ceil(bookingsResponse.count / pageSize) 
    : 1;

  // Map database bookings to the format expected by our components
  const displayBookings = bookingsResponse?.data 
    ? mapDbBookingsToDisplayBookings(bookingsResponse.data)
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <BookingsHeader />
      
      <BookingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <BookingFilters />
      
      <BookingSort 
        sortOption={sortOption} 
        setSortOption={setSortOption} 
        bookingsCount={bookingsResponse?.count || 0}
      />
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-center py-10 text-destructive">
          <p>Error loading bookings. Please try again.</p>
        </div>
      ) : (
        <BookingsList bookings={displayBookings} />
      )}
      
      <div className="flex justify-center">
        <BookingPagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
      </div>
    </div>
  );
};

export default BookingsIndex;
