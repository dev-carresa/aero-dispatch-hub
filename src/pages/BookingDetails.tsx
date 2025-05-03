
import { useParams, Link, useNavigate } from "react-router-dom";
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
  X,
  Plus
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useBookings } from "@/hooks/useBookings";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useEffect } from "react";

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useBookingQuery } = useBookings();
  const { data: booking, isLoading, error } = useBookingQuery(id);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load booking details");
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!booking && !isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/bookings">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Booking Not Found</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p>The booking you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button 
              onClick={() => navigate("/bookings")} 
              className="mt-4"
            >
              Return to Bookings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format booking reference
  const bookingRef = `B${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`;

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
              Booking #{bookingRef}
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
              Reference: {bookingRef} • Created: {new Date(booking.created_at).toLocaleString()}
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
          <Link to={`/bookings/${id}/edit`}>
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
                      <p className="font-medium">{booking.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{booking.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span>{booking.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span>Passengers: {booking.passenger_count}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span>Luggage: {booking.luggage_count}</span>
                  </div>
                  {booking.flight_number && (
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span>Flight: {booking.flight_number}</span>
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
                      <p className="font-medium">{booking.pickup_location}</p>
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
                      <p className="font-medium">{new Date(booking.pickup_date).toLocaleDateString()} at {booking.pickup_time}</p>
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
                      <p className="font-medium">{booking.vehicle_type}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Driver</p>
                      <p className="font-medium">Not yet assigned</p>
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
                    <span className="font-medium">${booking.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium">{booking.payment_method}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Payment Status</span>
                    <Badge variant="outline" className="font-medium">
                      {booking.payment_status}
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
                <p className="text-sm">{booking.special_instructions || "No special instructions available."}</p>
                {booking.admin_notes && (
                  <>
                    <p className="text-sm font-medium mt-4">Admin Notes:</p>
                    <p className="text-sm">{booking.admin_notes}</p>
                  </>
                )}
                {booking.driver_notes && (
                  <>
                    <p className="text-sm font-medium mt-4">Driver Notes:</p>
                    <p className="text-sm">{booking.driver_notes}</p>
                  </>
                )}
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
                    <Plus className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Booking Created</p>
                    <p className="text-sm text-muted-foreground">{new Date(booking.created_at).toLocaleString()}</p>
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
              <div className="text-center py-6 text-muted-foreground">
                No messages available for this booking.
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
                        <td className="py-3 px-4">Transportation Service</td>
                        <td className="py-3 px-4 text-right">${booking.price}</td>
                      </tr>
                      <tr className="border-t">
                        <td className="py-3 px-4 font-medium">Total</td>
                        <td className="py-3 px-4 text-right font-medium">${booking.price}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Payment History</h3>
                  {booking.payment_status === 'paid' ? (
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
                            <td className="py-3 px-4">{new Date(booking.created_at).toLocaleDateString()}</td>
                            <td className="py-3 px-4">{booking.payment_method}</td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                Completed
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">${booking.price}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4 border rounded-lg">
                      <p className="text-muted-foreground">No payment has been processed yet.</p>
                    </div>
                  )}
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
