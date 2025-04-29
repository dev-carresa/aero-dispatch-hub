
import { BookingFilters } from "@/components/bookings/BookingFilters";
import { BookingPagination } from "@/components/bookings/BookingPagination";
import { useState } from "react";
import { BookingsHeader } from "@/components/bookings/BookingsHeader";
import { BookingsTabs } from "@/components/bookings/BookingsTabs";
import { BookingSort, SortOption } from "@/components/bookings/BookingSort";
import { BookingsList } from "@/components/bookings/BookingsList";
import { filterBookings, sortBookings } from "@/components/bookings/utils/bookingUtils";
import { bookingsData } from "@/components/bookings/data/bookingsData";

const BookingsIndex = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("date-desc");
  
  // Apply filtering and sorting to the bookings
  const filteredBookings = filterBookings(bookingsData, activeTab);
  const sortedBookings = sortBookings(filteredBookings, sortOption);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const totalPages = 3;

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
      
      <BookingsList bookings={sortedBookings} />
      
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
