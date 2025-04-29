
import { Booking, BookingStatus } from "@/components/bookings/types/booking";
import { SortOption } from "../BookingSort";

// Filter bookings based on active tab
export const filterBookings = (bookings: Booking[], activeTab: string) => {
  return bookings.filter(booking => {
    if (activeTab === "all") return true;
    if (activeTab === "next24h") {
      return booking.date === "2023-10-15";
    }
    if (activeTab === "confirmed") return booking.status === "confirmed";
    if (activeTab === "completed") return booking.status === "completed";
    if (activeTab === "cancelled") return booking.status === "cancelled";
    if (activeTab === "latest") {
      return booking.id === "B39218" || booking.id === "B39217";
    }
    return true;
  });
};

// Sort bookings based on selected sort option
export const sortBookings = (bookings: Booking[], sortOption: SortOption) => {
  return [...bookings].sort((a, b) => {
    switch (sortOption) {
      case "date-asc":
        return a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
      case "date-desc":
        return b.date.localeCompare(a.date) || b.time.localeCompare(a.time);
      case "price-asc":
        return parseFloat(a.price.replace("$", "")) - parseFloat(b.price.replace("$", ""));
      case "price-desc":
        return parseFloat(b.price.replace("$", "")) - parseFloat(a.price.replace("$", ""));
      case "status":
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });
};
