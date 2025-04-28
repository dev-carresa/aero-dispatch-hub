
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, ChevronDown, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function BookingFilters() {
  const [date, setDate] = useState<Date>();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-950 p-4 rounded-lg border">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-start">
          <div className="relative w-full sm:w-auto flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by reference, customer or booking details..." 
              className="pl-9 w-full" 
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  Filters
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 sm:w-96 p-4" align="end">
                <div className="space-y-4">
                  <h3 className="font-medium">Filter Bookings</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <Select onValueChange={(value) => addFilter(`Status: ${value}`)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Driver</label>
                      <Select onValueChange={(value) => addFilter(`Driver: ${value}`)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Driver" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any Driver</SelectItem>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          <SelectItem value="michael">Michael Rodriguez</SelectItem>
                          <SelectItem value="david">David Brown</SelectItem>
                          <SelectItem value="sarah">Sarah Thompson</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Fleet</label>
                      <Select onValueChange={(value) => addFilter(`Fleet: ${value}`)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Fleet" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any Fleet</SelectItem>
                          <SelectItem value="premium">Premium Fleet</SelectItem>
                          <SelectItem value="standard">Standard Fleet</SelectItem>
                          <SelectItem value="economy">Economy Fleet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Source</label>
                      <Select onValueChange={(value) => addFilter(`Source: ${value}`)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any Source</SelectItem>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="app">Mobile App</SelectItem>
                          <SelectItem value="phone">Phone Call</SelectItem>
                          <SelectItem value="partner">Partner Agency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Vehicle Type</label>
                      <Select onValueChange={(value) => addFilter(`Vehicle: ${value}`)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Vehicle Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any Type</SelectItem>
                          <SelectItem value="sedan">Sedan</SelectItem>
                          <SelectItem value="suv">SUV</SelectItem>
                          <SelectItem value="van">Van</SelectItem>
                          <SelectItem value="luxury">Luxury</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Service Type</label>
                      <Select onValueChange={(value) => addFilter(`Service: ${value}`)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Service Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any Service</SelectItem>
                          <SelectItem value="arrival">Arrival</SelectItem>
                          <SelectItem value="departure">Departure</SelectItem>
                          <SelectItem value="transfer">Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Payment Method</label>
                      <Select onValueChange={(value) => addFilter(`Payment: ${value}`)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Payment Method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any Method</SelectItem>
                          <SelectItem value="credit">Credit Card</SelectItem>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Country Code</label>
                      <Select onValueChange={(value) => addFilter(`Country: ${value}`)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any Country</SelectItem>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                          <SelectItem value="de">Germany</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={date}
                            onSelect={(date) => {
                              setDate(date);
                              if (date) addFilter(`Date: ${format(date, "PPP")}`);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveFilters([])}
                    >
                      Clear Filters
                    </Button>
                    <Button>Apply Filters</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {activeFilters.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {activeFilters.map(filter => (
              <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                {filter}
                <button onClick={() => removeFilter(filter)} className="ml-1 hover:text-red-500">
                  ×
                </button>
              </Badge>
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setActiveFilters([])} 
              className="text-xs h-6"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
