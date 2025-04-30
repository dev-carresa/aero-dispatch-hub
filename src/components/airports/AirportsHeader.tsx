
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface AirportsHeaderProps {
  airportCount: number;
  totalMeetingPoints: number;
}

export function AirportsHeader({ airportCount, totalMeetingPoints }: AirportsHeaderProps) {
  return (
    <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Airports</h1>
        <p className="text-muted-foreground">
          Manage all {airportCount} airports and {totalMeetingPoints} meeting points
        </p>
      </div>
      <div className="flex space-x-2">
        <Link to="/airports/meeting-points/new">
          <Button className="shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Meeting Point
          </Button>
        </Link>
      </div>
    </div>
  );
}
