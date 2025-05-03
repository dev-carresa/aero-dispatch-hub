
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookingForm } from "@/components/bookings/BookingForm";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Spinner } from "@/components/ui/spinner";

const NewBooking = () => {
  const { loading } = useRequireAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link to="/bookings">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">New Booking</h2>
          <p className="text-muted-foreground">
            Create a new transportation booking
          </p>
        </div>
      </div>
      
      <BookingForm />
    </div>
  );
};

export default NewBooking;
