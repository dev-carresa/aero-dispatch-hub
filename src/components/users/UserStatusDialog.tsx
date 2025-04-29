
import { User } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface UserStatusDialogProps {
  userToDeactivate: User | null;
  setUserToDeactivate: (user: User | null) => void;
  toggleUserStatus: (user: User, newStatus?: string) => void;
}

export const UserStatusDialog = ({
  userToDeactivate,
  setUserToDeactivate,
  toggleUserStatus,
}: UserStatusDialogProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string>(
    userToDeactivate?.status === "active" ? "inactive" : "active"
  );
  
  const isDriver = userToDeactivate?.role === "Driver";
  
  const handleStatusChange = () => {
    if (userToDeactivate) {
      toggleUserStatus(userToDeactivate, selectedStatus);
    }
  };

  return (
    <Dialog open={!!userToDeactivate} onOpenChange={(open) => !open && setUserToDeactivate(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isDriver ? 'Update Driver Availability' : (userToDeactivate?.status === 'active' ? 'Deactivate User' : 'Activate User')}
          </DialogTitle>
          <DialogDescription>
            {isDriver
              ? `Update ${userToDeactivate?.name}'s availability status.`
              : (userToDeactivate?.status === 'active'
                ? `Are you sure you want to deactivate ${userToDeactivate?.name}? They will no longer be able to access the system.`
                : `Are you sure you want to activate ${userToDeactivate?.name}? They will regain access to the system.`)}
          </DialogDescription>
        </DialogHeader>
        
        {isDriver && (
          <div className="py-4">
            <Select 
              value={userToDeactivate?.driverAvailability || "available"} 
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="on_break">On Break</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setUserToDeactivate(null)}>
            Cancel
          </Button>
          <Button 
            variant={isDriver ? "default" : (userToDeactivate?.status === 'active' ? "destructive" : "default")}
            onClick={handleStatusChange}
          >
            {isDriver 
              ? 'Update Status' 
              : (userToDeactivate?.status === 'active' ? 'Deactivate' : 'Activate')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
