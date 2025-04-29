
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

interface ComplaintsHeaderProps {
  title?: string;
  description?: string;
}

export const ComplaintsHeader = ({
  title = "Complaints",
  description = "Manage and respond to complaints from customers and fleets"
}: ComplaintsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Link to="/complaints/new">
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          New Complaint
        </Button>
      </Link>
    </div>
  );
};
