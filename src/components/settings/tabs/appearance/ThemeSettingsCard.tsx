
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ThemeSelector } from "./ThemeSelector";
import { ColorPicker } from "./ColorPicker";
import { FontSizeSelector } from "./FontSizeSelector";
import { Theme } from "@/components/theme/ThemeProvider";
import { AccentColor, FontSize } from "@/components/theme/ExtendedThemeProvider";

interface ThemeSettingsCardProps {
  themeSettings: {
    colorMode: Theme;
    accentColor: AccentColor;
    fontSize: FontSize;
  };
  isLoading: boolean;
  onSettingChange: (setting: string, value: string) => void;
  onSave: () => void;
}

export function ThemeSettingsCard({
  themeSettings,
  isLoading,
  onSettingChange,
  onSave
}: ThemeSettingsCardProps) {
  return (
    <Card className="hover-scale shadow-sm card-gradient">
      <CardHeader>
        <CardTitle>Theme Settings</CardTitle>
        <CardDescription>Customize the appearance of your dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Color Mode</Label>
            <ThemeSelector
              selectedTheme={themeSettings.colorMode as Theme}
              onThemeChange={(value) => onSettingChange("colorMode", value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label>Accent Color</Label>
            <ColorPicker
              selectedColor={themeSettings.accentColor}
              onColorChange={(value) => onSettingChange("accentColor", value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label>Font Size</Label>
            <FontSizeSelector
              selectedSize={themeSettings.fontSize}
              onSizeChange={(value) => onSettingChange("fontSize", value)}
              disabled={isLoading}
            />
          </div>
          
          <Button 
            className="w-full btn-themed" 
            onClick={onSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Appearance Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
