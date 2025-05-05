
import React from "react";
import { Label } from "@/components/ui/label";
import { Theme } from "@/components/theme/ThemeProvider";

interface ThemeSelectorProps {
  selectedTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  disabled?: boolean;
}

export function ThemeSelector({ selectedTheme, onThemeChange, disabled = false }: ThemeSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-1">
      <div className="flex items-center space-x-2">
        <input 
          type="radio" 
          id="light-mode" 
          name="color-mode" 
          className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
          checked={selectedTheme === "light"}
          onChange={() => onThemeChange("light")}
          disabled={disabled}
        />
        <Label htmlFor="light-mode">Light</Label>
      </div>
      <div className="flex items-center space-x-2">
        <input 
          type="radio" 
          id="dark-mode" 
          name="color-mode" 
          className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
          checked={selectedTheme === "dark"} 
          onChange={() => onThemeChange("dark")}
          disabled={disabled}
        />
        <Label htmlFor="dark-mode">Dark</Label>
      </div>
      <div className="flex items-center space-x-2">
        <input 
          type="radio" 
          id="system-mode" 
          name="color-mode" 
          className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
          checked={selectedTheme === "system"}
          onChange={() => onThemeChange("system")}
          disabled={disabled}
        />
        <Label htmlFor="system-mode">System</Label>
      </div>
    </div>
  );
}
