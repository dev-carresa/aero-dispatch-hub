
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface VehicleFormActionsProps {
  isSubmitting: boolean;
  isEditMode: boolean;
}

export function VehicleFormActions({ isSubmitting, isEditMode }: VehicleFormActionsProps) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end gap-3">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => navigate("/vehicles")}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : isEditMode ? "Update Vehicle" : "Create Vehicle"}
      </Button>
    </div>
  );
}
