
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Complaint } from "@/types/complaint";
import { ComplaintStatusBadge } from "./ComplaintsTableRow";
import { ArrowLeft, Edit, MoreVertical, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { DeleteComplaintDialog } from "./DeleteComplaintDialog";
import { toast } from "sonner";

interface ComplaintDetailsHeaderProps {
  complaint: Complaint;
}

export const ComplaintDetailsHeader = ({ complaint }: ComplaintDetailsHeaderProps) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const handleDelete = () => {
    // In a real app, we would call an API to delete the complaint
    toast.success("Complaint deleted successfully");
    navigate("/complaints");
  };
  
  return (
    <div>
      <Button 
        variant="outline" 
        className="mb-6 gap-1" 
        onClick={() => navigate("/complaints")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Complaints
      </Button>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-semibold">
              Complaint {complaint.reference}
            </h1>
            <ComplaintStatusBadge status={complaint.status} />
          </div>
          
          <div className="flex flex-wrap text-sm text-muted-foreground gap-x-6 gap-y-1">
            <p>Booking: <span className="font-medium">{complaint.bookingReference}</span></p>
            <p>Fleet: <span className="font-medium">{complaint.fleetName}</span></p>
            <p>Created: <span className="font-medium">{format(new Date(complaint.createdAt), "MMM d, yyyy")}</span></p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="gap-1" 
            onClick={() => navigate(`/complaints/${complaint.id}/edit`)}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                className="text-destructive" 
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Complaint
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <DeleteComplaintDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        complaintRef={complaint.reference}
      />
    </div>
  );
};
