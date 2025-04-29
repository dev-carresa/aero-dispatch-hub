
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookingStatus } from "../types/booking";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ChangeStatusDialogProps {
  bookingId: string;
  currentStatus: BookingStatus;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (newStatus: BookingStatus) => void;
}

export function ChangeStatusDialog({
  bookingId,
  currentStatus,
  open,
  onOpenChange,
  onStatusChange,
}: ChangeStatusDialogProps) {
  const [status, setStatus] = useState<BookingStatus>(currentStatus);

  const handleSubmit = () => {
    onStatusChange(status);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Booking Status - #{bookingId}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup
            value={status}
            onValueChange={(value) => setStatus(value as BookingStatus)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="confirmed" id="confirmed" />
              <Label htmlFor="confirmed" className="font-normal cursor-pointer">
                <span className="status-badge bg-green-100 text-green-800 border-green-200 py-0.5 px-2 rounded-md text-xs">
                  Confirmed
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pending" id="pending" />
              <Label htmlFor="pending" className="font-normal cursor-pointer">
                <span className="status-badge bg-yellow-100 text-yellow-800 border-yellow-200 py-0.5 px-2 rounded-md text-xs">
                  Pending
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="completed" id="completed" />
              <Label htmlFor="completed" className="font-normal cursor-pointer">
                <span className="status-badge bg-blue-100 text-blue-800 border-blue-200 py-0.5 px-2 rounded-md text-xs">
                  Completed
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cancelled" id="cancelled" />
              <Label htmlFor="cancelled" className="font-normal cursor-pointer">
                <span className="status-badge bg-red-100 text-red-800 border-red-200 py-0.5 px-2 rounded-md text-xs">
                  Cancelled
                </span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
