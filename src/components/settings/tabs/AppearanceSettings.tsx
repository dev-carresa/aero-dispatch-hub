
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function AppearanceSettings() {
  const [themeSettings, setThemeSettings] = useState({
    colorMode: "light",
    accentColor: "blue",
    fontSize: "medium"
  });

  const [layoutSettings, setLayoutSettings] = useState({
    fixedHeader: true,
    compactSidebar: false,
    animations: true,
    cardShadows: true
  });

  const handleThemeSettingChange = (setting: string, value: string) => {
    setThemeSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleLayoutSettingChange = (setting: string, value: boolean) => {
    setLayoutSettings(prev => ({ ...prev, [setting]: value }));
  };

  const saveAppearanceSettings = () => {
    toast.success("Appearance settings saved successfully!");
  };

  const saveLayoutOptions = () => {
    toast.success("Layout options saved successfully!");
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="hover-scale shadow-sm card-gradient">
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
          <CardDescription>Customize the appearance of your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Color Mode</Label>
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="light-mode" 
                    name="color-mode" 
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                    checked={themeSettings.colorMode === "light"}
                    onChange={() => handleThemeSettingChange("colorMode", "light")}
                  />
                  <Label htmlFor="light-mode">Light</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="dark-mode" 
                    name="color-mode" 
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                    checked={themeSettings.colorMode === "dark"} 
                    onChange={() => handleThemeSettingChange("colorMode", "dark")}
                  />
                  <Label htmlFor="dark-mode">Dark</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="system-mode" 
                    name="color-mode" 
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                    checked={themeSettings.colorMode === "system"}
                    onChange={() => handleThemeSettingChange("colorMode", "system")} 
                  />
                  <Label htmlFor="system-mode">System</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Accent Color</Label>
              <div className="grid grid-cols-6 gap-2">
                <div 
                  className={`h-8 w-8 rounded-full bg-blue-600 cursor-pointer ${themeSettings.accentColor === 'blue' ? 'ring-2 ring-offset-2 ring-blue-600' : ''}`}
                  onClick={() => handleThemeSettingChange("accentColor", "blue")}
                ></div>
                <div 
                  className={`h-8 w-8 rounded-full bg-purple-600 cursor-pointer ${themeSettings.accentColor === 'purple' ? 'ring-2 ring-offset-2 ring-purple-600' : ''}`}
                  onClick={() => handleThemeSettingChange("accentColor", "purple")}
                ></div>
                <div 
                  className={`h-8 w-8 rounded-full bg-pink-600 cursor-pointer ${themeSettings.accentColor === 'pink' ? 'ring-2 ring-offset-2 ring-pink-600' : ''}`}
                  onClick={() => handleThemeSettingChange("accentColor", "pink")}
                ></div>
                <div 
                  className={`h-8 w-8 rounded-full bg-orange-600 cursor-pointer ${themeSettings.accentColor === 'orange' ? 'ring-2 ring-offset-2 ring-orange-600' : ''}`}
                  onClick={() => handleThemeSettingChange("accentColor", "orange")}
                ></div>
                <div 
                  className={`h-8 w-8 rounded-full bg-green-600 cursor-pointer ${themeSettings.accentColor === 'green' ? 'ring-2 ring-offset-2 ring-green-600' : ''}`}
                  onClick={() => handleThemeSettingChange("accentColor", "green")}
                ></div>
                <div 
                  className={`h-8 w-8 rounded-full bg-gray-600 cursor-pointer ${themeSettings.accentColor === 'gray' ? 'ring-2 ring-offset-2 ring-gray-600' : ''}`}
                  onClick={() => handleThemeSettingChange("accentColor", "gray")}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Font Size</Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="font-small" 
                    name="font-size" 
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                    checked={themeSettings.fontSize === "small"}
                    onChange={() => handleThemeSettingChange("fontSize", "small")}
                  />
                  <Label htmlFor="font-small" className="text-sm">Small</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="font-medium" 
                    name="font-size" 
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                    checked={themeSettings.fontSize === "medium"}
                    onChange={() => handleThemeSettingChange("fontSize", "medium")}
                  />
                  <Label htmlFor="font-medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="font-large" 
                    name="font-size" 
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                    checked={themeSettings.fontSize === "large"}
                    onChange={() => handleThemeSettingChange("fontSize", "large")}
                  />
                  <Label htmlFor="font-large" className="text-lg">Large</Label>
                </div>
              </div>
            </div>
            <Button className="w-full" onClick={saveAppearanceSettings}>Save Appearance Settings</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="hover-scale shadow-sm card-gradient">
        <CardHeader>
          <CardTitle>Layout Options</CardTitle>
          <CardDescription>Customize the layout of your dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="fixedHeader">Fixed Header</Label>
              <p className="text-sm text-muted-foreground">Keep the header visible while scrolling.</p>
            </div>
            <Switch 
              id="fixedHeader" 
              checked={layoutSettings.fixedHeader}
              onCheckedChange={(checked) => handleLayoutSettingChange("fixedHeader", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compactSidebar">Compact Sidebar</Label>
              <p className="text-sm text-muted-foreground">Use icons-only sidebar by default.</p>
            </div>
            <Switch 
              id="compactSidebar"
              checked={layoutSettings.compactSidebar}
              onCheckedChange={(checked) => handleLayoutSettingChange("compactSidebar", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="animations">Interface Animations</Label>
              <p className="text-sm text-muted-foreground">Enable animations throughout the interface.</p>
            </div>
            <Switch 
              id="animations"
              checked={layoutSettings.animations}
              onCheckedChange={(checked) => handleLayoutSettingChange("animations", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="cardShadows">Card Shadows</Label>
              <p className="text-sm text-muted-foreground">Enable shadows on cards for more depth.</p>
            </div>
            <Switch 
              id="cardShadows"
              checked={layoutSettings.cardShadows}
              onCheckedChange={(checked) => handleLayoutSettingChange("cardShadows", checked)}
            />
          </div>
          <Button className="w-full" onClick={saveLayoutOptions}>Save Layout Options</Button>
        </CardContent>
      </Card>
    </div>
  );
}
