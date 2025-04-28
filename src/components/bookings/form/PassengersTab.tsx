
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { BookingFormData } from "@/lib/schemas/bookingSchema";

interface PassengersTabProps {
  form: UseFormReturn<BookingFormData>;
  onBack: () => void;
  onNext: () => void;
}

export function PassengersTab({ form, onBack, onNext }: PassengersTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Passenger Information</CardTitle>
        <CardDescription>Add all passenger details</CardDescription>
      </CardHeader>
      <Form {...form}>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="passengerCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Passengers</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="luggageCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Luggage</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="flightNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Flight Number (if applicable)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialInstructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Instructions</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button onClick={onNext}>Next</Button>
        </CardFooter>
      </Form>
    </Card>
  );
}
