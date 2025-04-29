
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { DriverListItem, Driver } from "./DriverListItem";

interface DriverSearchListProps {
  drivers: Driver[];
  selectedDriverId: string;
  onSelectDriver: (driverId: string) => void;
}

export function DriverSearchList({ drivers, selectedDriverId, onSelectDriver }: DriverSearchListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDrivers = drivers.filter(driver => 
    driver.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="relative">
        <Input 
          placeholder="Search drivers..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="border rounded-md max-h-[300px] overflow-y-auto">
        {filteredDrivers.length > 0 ? (
          filteredDrivers.map((driver) => (
            <DriverListItem 
              key={driver.id}
              driver={driver} 
              isSelected={selectedDriverId === driver.id}
              onSelect={onSelectDriver}
            />
          ))
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No drivers found matching "{searchQuery}"
          </div>
        )}
      </div>
    </>
  );
}
