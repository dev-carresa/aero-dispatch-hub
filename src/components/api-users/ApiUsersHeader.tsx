
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface ApiUsersHeaderProps {
  apiUserCount: number;
}

export function ApiUsersHeader({ apiUserCount }: ApiUsersHeaderProps) {
  return (
    <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">API Users</h1>
        <p className="text-muted-foreground">
          Manage {apiUserCount} users with API access or white-label services
        </p>
      </div>
      <div>
        <Link to="/api-users/new">
          <Button className="shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            Add API User
          </Button>
        </Link>
      </div>
    </div>
  );
}
