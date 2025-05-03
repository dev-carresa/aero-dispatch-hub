
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingDetailsTab } from "./form/BookingDetailsTab";
import { PassengersTab } from "./form/PassengersTab";
import { PaymentTab } from "./form/PaymentTab";
import { NotesTab } from "./form/NotesTab";
import { bookingFormSchema, type BookingFormData } from "@/lib/schemas/bookingSchema";
import { toast } from "@/components/ui/sonner";
import { useBookings } from "@/hooks/useBookings";
import { useAuth } from "@/context/AuthContext";

interface BookingFormProps {
  isEditing?: boolean;
  bookingId?: string;
}

export function BookingForm({ isEditing = false, bookingId }: BookingFormProps) {
  const [activeTab, setActiveTab] = useState("details");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { useCreateBookingMutation, useUpdateBookingMutation, useBookingQuery } = useBookings();
  
  // Fetch booking data if in edit mode
  const { data: bookingData, isLoading: isLoadingBooking } = useBookingQuery(bookingId);
  
  // Create mutation for saving and updating bookings
  const createBookingMutation = useCreateBookingMutation();
  const updateBookingMutation = useUpdateBookingMutation();
  
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      customerName: bookingData?.customer_name || "",
      companyName: "",
      email: bookingData?.email || "",
      phone: bookingData?.phone || "",
      status: bookingData?.status || "pending",
      pickupLocation: bookingData?.pickup_location || "",
      destination: bookingData?.destination || "",
      passengerCount: bookingData?.passenger_count || 1,
      luggageCount: bookingData?.luggage_count || 0,
      price: bookingData?.price || 0,
      paymentMethod: bookingData?.payment_method || "credit-card",
      paymentStatus: bookingData?.payment_status || "pending",
      tripType: "transfer",
      pickupDate: bookingData?.pickup_date ? new Date(bookingData.pickup_date) : undefined,
      pickupTime: bookingData?.pickup_time || "",
      vehicleType: bookingData?.vehicle_type || "",
      flightNumber: bookingData?.flight_number || "",
      specialInstructions: bookingData?.special_instructions || "",
      paymentNotes: bookingData?.payment_notes || "",
      adminNotes: bookingData?.admin_notes || "",
      driverNotes: bookingData?.driver_notes || "",
    },
  });

  // Update form values when booking data is loaded
  useState(() => {
    if (bookingData && isEditing) {
      Object.keys(bookingData).forEach((key) => {
        const formKey = key as keyof BookingFormData;
        if (key === 'pickup_date' && bookingData[key]) {
          form.setValue('pickupDate', new Date(bookingData[key]));
        } else if (form.getValues()[formKey] !== undefined) {
          // @ts-ignore - this is fine since we're checking if the key exists
          form.setValue(formKey, bookingData[key]);
        }
      });
    }
  });

  const handleNext = () => {
    switch (activeTab) {
      case "details":
        const detailsValid = form.trigger([
          "customerName",
          "companyName",
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

  // Map form data to database schema
  const mapFormDataToDbSchema = (data: BookingFormData) => {
    return {
      customer_name: data.customerName,
      email: data.email,
      phone: data.phone,
      status: data.status,
      pickup_location: data.pickupLocation,
      destination: data.destination,
      pickup_date: data.pickupDate?.toISOString().split('T')[0],
      pickup_time: data.pickupTime,
      vehicle_type: data.vehicleType,
      passenger_count: data.passengerCount,
      luggage_count: data.luggageCount,
      flight_number: data.flightNumber,
      special_instructions: data.specialInstructions,
      price: data.price,
      payment_method: data.paymentMethod,
      payment_status: data.paymentStatus,
      payment_notes: data.paymentNotes,
      admin_notes: data.adminNotes,
      driver_notes: data.driverNotes,
    };
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to create a booking");
      return;
    }

    try {
      const mappedData = mapFormDataToDbSchema(data);
      
      if (isEditing && bookingId) {
        await updateBookingMutation.mutateAsync({
          id: bookingId,
          data: mappedData
        });
        toast.success("Booking updated successfully");
        navigate(`/bookings/${bookingId}`);
      } else {
        await createBookingMutation.mutateAsync(mappedData);
        toast.success("Booking created successfully");
        navigate("/bookings");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to save booking. Please try again.");
    }
  };

  if (isEditing && isLoadingBooking) {
    return <div className="flex justify-center p-6">Loading booking data...</div>;
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
