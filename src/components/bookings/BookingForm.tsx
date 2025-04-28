
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingDetailsTab } from "./form/BookingDetailsTab";
import { PassengersTab } from "./form/PassengersTab";
import { PaymentTab } from "./form/PaymentTab";
import { NotesTab } from "./form/NotesTab";

interface BookingFormProps {
  isEditing?: boolean;
  bookingId?: string;
}

export function BookingForm({ isEditing = false, bookingId }: BookingFormProps) {
  const [activeTab, setActiveTab] = useState("details");

  const handleNext = () => {
    switch (activeTab) {
      case "details":
        setActiveTab("passengers");
        break;
      case "passengers":
        setActiveTab("payment");
        break;
      case "payment":
        setActiveTab("notes");
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

  const handleSubmit = () => {
    console.log("Form submitted");
    // Add form submission logic here
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="passengers">Passengers</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <BookingDetailsTab
            isEditing={isEditing}
            onNext={handleNext}
            onCancel={() => console.log("Cancelled")}
          />
        </TabsContent>
        <TabsContent value="passengers">
          <PassengersTab onBack={handleBack} onNext={handleNext} />
        </TabsContent>
        <TabsContent value="payment">
          <PaymentTab onBack={handleBack} onNext={handleNext} />
        </TabsContent>
        <TabsContent value="notes">
          <NotesTab isEditing={isEditing} onBack={handleBack} onSubmit={handleSubmit} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
