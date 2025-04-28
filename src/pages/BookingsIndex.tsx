import { BookingFilters } from "@/components/bookings/BookingFilters";
import { BookingCard } from "@/components/bookings/BookingCard";
import { BookingPagination } from "@/components/bookings/BookingPagination";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpDown,
  Download, 
  FileText,
  Filter, 
  Plus, 
  RefreshCcw,
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingStatus } from "@/components/bookings/types/booking";

const bookingsData = [
  {
    id: "B39218",
    reference: "REF-39218",
    customer: "John Smith",
    origin: "JFK Airport Terminal 4",
    destination: "Hilton Manhattan Hotel",
    date: "2023-10-15",
    time: "14:30",
    vehicle: "Sedan - Black",
    driver: "Michael Rodriguez",
    status: "confirmed" as BookingStatus,
    price: "$125.00",
    fleet: "Premium Fleet",
    source: "Website",
    flightNumber: "AA1234",
    serviceType: "Arrival"
  },
  {
    id: "B39217", 
    reference: "REF-39217",
    customer: "Alice Johnson",
    origin: "LaGuardia Airport Terminal B",
    destination: "Brooklyn Heights, 55 Water Street",
    date: "2023-10-15",
    time: "16:45",
    vehicle: "SUV - White",
    driver: "",
    status: "pending" as BookingStatus,
    price: "$145.00",
    fleet: "",
    source: "Mobile App",
    flightNumber: "DL5678",
    serviceType: "Arrival"
  },
  {
    id: "B39216",
    reference: "REF-39216",
    customer: "Robert Davis",
    origin: "Newark Airport Terminal C",
    destination: "60 Wall Street, Manhattan",
    date: "2023-10-15",
    time: "18:15",
    vehicle: "Luxury Sedan - Black",
    driver: "James Wilson",
    status: "completed" as BookingStatus,
    price: "$180.00",
    fleet: "Premium Fleet",
    source: "Partner Agency",
    serviceType: "Arrival"
  },
  {
    id: "B39215",
    reference: "REF-39215",
    customer: "Maria Garcia",
    origin: "325 West 45th Street, Manhattan",
    destination: "JFK Airport Terminal 8",
    date: "2023-10-16",
    time: "05:30",
    vehicle: "Sedan - Black",
    driver: "David Brown",
    status: "confirmed" as BookingStatus,
    price: "$135.00",
    fleet: "Standard Fleet",
    source: "Website",
    flightNumber: "BA4321",
    serviceType: "Departure"
  },
  {
    id: "B39214", 
    reference: "REF-39214",
    customer: "David Wilson",
    origin: "Times Square Marriott Hotel",
    destination: "LaGuardia Airport Terminal C",
    date: "2023-10-16",
    time: "10:00",
    vehicle: "Luxury SUV - Black",
    driver: "Sarah Thompson",
    status: "confirmed" as BookingStatus,
    price: "$165.00",
    fleet: "Premium Fleet",
    source: "Phone Call",
    serviceType: "Departure"
  },
  {
    id: "B39213",
    reference: "REF-39213",
    customer: "Jennifer Taylor",
    origin: "JFK Airport Terminal 5",
    destination: "Sheraton Brooklyn Hotel",
    date: "2023-10-16",
    time: "11:15",
    vehicle: "Van - Silver",
    driver: "Carlos Lopez",
    status: "cancelled" as BookingStatus,
    price: "$155.00",
    fleet: "Standard Fleet",
    source: "Website",
    flightNumber: "JB2468",
    serviceType: "Arrival"
  }
];

const BookingsIndex = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredBookings = bookingsData.filter(booking => {
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const totalPages = 3;

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
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 md:grid-cols-7 lg:grid-cols-8 w-full h-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="next24h">Next 24h</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="latest">Latest</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          <TabsTrigger value="trash">Trash</TabsTrigger>
          <TabsTrigger value="new" asChild>
            <Link to="/bookings/new" className="w-full flex items-center justify-center">
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <BookingFilters />
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <strong>{filteredBookings.length}</strong> bookings
        </div>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4" />
          Sort
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
      
      {filteredBookings.length === 0 && (
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
