
import { Button } from "@/components/ui/button";

interface BookingFormActionsProps {
  onNext: () => void;
  onCancel: () => void;
}

export function BookingFormActions({ onNext, onCancel }: BookingFormActionsProps) {
  return (
    <div className="flex justify-between">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button onClick={onNext}>
        Next
      </Button>
    </div>
  );
}
