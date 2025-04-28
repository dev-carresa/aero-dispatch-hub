
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

export function AssignFleetDialog({ bookingId, open, onOpenChange }: AssignFleetDialogProps) {
  const [selectedFleet, setSelectedFleet] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const filteredFleets = fleets.filter(fleet => 
    fleet.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssign = () => {
    if (!selectedFleet) {
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
      description: `Fleet has been successfully assigned to booking #${bookingId}.`,
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
        
        <div className="space-y-4 py-3">
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
                    selectedFleet === fleet.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => setSelectedFleet(fleet.id)}
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
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {selectedFleet ? `Selected fleet: ${fleets.find(f => f.id === selectedFleet)?.name}` : 'No fleet selected'}
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
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign}>
            Assign Fleet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
