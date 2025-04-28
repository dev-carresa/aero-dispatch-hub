
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { BookingFormData } from "@/lib/schemas/bookingSchema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface NotesTabProps {
  form: UseFormReturn<BookingFormData>;
  isEditing: boolean;
  onBack: () => void;
}

export function NotesTab({ form, isEditing, onBack }: NotesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Notes & Tracking</CardTitle>
        <CardDescription>Add notes, assign income, and set tracking status</CardDescription>
      </CardHeader>
      <Form {...form}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-medium">Notes</h3>
            <FormField
              control={form.control}
              name="adminNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Notes</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} value={field.value || ""} />
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
                    <Textarea rows={3} {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4 pt-2 border-t">
            <h3 className="text-base font-medium">Income Assignment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="driverIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Driver Income ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number" 
                        min={0} 
                        step={0.01} 
                        placeholder="0.00" 
                        {...field} 
                        value={field.value || ""} 
                        onChange={e => field.onChange(e.target.value === "" ? undefined : parseFloat(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fleetIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fleet Income ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number" 
                        min={0} 
                        step={0.01} 
                        placeholder="0.00" 
                        {...field} 
                        value={field.value || ""} 
                        onChange={e => field.onChange(e.target.value === "" ? undefined : parseFloat(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t">
            <h3 className="text-base font-medium">Tracking Status</h3>
            <FormField
              control={form.control}
              name="trackingStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="onroute">On Route</SelectItem>
                      <SelectItem value="arrived">Arrived</SelectItem>
                      <SelectItem value="onboard">On Board</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="noshow">No Show</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
