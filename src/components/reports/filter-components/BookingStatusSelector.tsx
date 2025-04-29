
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface BookingStatusOption {
  id: string;
  label: string;
}

interface BookingStatusSelectorProps {
  selectedStatuses: string[] | undefined;
  onStatusChange: (statusId: string, checked: boolean) => void;
}

export function BookingStatusSelector({
  selectedStatuses,
  onStatusChange
}: BookingStatusSelectorProps) {
  const bookingStatusOptions: BookingStatusOption[] = [
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
    { id: "no-show", label: "No-show" },
    { id: "active", label: "Active" },
    { id: "pending", label: "Pending" },
  ];

  return (
    <div>
      <Label className="text-base">Booking Status</Label>
      <div className="grid grid-cols-2 gap-3 mt-2 md:grid-cols-5">
        {bookingStatusOptions.map((status) => (
          <div key={status.id} className="flex items-center space-x-2">
            <Checkbox 
              id={`status-${status.id}`} 
              checked={selectedStatuses?.includes(status.id)}
              onCheckedChange={(checked) => 
                onStatusChange(status.id, checked === true)
              }
            />
            <label
              htmlFor={`status-${status.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {status.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
