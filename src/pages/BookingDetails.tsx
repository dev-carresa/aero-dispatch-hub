
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  CalendarClock,
  Car, 
  CheckCircle, 
  Clock, 
  Edit, 
  FileText, 
  MapPin, 
  MessageSquare, 
  Phone, 
  Printer, 
  Share2, 
  Trash2,
  User,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

// Sample booking data
const booking = {
  id: "B39218",
  referenceId: "REF-123456",
  customer: "John Smith",
  email: "john.smith@example.com",
  phone: "+1 (555) 123-4567",
  origin: "JFK Airport Terminal 4",
  destination: "Hilton Manhattan Hotel, 152 W 54th St, New York",
  date: "2023-10-15",
  time: "14:30",
  vehicle: "Sedan - Black",
  driver: "Michael Rodriguez",
  driverPhone: "+1 (555) 987-6543",
  status: "confirmed",
  price: "$125.00",
  paymentStatus: "Paid",
  paymentMethod: "Credit Card",
  passengers: 2,
  luggage: 2,
  flightNumber: "AA1234",
  notes: "Customer requested bottled water.",
  createdAt: "2023-10-10 09:23:45",
  updatedAt: "2023-10-12 14:05:12"
};

const BookingDetails = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-4">
          <Link to="/bookings">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              Booking #{booking.id}
              <Badge className={
                booking.status === 'confirmed' 
                  ? 'bg-green-500' 
                  : booking.status === 'completed'
                  ? 'bg-blue-500'
                  : booking.status === 'cancelled'
                  ? 'bg-red-500'
                  : 'bg-yellow-500'
              }>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </h2>
            <p className="text-muted-foreground">
              Reference: {booking.referenceId} • Created: {booking.createdAt}
            </p>
          </div>
        </div>
        <div className="flex gap-2 self-end sm:self-auto">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Link to={`/bookings/${booking.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{booking.customer}</p>
                      <p className="text-sm text-muted-foreground">{booking.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span>{booking.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span>Passengers: {booking.passengers}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span>Luggage: {booking.luggage}</span>
                  </div>
                  {booking.flightNumber && (
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span>Flight: {booking.flightNumber}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Trip Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Pickup Location</p>
                      <p className="font-medium">{booking.origin}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Destination</p>
                      <p className="font-medium">{booking.destination}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <CalendarClock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Pickup Date & Time</p>
                      <p className="font-medium">{booking.date} at {booking.time}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Vehicle & Driver</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Vehicle Type</p>
                      <p className="font-medium">{booking.vehicle}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Driver</p>
                      <p className="font-medium">{booking.driver}</p>
                      <p className="text-sm text-muted-foreground">{booking.driverPhone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">{booking.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium">{booking.paymentMethod}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Payment Status</span>
                    <Badge variant="outline" className="font-medium">
                      {booking.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{booking.notes || "No notes available."}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
              <CardDescription>Complete history of this booking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="relative pl-8 pb-6 border-l border-muted">
                  <div className="absolute w-6 h-6 rounded-full bg-primary flex items-center justify-center -left-3 top-0">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Booking Confirmed</p>
                    <p className="text-sm text-muted-foreground">2023-10-12 14:05:12</p>
                    <p className="text-sm mt-1">Driver assigned: Michael Rodriguez</p>
                  </div>
                </div>
                
                <div className="relative pl-8 pb-6 border-l border-muted">
                  <div className="absolute w-6 h-6 rounded-full bg-muted-foreground flex items-center justify-center -left-3 top-0">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Payment Received</p>
                    <p className="text-sm text-muted-foreground">2023-10-11 10:12:34</p>
                    <p className="text-sm mt-1">$125.00 via Credit Card</p>
                  </div>
                </div>
                
                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 rounded-full bg-muted-foreground flex items-center justify-center -left-3 top-0">
                    <Plus className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Booking Created</p>
                    <p className="text-sm text-muted-foreground">2023-10-10 09:23:45</p>
                    <p className="text-sm mt-1">Created by admin@company.com</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Communication history for this booking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">System Notification</span>
                        <span className="text-xs text-muted-foreground">2023-10-12 14:05:12</span>
                      </div>
                      <p className="text-sm">Driver Michael Rodriguez has been assigned to your booking.</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">System Notification</span>
                        <span className="text-xs text-muted-foreground">2023-10-11 10:12:34</span>
                      </div>
                      <p className="text-sm">Your payment of $125.00 has been processed successfully.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Details about payment and invoicing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="py-3 px-4 text-left">Description</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="py-3 px-4">Airport Transfer - JFK to Manhattan</td>
                        <td className="py-3 px-4 text-right">$125.00</td>
                      </tr>
                      <tr className="border-t">
                        <td className="py-3 px-4 font-medium">Total</td>
                        <td className="py-3 px-4 text-right font-medium">$125.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Payment History</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="py-3 px-4 text-left">Date</th>
                          <th className="py-3 px-4 text-left">Method</th>
                          <th className="py-3 px-4 text-left">Status</th>
                          <th className="py-3 px-4 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="py-3 px-4">2023-10-11</td>
                          <td className="py-3 px-4">Credit Card</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              Completed
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">$125.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookingDetails;
