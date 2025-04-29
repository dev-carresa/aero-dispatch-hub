
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface DriverCommentsHeaderProps {
  title?: string;
  description?: string;
  onRefresh?: () => void;
}

export const DriverCommentsHeader = ({
  title = "Driver Comments",
  description = "View and manage comments submitted by drivers",
  onRefresh
}: DriverCommentsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      {onRefresh && (
        <Button onClick={onRefresh} variant="outline" size="sm" className="gap-1">
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </Button>
      )}
    </div>
  );
};
