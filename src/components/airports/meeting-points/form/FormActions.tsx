
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isEditing: boolean;
  isLoading: boolean;
}

export function FormActions({ isEditing, isLoading }: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-2">
      <Button type="button" variant="outline">
        Cancel
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : isEditing ? "Update" : "Create"} Meeting Point
      </Button>
    </div>
  );
}
