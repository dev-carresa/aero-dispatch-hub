
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export type SortOption = "date-asc" | "date-desc" | "price-asc" | "price-desc" | "status";

interface BookingSortProps {
  sortOption: SortOption;
  setSortOption: (value: SortOption) => void;
  bookingsCount: number;
}

export function BookingSort({ sortOption, setSortOption, bookingsCount }: BookingSortProps) {
  // Helper function to get sort icon and label
  const getSortDisplay = () => {
    if (sortOption.includes('asc')) {
      return (
        <>
          <ArrowUp className="h-4 w-4" />
          Sort: {sortOption.split('-')[0].charAt(0).toUpperCase() + sortOption.split('-')[0].slice(1)} (Asc)
        </>
      );
    } else if (sortOption.includes('desc')) {
      return (
        <>
          <ArrowDown className="h-4 w-4" />
          Sort: {sortOption.split('-')[0].charAt(0).toUpperCase() + sortOption.split('-')[0].slice(1)} (Desc)
        </>
      );
    } else {
      return (
        <>
          <ArrowDown className="h-4 w-4" />
          Sort: Status
        </>
      );
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Showing <strong>{bookingsCount}</strong> bookings
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            {getSortDisplay()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuRadioGroup value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
            <DropdownMenuRadioItem value="date-desc">Date (Newest first)</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="date-asc">Date (Oldest first)</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="price-desc">Price (Highest first)</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="price-asc">Price (Lowest first)</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="status">Status</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
