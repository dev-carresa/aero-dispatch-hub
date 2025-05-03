
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { BookingFormData } from "@/lib/schemas/bookingSchema";
import { MinusCircle, PlusCircle, Users, Briefcase } from "lucide-react";

interface PassengersTabProps {
  form: UseFormReturn<BookingFormData>;
  onBack: () => void;
  onNext: () => void;
}

export function PassengersTab({ form, onBack, onNext }: PassengersTabProps) {
  const passengerCount = form.watch('passengerCount');
  const luggageCount = form.watch('luggageCount');

  const incrementPassengers = () => {
    form.setValue('passengerCount', passengerCount + 1);
  };

  const decrementPassengers = () => {
    if (passengerCount > 1) {
      form.setValue('passengerCount', passengerCount - 1);
    }
  };

  const incrementLuggage = () => {
    form.setValue('luggageCount', luggageCount + 1);
  };

  const decrementLuggage = () => {
    if (luggageCount > 0) {
      form.setValue('luggageCount', luggageCount - 1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Passenger Information</CardTitle>
        <CardDescription>Add all passenger details</CardDescription>
      </CardHeader>
      <Form {...form}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="passengerCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Passengers</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Button 
                        type="button"
                        variant="outline" 
                        size="icon"
                        onClick={decrementPassengers}
                        className="rounded-r-none"
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <div className="relative flex-1">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                        </div>
                        <Input
                          type="number"
                          min="1"
                          className="pl-10 text-center"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </div>
                      <Button 
                        type="button"
                        variant="outline" 
                        size="icon"
                        onClick={incrementPassengers}
                        className="rounded-l-none"
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
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
                    <div className="flex items-center">
                      <Button 
                        type="button"
                        variant="outline" 
                        size="icon"
                        onClick={decrementLuggage}
                        className="rounded-r-none"
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <div className="relative flex-1">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          <Briefcase className="h-4 w-4" />
                        </div>
                        <Input
                          type="number"
                          min="0"
                          className="pl-10 text-center"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </div>
                      <Button 
                        type="button"
                        variant="outline" 
                        size="icon"
                        onClick={incrementLuggage}
                        className="rounded-l-none"
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="specialInstructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Instructions</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="E.g., wheelchair access needed, infant car seat required, etc."
                    className="min-h-[120px]"
                    {...field} 
                  />
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
