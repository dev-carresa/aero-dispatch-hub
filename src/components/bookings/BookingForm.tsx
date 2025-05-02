
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

interface BookingFormProps {
  isEditing?: boolean;
  bookingId?: string;
}

export function BookingForm({ isEditing = false, bookingId }: BookingFormProps) {
  const [activeTab, setActiveTab] = useState("details");
  
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      customerName: "",
      companyName: "",
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
      tripType: "transfer",
    },
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

  const onSubmit = async (data: BookingFormData) => {
    try {
      console.log('Form data:', data);
      // Add API call here
      toast.success(isEditing ? "Booking updated successfully" : "Booking created successfully");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

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
            onCancel={() => console.log("Cancelled")}
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
