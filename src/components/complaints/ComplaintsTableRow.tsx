import { Complaint } from "@/types/complaint";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { MessageSquare, Trash2, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";

interface ComplaintsTableRowProps {
  complaint: Complaint;
  onDelete: (id: string) => void;
}

export const ComplaintStatusBadge = ({ status }: { status: Complaint['status'] }) => {
  const badgeProps = {
    new: { variant: "default" as const, className: "bg-blue-500 hover:bg-blue-600" },
    in_progress: { variant: "default" as const, className: "bg-yellow-500 hover:bg-yellow-600" },
    resolved: { variant: "default" as const, className: "bg-green-500 hover:bg-green-600" },
    closed: { variant: "default" as const, className: "bg-gray-500 hover:bg-gray-600" }
  };

  const statusLabels = {
    new: "New",
    in_progress: "In Progress",
    resolved: "Resolved",
    closed: "Closed"
  };

  return (
    <Badge {...badgeProps[status]}>
      {statusLabels[status]}
    </Badge>
  );
};

export const ComplaintsTableRow = ({ complaint, onDelete }: ComplaintsTableRowProps) => {
  return (
    <tr className="border-b">
      <td className="px-4 py-3 text-sm font-medium">
        <Link to={`/complaints/${complaint.id}`} className="hover:underline text-primary">
          {complaint.reference}
        </Link>
      </td>
      <td className="px-4 py-3 text-sm">{complaint.bookingReference}</td>
      <td className="px-4 py-3 text-sm">{complaint.fleetName}</td>
      <td className="px-4 py-3 text-sm">
        <ComplaintStatusBadge status={complaint.status} />
      </td>
      <td className="px-4 py-3 text-sm">
        {format(new Date(complaint.createdAt), "MMM d, yyyy")}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end">
          <Link to={`/complaints/${complaint.id}`}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View or reply">
              <MessageSquare className="h-4 w-4" />
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="More actions">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete(complaint.id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
};
