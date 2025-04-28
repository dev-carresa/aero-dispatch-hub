
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { BookingFormData } from "@/lib/schemas/bookingSchema";

interface NotesTabProps {
  form: UseFormReturn<BookingFormData>;
  isEditing: boolean;
  onBack: () => void;
}

export function NotesTab({ form, isEditing, onBack }: NotesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Notes</CardTitle>
        <CardDescription>Add any notes or comments about this booking</CardDescription>
      </CardHeader>
      <Form {...form}>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="adminNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admin Notes</FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="driverNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Driver Notes</FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button type="submit">
            {isEditing ? "Update Booking" : "Save Booking"}
          </Button>
        </CardFooter>
      </Form>
    </Card>
  );
}
