
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export const UsersHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <p className="text-muted-foreground">
          Manage users and their permissions
        </p>
      </div>
      <div className="self-end sm:self-auto">
        <Link to="/users/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add New User
          </Button>
        </Link>
      </div>
    </div>
  );
};
