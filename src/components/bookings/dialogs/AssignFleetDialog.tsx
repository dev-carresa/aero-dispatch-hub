
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
import { useState } from "react";
import { Car } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface AssignFleetDialogProps {
  bookingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Sample fleet data
const fleets = [
  { id: "1", name: "Premium Fleet", vehicles: 12, description: "Luxury vehicles for VIP clients" },
  { id: "2", name: "Standard Fleet", vehicles: 28, description: "Reliable sedans and SUVs" },
  { id: "3", name: "Economy Fleet", vehicles: 15, description: "Cost-effective transportation" },
  { id: "4", name: "Executive Fleet", vehicles: 8, description: "High-end vehicles for executives" },
];

const assignFleetSchema = z.object({
  fleetId: z.string().min(1, "Please select a fleet"),
  fleetIncome: z.number({
    required_error: "Fleet income is required",
    invalid_type_error: "Fleet income must be a number"
  }).min(0, "Fleet income cannot be negative")
});

type AssignFleetFormData = z.infer<typeof assignFleetSchema>;

export function AssignFleetDialog({ bookingId, open, onOpenChange }: AssignFleetDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const form = useForm<AssignFleetFormData>({
    resolver: zodResolver(assignFleetSchema),
    defaultValues: {
      fleetId: "",
      fleetIncome: 0
    },
  });

  const filteredFleets = fleets.filter(fleet => 
    fleet.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssign = (data: AssignFleetFormData) => {
    if (!data.fleetId) {
      toast({
        title: "No fleet selected",
        description: "Please select a fleet to assign.",
        variant: "destructive",
      });
      return;
    }

    // Here you would actually assign the fleet in a real application
    toast({
      title: "Fleet assigned",
      description: `Fleet has been successfully assigned to booking #${bookingId} with income $${data.fleetIncome}.`,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Fleet to Booking #{bookingId}</DialogTitle>
          <DialogDescription>
            Select a fleet from the list below or add a new fleet.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAssign)} className="space-y-4 py-3">
            <div className="relative">
              <Input 
                placeholder="Search fleets..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="border rounded-md max-h-[300px] overflow-y-auto">
              {filteredFleets.length > 0 ? (
                filteredFleets.map((fleet) => (
                  <div 
                    key={fleet.id}
                    className={`flex items-center gap-3 p-3 border-b last:border-0 cursor-pointer hover:bg-muted transition-colors ${
                      form.watch('fleetId') === fleet.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => form.setValue('fleetId', fleet.id, { shouldValidate: true })}
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Car className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{fleet.name}</p>
                      <p className="text-xs text-muted-foreground">{fleet.description}</p>
                    </div>
                    <div>
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">
                        {fleet.vehicles} vehicles
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No fleets found matching "{searchQuery}"
                </div>
              )}
            </div>
            
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
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {form.watch('fleetId') ? 
                  `Selected fleet: ${fleets.find(f => f.id === form.watch('fleetId'))?.name}` : 
                  'No fleet selected'}
              </p>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // In a real app, this would open a form to create a new fleet
                  toast({
                    title: "Add new fleet",
                    description: "This would open a form to add a new fleet.",
                  });
                }}
              >
                Add New Fleet
              </Button>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Assign Fleet
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
