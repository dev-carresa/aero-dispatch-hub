
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
import { Car, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AssignVehicleDialogProps {
  bookingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Sample vehicle data
const vehicles = [
  { id: "1", model: "Mercedes S-Class", type: "Sedan", registration: "ABC123", status: "Available", fleet: "Premium Fleet" },
  { id: "2", model: "BMW X5", type: "SUV", registration: "DEF456", status: "Available", fleet: "Premium Fleet" },
  { id: "3", model: "Toyota Camry", type: "Sedan", registration: "GHI789", status: "In Service", fleet: "Standard Fleet" },
  { id: "4", model: "Cadillac Escalade", type: "SUV", registration: "JKL012", status: "Available", fleet: "Premium Fleet" },
  { id: "5", model: "Ford Transit", type: "Van", registration: "MNO345", status: "Available", fleet: "Standard Fleet" },
  { id: "6", model: "Chevrolet Suburban", type: "SUV", registration: "PQR678", status: "Maintenance", fleet: "Standard Fleet" },
];

export function AssignVehicleDialog({ bookingId, open, onOpenChange }: AssignVehicleDialogProps) {
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [vehicleTab, setVehicleTab] = useState("all");
  const { toast } = useToast();

  const filteredVehicles = vehicles
    .filter(vehicle => 
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.registration.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(vehicle => 
      vehicleTab === "all" ? true : 
      vehicleTab === "sedan" ? vehicle.type === "Sedan" : 
      vehicleTab === "suv" ? vehicle.type === "SUV" : 
      vehicleTab === "van" ? vehicle.type === "Van" : true
    );

  const handleAssign = () => {
    if (!selectedVehicle) {
      toast({
        title: "No vehicle selected",
        description: "Please select a vehicle to assign.",
        variant: "destructive",
      });
      return;
    }

    // Here you would actually assign the vehicle in a real application
    toast({
      title: "Vehicle assigned",
      description: `Vehicle has been successfully assigned to booking #${bookingId}.`,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Assign Vehicle to Booking #{bookingId}</DialogTitle>
          <DialogDescription>
            Select a vehicle from the list below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Input 
                placeholder="Search vehicles..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs 
              value={vehicleTab} 
              onValueChange={setVehicleTab}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="sedan">Sedans</TabsTrigger>
                <TabsTrigger value="suv">SUVs</TabsTrigger>
                <TabsTrigger value="van">Vans</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="border rounded-md max-h-[350px] overflow-y-auto">
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle) => (
                <div 
                  key={vehicle.id}
                  className={`flex items-center gap-3 p-3 border-b last:border-0 cursor-pointer hover:bg-muted transition-colors ${
                    selectedVehicle === vehicle.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => setSelectedVehicle(vehicle.id)}
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Car className="h-5 w-5 text-primary" />
                    {selectedVehicle === vehicle.id && (
                      <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{vehicle.model}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{vehicle.registration}</span>
                      <span className="text-muted-foreground">•</span>
                      <span>{vehicle.fleet}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline">{vehicle.type}</Badge>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      vehicle.status === 'Available' 
                        ? 'bg-green-100 text-green-800'
                        : vehicle.status === 'In Service'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {vehicle.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No vehicles found matching your criteria
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {selectedVehicle ? `Selected: ${vehicles.find(v => v.id === selectedVehicle)?.model} (${vehicles.find(v => v.id === selectedVehicle)?.registration})` : 'No vehicle selected'}
            </p>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // In a real app, this would open a form to create a new vehicle
                toast({
                  title: "Add new vehicle",
                  description: "This would open a form to add a new vehicle.",
                });
              }}
            >
              Add New Vehicle
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!selectedVehicle}>
            Assign Vehicle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
