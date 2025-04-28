
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, Filter, MapPin, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";

// Sample data for recent bookings
const bookings = [
  {
    id: "B39218",
    customer: "John Smith",
    origin: "JFK Airport",
    destination: "Manhattan Hotel",
    date: "Today",
    time: "14:30",
    status: "confirmed",
  },
  {
    id: "B39217", 
    customer: "Alice Johnson",
    origin: "LaGuardia Airport",
    destination: "Brooklyn Heights",
    date: "Today",
    time: "16:45",
    status: "pending",
  },
  {
    id: "B39216",
    customer: "Robert Davis",
    origin: "Newark Airport",
    destination: "Wall Street",
    date: "Today",
    time: "18:15",
    status: "completed",
  },
  {
    id: "B39215",
    customer: "Maria Garcia",
    origin: "Manhattan",
    destination: "JFK Airport",
    date: "Tomorrow",
    time: "05:30",
    status: "confirmed",
  },
  {
    id: "B39214", 
    customer: "David Wilson",
    origin: "Midtown",
    destination: "LaGuardia Airport",
    date: "Tomorrow",
    time: "10:00",
    status: "confirmed",
  }
];

export function RecentBookings() {
  return (
    <Card className="col-span-1 lg:col-span-full hover-scale shadow-sm card-gradient">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Recent Bookings</CardTitle>
          <CardDescription>Latest booking activities</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search bookings..." className="pl-8 h-8 w-[180px] text-xs bg-white" />
          </div>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <Filter className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <span className="text-xs">View All</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground text-left">ID</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground text-left">Customer</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground text-left">From</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground text-left">To</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground text-left">Pickup</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr 
                    key={booking.id} 
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-muted/20'} hover:bg-muted/30`}
                  >
                    <td className="px-4 py-3 text-sm font-medium">{booking.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                          <User className="h-4 w-4" />
                        </div>
                        <div className="text-sm">{booking.customer}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span>{booking.origin}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span>{booking.destination}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span>{booking.date}, {booking.time}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`status-badge ${
                        booking.status === 'confirmed' 
                          ? 'status-badge-confirmed' 
                          : booking.status === 'completed'
                          ? 'status-badge-completed'
                          : 'status-badge-pending'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
