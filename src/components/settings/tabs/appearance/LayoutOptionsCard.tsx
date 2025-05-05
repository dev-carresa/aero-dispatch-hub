
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SettingToggle } from "./SettingToggle";

interface LayoutOptionsCardProps {
  layoutSettings: {
    fixedHeader: boolean;
    compactSidebar: boolean;
    animations: boolean;
    cardShadows: boolean;
  };
  isLoading: boolean;
  onSettingChange: (setting: string, value: boolean) => void;
  onSave: () => void;
}

export function LayoutOptionsCard({
  layoutSettings,
  isLoading,
  onSettingChange,
  onSave
}: LayoutOptionsCardProps) {
  return (
    <Card className="hover-scale shadow-sm card-gradient">
      <CardHeader>
        <CardTitle>Layout Options</CardTitle>
        <CardDescription>Customize the layout of your dashboard.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <SettingToggle
          id="fixedHeader"
          title="Fixed Header"
          description="Keep the header visible while scrolling."
          checked={layoutSettings.fixedHeader}
          onCheckedChange={(checked) => onSettingChange("fixedHeader", checked)}
          disabled={isLoading}
        />
        
        <SettingToggle
          id="compactSidebar"
          title="Compact Sidebar"
          description="Use icons-only sidebar by default."
          checked={layoutSettings.compactSidebar}
          onCheckedChange={(checked) => onSettingChange("compactSidebar", checked)}
          disabled={isLoading}
        />
        
        <SettingToggle
          id="animations"
          title="Interface Animations"
          description="Enable animations throughout the interface."
          checked={layoutSettings.animations}
          onCheckedChange={(checked) => onSettingChange("animations", checked)}
          disabled={isLoading}
        />
        
        <SettingToggle
          id="cardShadows"
          title="Card Shadows"
          description="Enable shadows on cards for more depth."
          checked={layoutSettings.cardShadows}
          onCheckedChange={(checked) => onSettingChange("cardShadows", checked)}
          disabled={isLoading}
        />
        
        <Button 
          className="w-full btn-themed" 
          onClick={onSave}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Layout Options"}
        </Button>
      </CardContent>
    </Card>
  );
}
