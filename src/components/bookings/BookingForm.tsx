
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingDetailsTab } from "./form/BookingDetailsTab";
import { PassengersTab } from "./form/PassengersTab";
import { PaymentTab } from "./form/PaymentTab";
import { NotesTab } from "./form/NotesTab";
import { bookingFormSchema, type BookingFormData } from "@/lib/schemas/bookingSchema";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { bookingService } from "@/services/bookingService";
import { useQuery } from "@tanstack/react-query";

interface BookingFormProps {
  isEditing?: boolean;
  bookingId?: string;
}

export function BookingForm({ isEditing = false, bookingId }: BookingFormProps) {
  const [activeTab, setActiveTab] = useState("details");
  const navigate = useNavigate();
  
  const { data: bookingData, isLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingId ? bookingService.getBookingById(bookingId) : null,
    enabled: isEditing && !!bookingId
  });
  
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      customerName: "",
      email: "",
      phone: "",
      status: "pending",
      pickupLocation: "",
      destination: "",
      passengerCount: 1,
      luggageCount: 0,
      price: 0,
      paymentMethod: "credit-card",
      paymentStatus: "pending",
    }
  });
  
  // Populate form when editing and data is loaded
  useState(() => {
    if (isEditing && bookingData) {
      form.reset({
        customerName: bookingData.customer_name,
        email: bookingData.email,
        phone: bookingData.phone,
        status: bookingData.status,
        pickupLocation: bookingData.pickup_location,
        destination: bookingData.destination,
        pickupDate: new Date(bookingData.pickup_date),
        pickupTime: bookingData.pickup_time,
        vehicleType: bookingData.vehicle_type,
        passengerCount: bookingData.passenger_count,
        luggageCount: bookingData.luggage_count,
        flightNumber: bookingData.flight_number,
        specialInstructions: bookingData.special_instructions,
        price: bookingData.price,
        paymentMethod: bookingData.payment_method,
        paymentStatus: bookingData.payment_status,
        paymentNotes: bookingData.payment_notes,
        adminNotes: bookingData.admin_notes,
        driverNotes: bookingData.driver_notes,
        driverIncome: bookingData.driver_income,
        fleetIncome: bookingData.fleet_income,
        trackingStatus: bookingData.tracking_status
      });
    }
  }, [isEditing, bookingData, form]);

  const handleNext = () => {
    switch (activeTab) {
      case "details":
        const detailsValid = form.trigger([
          "customerName",
          "email",
          "phone",
          "status",
          "pickupLocation",
          "destination",
          "pickupDate",
          "pickupTime",
          "vehicleType",
        ]);
        if (detailsValid) setActiveTab("passengers");
        break;
      case "passengers":
        const passengersValid = form.trigger([
          "passengerCount",
          "luggageCount",
          "flightNumber",
          "specialInstructions",
        ]);
        if (passengersValid) setActiveTab("payment");
        break;
      case "payment":
        const paymentValid = form.trigger([
          "price",
          "paymentMethod",
          "paymentStatus",
          "paymentNotes",
        ]);
        if (paymentValid) setActiveTab("notes");
        break;
    }
  };

  const handleBack = () => {
    switch (activeTab) {
      case "passengers":
        setActiveTab("details");
        break;
      case "payment":
        setActiveTab("passengers");
        break;
      case "notes":
        setActiveTab("payment");
        break;
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    try {
      if (isEditing && bookingId) {
        await bookingService.updateBooking(bookingId, data);
        toast.success("Réservation mise à jour avec succès");
      } else {
        await bookingService.createBooking(data);
        toast.success("Réservation créée avec succès");
      }
      navigate('/bookings');
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  if (isLoading && isEditing) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="passengers">Passagers</TabsTrigger>
          <TabsTrigger value="payment">Paiement</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <BookingDetailsTab
            form={form}
            isEditing={isEditing}
            onNext={handleNext}
            onCancel={() => navigate('/bookings')}
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
