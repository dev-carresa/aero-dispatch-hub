
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SettingsHeader = () => {
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon">
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage application settings and preferences
        </p>
      </div>
    </div>
  );
};
