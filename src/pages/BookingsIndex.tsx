
import { BookingFilters } from "@/components/bookings/BookingFilters";
import { BookingCard } from "@/components/bookings/BookingCard";
import { Button } from "@/components/ui/button";
import { 
  DownloadCloud, 
  Filter, 
  Plus, 
  RefreshCcw 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

// Sample data for bookings
const bookings = [
  {
    id: "B39218",
    customer: "John Smith",
    origin: "JFK Airport Terminal 4",
    destination: "Hilton Manhattan Hotel",
    date: "2023-10-15",
    time: "14:30",
    vehicle: "Sedan - Black",
    driver: "Michael Rodriguez",
    status: "confirmed",
    price: "$125.00",
  },
  {
    id: "B39217", 
    customer: "Alice Johnson",
    origin: "LaGuardia Airport Terminal B",
    destination: "Brooklyn Heights, 55 Water Street",
    date: "2023-10-15",
    time: "16:45",
    vehicle: "SUV - White",
    driver: "Pending Assignment",
    status: "pending",
    price: "$145.00",
  },
  {
    id: "B39216",
    customer: "Robert Davis",
    origin: "Newark Airport Terminal C",
    destination: "60 Wall Street, Manhattan",
    date: "2023-10-15",
    time: "18:15",
    vehicle: "Luxury Sedan - Black",
    driver: "James Wilson",
    status: "completed",
    price: "$180.00",
  },
  {
    id: "B39215",
    customer: "Maria Garcia",
    origin: "325 West 45th Street, Manhattan",
    destination: "JFK Airport Terminal 8",
    date: "2023-10-16",
    time: "05:30",
    vehicle: "Sedan - Black",
    driver: "David Brown",
    status: "confirmed",
    price: "$135.00",
  },
  {
    id: "B39214", 
    customer: "David Wilson",
    origin: "Times Square Marriott Hotel",
    destination: "LaGuardia Airport Terminal C",
    date: "2023-10-16",
    time: "10:00",
    vehicle: "Luxury SUV - Black",
    driver: "Sarah Thompson",
    status: "confirmed",
    price: "$165.00",
  },
  {
    id: "B39213",
    customer: "Jennifer Taylor",
    origin: "JFK Airport Terminal 5",
    destination: "Sheraton Brooklyn Hotel",
    date: "2023-10-16",
    time: "11:15",
    vehicle: "Van - Silver",
    driver: "Carlos Lopez",
    status: "cancelled",
    price: "$155.00",
  }
];

const BookingsIndex = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
          <p className="text-muted-foreground">
            Manage your transportation bookings
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <DownloadCloud className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem>Export as Excel</DropdownMenuItem>
              <DropdownMenuItem>Export as PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/bookings/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </Button>
          </Link>
        </div>
      </div>
      
      <BookingFilters />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
      
      <div className="flex justify-center">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  );
};

export default BookingsIndex;
