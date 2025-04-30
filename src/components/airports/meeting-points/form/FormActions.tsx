
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FormActionsProps {
  isEditing: boolean;
  isLoading: boolean;
}

export function FormActions({ isEditing, isLoading }: FormActionsProps) {
  const navigate = useNavigate();
  
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="flex justify-end space-x-2">
      <Button type="button" variant="outline" onClick={handleCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : isEditing ? "Update" : "Create"} {isEditing ? "Meeting Point" : "Meeting Point"}
      </Button>
    </div>
  );
}
