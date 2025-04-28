
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, MapPin, User } from "lucide-react";

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
    <Card className="col-span-1 lg:col-span-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Latest booking activities</CardDescription>
        </div>
        <Button variant="outline" size="sm">View All</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-4 w-full md:w-auto mb-2 md:mb-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                  ${booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                    booking.status === 'completed' ? 'bg-green-100 text-green-700' : 
                    'bg-yellow-100 text-yellow-700'}`}
                >
                  {booking.status === 'completed' ? (
                    <Calendar className="h-5 w-5" />
                  ) : (
                    <Clock className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{booking.id}</p>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <User className="h-3 w-3 mr-1" />
                    {booking.customer}
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-2 md:gap-6 w-full md:w-auto">
                <div className="text-sm">
                  <p className="text-muted-foreground text-xs">From</p>
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span className="text-sm font-medium">{booking.origin}</span>
                  </div>
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground text-xs">To</p>
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span className="text-sm font-medium">{booking.destination}</span>
                  </div>
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground text-xs">Pickup</p>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span className="text-sm font-medium">{booking.date}, {booking.time}</span>
                  </div>
                </div>
                <div>
                  <span className={`status-badge ${
                    booking.status === 'confirmed' 
                      ? 'status-badge-confirmed' 
                      : booking.status === 'completed'
                      ? 'status-badge-completed'
                      : 'status-badge-pending'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
