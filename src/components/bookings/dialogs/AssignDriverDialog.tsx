
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DriverSearchList } from "./driver-assign/DriverSearchList";
import { drivers } from "./driver-assign/driverData";
import { assignDriverSchema, AssignDriverFormData } from "./driver-assign/assignDriverSchema";

interface AssignDriverDialogProps {
  bookingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignDriverDialog({ bookingId, open, onOpenChange }: AssignDriverDialogProps) {
  const { toast } = useToast();

  const form = useForm<AssignDriverFormData>({
    resolver: zodResolver(assignDriverSchema),
    defaultValues: {
      driverId: "",
      driverIncome: 0
    },
  });

  const handleAssign = (data: AssignDriverFormData) => {
    if (!data.driverId) {
      toast({
        title: "No driver selected",
        description: "Please select a driver to assign.",
        variant: "destructive",
      });
      return;
    }

    // Here you would actually assign the driver in a real application
    toast({
      title: "Driver assigned",
      description: `Driver has been successfully assigned to booking #${bookingId} with income $${data.driverIncome}.`,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Driver to Booking #{bookingId}</DialogTitle>
          <DialogDescription>
            Select a driver from the list below or add a new driver.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAssign)} className="space-y-4 py-3">
            <DriverSearchList 
              drivers={drivers}
              selectedDriverId={form.watch('driverId')}
              onSelectDriver={(driverId) => form.setValue('driverId', driverId, { shouldValidate: true })}
            />
            
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
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {form.watch('driverId') ? 
                  `Selected driver: ${drivers.find(d => d.id === form.watch('driverId'))?.name}` : 
                  'No driver selected'}
              </p>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // In a real app, this would open a form to create a new driver
                  toast({
                    title: "Add new driver",
                    description: "This would open a form to add a new driver.",
                  });
                }}
              >
                Add New Driver
              </Button>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Assign Driver
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
