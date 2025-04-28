
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const AppearanceTab = () => {
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
                    defaultChecked
                  />
                  <Label htmlFor="light-mode">Light</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="dark-mode" 
                    name="color-mode" 
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" 
                  />
                  <Label htmlFor="dark-mode">Dark</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="system-mode" 
                    name="color-mode" 
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" 
                  />
                  <Label htmlFor="system-mode">System</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Accent Color</Label>
              <div className="grid grid-cols-6 gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-600 cursor-pointer ring-2 ring-offset-2 ring-blue-600"></div>
                <div className="h-8 w-8 rounded-full bg-purple-600 cursor-pointer"></div>
                <div className="h-8 w-8 rounded-full bg-pink-600 cursor-pointer"></div>
                <div className="h-8 w-8 rounded-full bg-orange-600 cursor-pointer"></div>
                <div className="h-8 w-8 rounded-full bg-green-600 cursor-pointer"></div>
                <div className="h-8 w-8 rounded-full bg-gray-600 cursor-pointer"></div>
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
                  />
                  <Label htmlFor="font-small" className="text-sm">Small</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="font-medium" 
                    name="font-size" 
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                    defaultChecked
                  />
                  <Label htmlFor="font-medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="font-large" 
                    name="font-size" 
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" 
                  />
                  <Label htmlFor="font-large" className="text-lg">Large</Label>
                </div>
              </div>
            </div>
            <Button className="w-full">Save Appearance Settings</Button>
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
            <Switch id="fixedHeader" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compactSidebar">Compact Sidebar</Label>
              <p className="text-sm text-muted-foreground">Use icons-only sidebar by default.</p>
            </div>
            <Switch id="compactSidebar" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="animations">Interface Animations</Label>
              <p className="text-sm text-muted-foreground">Enable animations throughout the interface.</p>
            </div>
            <Switch id="animations" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="cardShadows">Card Shadows</Label>
              <p className="text-sm text-muted-foreground">Enable shadows on cards for more depth.</p>
            </div>
            <Switch id="cardShadows" defaultChecked />
          </div>
          <Button className="w-full">Save Layout Options</Button>
        </CardContent>
      </Card>
    </div>
  );
};
