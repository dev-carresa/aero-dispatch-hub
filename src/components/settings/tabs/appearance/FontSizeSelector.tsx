
import React from "react";
import { Label } from "@/components/ui/label";
import { FontSize } from "@/components/theme/ExtendedThemeProvider";

interface FontSizeSelectorProps {
  selectedSize: FontSize;
  onSizeChange: (size: FontSize) => void;
  disabled?: boolean;
}

export function FontSizeSelector({ selectedSize, onSizeChange, disabled = false }: FontSizeSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="flex items-center space-x-2">
        <input
          type="radio"
          id="font-small"
          name="font-size"
          className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
          checked={selectedSize === "small"}
          onChange={() => onSizeChange("small")}
          disabled={disabled}
        />
        <Label htmlFor="font-small" className="text-sm">Small</Label>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="radio"
          id="font-medium"
          name="font-size"
          className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
          checked={selectedSize === "medium"}
          onChange={() => onSizeChange("medium")}
          disabled={disabled}
        />
        <Label htmlFor="font-medium">Medium</Label>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="radio"
          id="font-large"
          name="font-size"
          className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
          checked={selectedSize === "large"}
          onChange={() => onSizeChange("large")}
          disabled={disabled}
        />
        <Label htmlFor="font-large" className="text-lg">Large</Label>
      </div>
    </div>
  );
}
