
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingDetailsTab } from "./BookingDetailsTab";
import { PassengersTab } from "./PassengersTab";
import { PaymentTab } from "./PaymentTab";
import { NotesTab } from "./NotesTab";
import { useBookingForm } from "@/hooks/useBookingForm";
import { useBookings } from "@/hooks/useBookings";
import { Spinner } from "@/components/ui/spinner";
import { BookingFormData } from "@/lib/schemas/bookingSchema";

interface BookingFormContainerProps {
  isEditing?: boolean;
  bookingId?: string;
}

export function BookingFormContainer({ isEditing = false, bookingId }: BookingFormContainerProps) {
  const { useBookingQuery } = useBookings();
  // Fetch booking data if in edit mode
  const { data: bookingData, isLoading: isLoadingBooking } = useBookingQuery(bookingId);
  
  const {
    form,
    activeTab,
    setActiveTab,
    handleNext, 
    handleBack,
    onSubmit,
    navigate,
  } = useBookingForm({ 
    isEditing, 
    bookingId, 
    bookingData, 
    isLoadingBooking 
  });

  if (isEditing && isLoadingBooking) {
    return <div className="flex justify-center p-6"><Spinner /></div>;
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="passengers">Passengers</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <BookingDetailsTab
            form={form}
            isEditing={isEditing}
            onNext={handleNext}
            onCancel={() => navigate("/bookings")}
          />
        </TabsContent>
        <TabsContent value="passengers">
          <PassengersTab form={form} onBack={handleBack} onNext={handleNext} />
        </TabsContent>
        <TabsContent value="payment">
          <PaymentTab form={form} onBack={handleBack} onNext={handleNext} />
        </TabsContent>
        <TabsContent value="notes">
          <NotesTab
            form={form}
            isEditing={isEditing}
            onBack={handleBack}
          />
        </TabsContent>
      </Tabs>
    </form>
  );
}
