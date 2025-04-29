
import { Filter, Plus, RefreshCcw, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export function BookingsHeader() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
        <p className="text-muted-foreground">
          Manage your transportation bookings
        </p>
      </div>
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline" size="sm">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <FileText className="h-4 w-4 mr-2" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="h-4 w-4 mr-2" />
              Export as Excel
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="h-4 w-4 mr-2" />
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link to="/bookings/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </Button>
        </Link>
      </div>
    </div>
  );
}
