
import { Badge } from "@/components/ui/badge";
import { CardHeader } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { BookingStatus } from "../types/booking";
import { BookingCardActions } from "./BookingCardActions";

interface BookingCardHeaderProps {
  id: string;
  reference?: string;
  status: BookingStatus;
  serviceType?: string;
  onAssignDriver: () => void;
  onAssignFleet: () => void;
  onAssignVehicle: () => void;
  onDuplicate: () => void;
  onCreateInvoice: () => void;
  onViewTracking: () => void;
  onViewPayment: () => void;
  onViewMeetingBoard: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export function BookingCardHeader({ 
  id, 
  reference, 
  status, 
  serviceType,
  onAssignDriver,
  onAssignFleet,
  onAssignVehicle,
  onDuplicate,
  onCreateInvoice,
  onViewTracking,
  onViewPayment,
  onViewMeetingBoard,
  onCancel,
  onDelete
}: BookingCardHeaderProps) {
  return (
    <CardHeader className="px-4 py-3 pb-0 flex flex-row items-center justify-between space-y-0">
      <div className="flex flex-wrap items-center gap-2">
        <Link to={`/bookings/${id}`} className="font-bold hover:text-primary">
          {reference || `#${id}`}
        </Link>
        <Badge className={`status-badge ${
          status === 'confirmed' 
            ? 'bg-green-100 text-green-800 border-green-200' 
            : status === 'completed'
            ? 'bg-blue-100 text-blue-800 border-blue-200'
            : status === 'cancelled'
            ? 'bg-red-100 text-red-800 border-red-200'
            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
        {serviceType && (
          <Badge variant="outline" className="text-xs">
            {serviceType}
          </Badge>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <BookingCardActions 
          id={id}
          onAssignDriver={onAssignDriver}
          onAssignFleet={onAssignFleet}
          onAssignVehicle={onAssignVehicle}
          onDuplicate={onDuplicate}
          onCreateInvoice={onCreateInvoice}
          onViewTracking={onViewTracking}
          onViewPayment={onViewPayment}
          onViewMeetingBoard={onViewMeetingBoard}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      </DropdownMenu>
    </CardHeader>
  );
}
