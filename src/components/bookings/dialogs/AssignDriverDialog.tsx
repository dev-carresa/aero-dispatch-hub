
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface AssignDriverDialogProps {
  bookingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Sample driver data
const drivers = [
  { id: "1", name: "Michael Rodriguez", availability: "Available", phone: "+1 (555) 987-6543", avatar: "" },
  { id: "2", name: "Sarah Thompson", availability: "Busy", phone: "+1 (555) 234-5678", avatar: "" },
  { id: "3", name: "David Brown", availability: "Available", phone: "+1 (555) 345-6789", avatar: "" },
  { id: "4", name: "James Wilson", availability: "Available", phone: "+1 (555) 456-7890", avatar: "" },
  { id: "5", name: "Emily Davis", availability: "Off Duty", phone: "+1 (555) 567-8901", avatar: "" },
];

export function AssignDriverDialog({ bookingId, open, onOpenChange }: AssignDriverDialogProps) {
  const [selectedDriver, setSelectedDriver] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const filteredDrivers = drivers.filter(driver => 
    driver.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssign = () => {
    if (!selectedDriver) {
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
      description: `Driver has been successfully assigned to booking #${bookingId}.`,
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
        
        <div className="space-y-4 py-3">
          <div className="relative">
            <Input 
              placeholder="Search drivers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="border rounded-md max-h-[300px] overflow-y-auto">
            {filteredDrivers.length > 0 ? (
              filteredDrivers.map((driver) => (
                <div 
                  key={driver.id}
                  className={`flex items-center gap-3 p-3 border-b last:border-0 cursor-pointer hover:bg-muted transition-colors ${
                    selectedDriver === driver.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => setSelectedDriver(driver.id)}
                >
                  <Avatar>
                    <AvatarImage src={driver.avatar} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{driver.name}</p>
                    <p className="text-xs text-muted-foreground">{driver.phone}</p>
                  </div>
                  <div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      driver.availability === 'Available' 
                        ? 'bg-green-100 text-green-800'
                        : driver.availability === 'Busy'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {driver.availability}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No drivers found matching "{searchQuery}"
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {selectedDriver ? `Selected driver: ${drivers.find(d => d.id === selectedDriver)?.name}` : 'No driver selected'}
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
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign}>
            Assign Driver
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
