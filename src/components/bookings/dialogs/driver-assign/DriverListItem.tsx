
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Driver {
  id: string;
  name: string;
  availability: string;
  phone: string;
  avatar: string;
}

interface DriverListItemProps {
  driver: Driver;
  isSelected: boolean;
  onSelect: (driverId: string) => void;
}

export function DriverListItem({ driver, isSelected, onSelect }: DriverListItemProps) {
  return (
    <div 
      key={driver.id}
      className={`flex items-center gap-3 p-3 border-b last:border-0 cursor-pointer hover:bg-muted transition-colors ${
        isSelected ? 'bg-muted' : ''
      }`}
      onClick={() => onSelect(driver.id)}
    >
      <Avatar>
        <AvatarImage src={driver.avatar} />
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-medium">{driver.name}</p>
        <p className="text-xs text-muted-foreground">{driver.phone}</p>
      </div>
      <div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          driver.availability === 'Available' 
            ? 'bg-green-100 text-green-800'
            : driver.availability === 'Busy'
            ? 'bg-orange-100 text-orange-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {driver.availability}
        </span>
      </div>
    </div>
  );
}
