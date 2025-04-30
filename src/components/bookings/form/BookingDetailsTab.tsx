
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { CustomerInfoFields } from "./components/CustomerInfoFields";
import { LocationFields } from "./components/LocationFields";
import { PickupAndVehicleFields } from "./components/PickupAndVehicleFields";
import { BookingFormActions } from "./components/BookingFormActions";
import type { BookingFormData } from "@/lib/schemas/bookingSchema";

interface BookingDetailsTabProps {
  form: UseFormReturn<BookingFormData>;
  isEditing: boolean;
  onNext: () => void;
  onCancel: () => void;
}

export function BookingDetailsTab({ form, isEditing, onNext, onCancel }: BookingDetailsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Details</CardTitle>
        <CardDescription>
          {isEditing ? "Edit the booking information" : "Enter the basic booking information"}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <CardContent className="space-y-4">
          <CustomerInfoFields form={form} />
          <LocationFields form={form} />
          <PickupAndVehicleFields form={form} />
        </CardContent>
        <CardFooter>
          <BookingFormActions onNext={onNext} onCancel={onCancel} />
        </CardFooter>
      </Form>
    </Card>
  );
}
