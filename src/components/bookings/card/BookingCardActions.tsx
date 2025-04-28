
import {
  AlertTriangle,
  Copy,
  FileText,
  MapPin,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface BookingCardActionsProps {
  id: string;
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

export function BookingCardActions({
  id,
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
}: BookingCardActionsProps) {
  return (
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link to={`/bookings/${id}`}>View Details</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link to={`/bookings/${id}/edit`}>Edit Booking</Link>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onAssignDriver}>
        Assign Driver
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onAssignFleet}>
        Assign Fleet
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onAssignVehicle}>
        Assign Vehicle
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onDuplicate}>
        <Copy className="h-4 w-4 mr-2" />
        Duplicate Booking
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onCreateInvoice}>
        <FileText className="h-4 w-4 mr-2" />
        Create Invoice
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onViewTracking}>
        <MapPin className="h-4 w-4 mr-2" />
        View Tracking History
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onViewPayment}>
        <FileText className="h-4 w-4 mr-2" />
        View Payment History
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onViewMeetingBoard}>
        <User className="h-4 w-4 mr-2" />
        Meeting Board
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem 
        onClick={onCancel} 
        className="text-red-500"
      >
        <AlertTriangle className="h-4 w-4 mr-2" />
        Cancel Booking
      </DropdownMenuItem>
      <DropdownMenuItem 
        onClick={onDelete} 
        className="text-red-700"
      >
        <AlertTriangle className="h-4 w-4 mr-2" />
        Delete Booking
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
