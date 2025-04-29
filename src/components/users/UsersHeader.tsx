
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface UsersHeaderProps {
  currentFilter?: string;
}

export const UsersHeader = ({ currentFilter = "all" }: UsersHeaderProps) => {
  const isDriverView = currentFilter === "Driver";
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {isDriverView ? "Driver Management" : "Users"}
        </h2>
        <p className="text-muted-foreground">
          {isDriverView 
            ? "Manage drivers, their details and availability" 
            : "Manage users and their permissions"}
        </p>
      </div>
      <div className="self-end sm:self-auto">
        <Link to="/users/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            {isDriverView ? "Add New Driver" : "Add New User"}
          </Button>
        </Link>
      </div>
    </div>
  );
};
