
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { BookingForm } from "@/components/bookings/BookingForm";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Spinner } from "@/components/ui/spinner";

const EditBooking = () => {
  const { id } = useParams<{ id: string }>();
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
        <Link to={`/bookings/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Booking #{id}</h2>
          <p className="text-muted-foreground">
            Update the details for this booking
          </p>
        </div>
      </div>
      
      <BookingForm isEditing={true} bookingId={id} />
    </div>
  );
};

export default EditBooking;
