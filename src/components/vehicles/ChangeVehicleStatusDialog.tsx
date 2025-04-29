
import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Vehicle, VehicleStatus } from "@/types/vehicle";

interface ChangeVehicleStatusDialogProps {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (vehicle: Vehicle, status: VehicleStatus) => void;
}

export function ChangeVehicleStatusDialog({
  vehicle,
  open,
  onOpenChange,
  onStatusChange,
}: ChangeVehicleStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<VehicleStatus | "">("");

  if (!vehicle) return null;

  const handleChangeStatus = () => {
    if (selectedStatus && vehicle) {
      onStatusChange(vehicle, selectedStatus as VehicleStatus);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) {
        setSelectedStatus("");
      } else {
        setSelectedStatus(vehicle.status);
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Vehicle Status</DialogTitle>
          <DialogDescription>
            Update the status for {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={selectedStatus || vehicle.status}
              onValueChange={(value) => setSelectedStatus(value as VehicleStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleChangeStatus}>
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
