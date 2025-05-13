
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export function BookingFilters() {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex-1 sm:max-w-[300px]">
        <Input placeholder="Search by name, reference..." />
      </div>
      
      <div className="flex gap-2">
        <Select defaultValue="all-statuses">
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-statuses">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        
        <Select defaultValue="all-sources">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-sources">All Sources</SelectItem>
            <SelectItem value="booking.com">Booking.com</SelectItem>
            <SelectItem value="expedia">Expedia</SelectItem>
            <SelectItem value="airbnb">Airbnb</SelectItem>
            <SelectItem value="direct">Direct</SelectItem>
          </SelectContent>
        </Select>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex gap-2">
              <Calendar className="h-4 w-4" />
              <span>Date</span>
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                +1
              </Badge>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Date range</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Start</span>
                    <Input placeholder="MM/DD/YYYY" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">End</span>
                    <Input placeholder="MM/DD/YYYY" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button size="sm">Apply</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button variant="outline">Reset</Button>
      </div>
    </div>
  );
}
