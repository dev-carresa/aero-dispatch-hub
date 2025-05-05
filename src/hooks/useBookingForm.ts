
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { bookingFormSchema, type BookingFormData } from "@/lib/schemas/bookingSchema";
import { toast } from "sonner";
import { useBookings } from "@/hooks/useBookings";
import { useAuth } from "@/context/AuthContext";

interface UseBookingFormOptions {
  isEditing?: boolean;
  bookingId?: string;
  bookingData?: any;
  isLoadingBooking?: boolean;
}

export function useBookingForm({ 
  isEditing = false, 
  bookingId,
  bookingData,
  isLoadingBooking = false
}: UseBookingFormOptions) {
  const [activeTab, setActiveTab] = useState("details");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { useCreateBookingMutation, useUpdateBookingMutation } = useBookings();
  
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
      status: (bookingData?.status as "pending" | "confirmed" | "cancelled" | "completed") || "pending",
      source: bookingData?.source || "",
      referenceSource: bookingData?.reference_source || "",
      pickupLocation: bookingData?.pickup_location || "",
      destination: bookingData?.destination || "",
      passengerCount: bookingData?.passenger_count || 1,
      luggageCount: bookingData?.luggage_count || 0,
      price: bookingData?.price || 0,
      paymentMethod: (bookingData?.payment_method as "credit-card" | "cash" | "invoice" | "paypal") || "credit-card",
      paymentStatus: (bookingData?.payment_status as "pending" | "paid" | "failed") || "pending",
      tripType: "transfer",
      pickupDate: bookingData?.pickup_date ? new Date(bookingData.pickup_date) : undefined,
      pickupTime: bookingData?.pickup_time || "",
      vehicleType: (bookingData?.vehicle_type as "sedan" | "suv" | "van" | "luxury") || "sedan",
      flightNumber: bookingData?.flight_number || "",
      specialInstructions: bookingData?.special_instructions || "",
      paymentNotes: bookingData?.payment_notes || "",
      adminNotes: bookingData?.admin_notes || "",
      driverNotes: bookingData?.driver_notes || "",
    },
  });

  // Update form values when booking data is loaded
  useEffect(() => {
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
  }, [bookingData, isEditing, form]);

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
      source: data.source,
      reference_source: data.referenceSource,
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
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error("Failed to save booking. Please try again.");
    }
  };

  return {
    form,
    activeTab,
    setActiveTab,
    handleNext,
    handleBack,
    onSubmit,
    isLoading: isLoadingBooking,
    navigate
  };
}
