
import React from "react";
import { AccentColor } from "@/components/theme/ExtendedThemeProvider";

interface ColorPickerProps {
  selectedColor: AccentColor;
  onColorChange: (color: AccentColor) => void;
  disabled?: boolean;
}

export function ColorPicker({ selectedColor, onColorChange, disabled = false }: ColorPickerProps) {
  const colors: { color: AccentColor; bgClass: string }[] = [
    { color: "blue", bgClass: "bg-blue-600" },
    { color: "purple", bgClass: "bg-purple-600" },
    { color: "pink", bgClass: "bg-pink-600" },
    { color: "orange", bgClass: "bg-orange-600" },
    { color: "green", bgClass: "bg-green-600" },
    { color: "gray", bgClass: "bg-gray-600" },
  ];

  return (
    <div className="grid grid-cols-6 gap-2">
      {colors.map(({ color, bgClass }) => (
        <div
          key={color}
          className={`h-8 w-8 rounded-full ${bgClass} cursor-pointer ${
            selectedColor === color ? `ring-2 ring-offset-2 ring-${bgClass.slice(3)}` : ""
          }`}
          onClick={() => !disabled && onColorChange(color)}
          aria-label={`${color} color option`}
          role="button"
          tabIndex={disabled ? -1 : 0}
        />
      ))}
    </div>
  );
}
