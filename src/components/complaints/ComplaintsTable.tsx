
import { useState } from "react";
import { Complaint } from "@/types/complaint";
import { 
  Table,
  TableHeader,
  TableHead,
  TableBody
} from "@/components/ui/table";
import { ComplaintsTableRow } from "./ComplaintsTableRow";
import { DeleteComplaintDialog } from "./DeleteComplaintDialog";
import { toast } from "sonner";

interface ComplaintsTableProps {
  complaints: Complaint[];
}

export const ComplaintsTable = ({ complaints }: ComplaintsTableProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState<string | null>(null);
  const [currentComplaints, setCurrentComplaints] = useState<Complaint[]>(complaints);

  const handleDelete = (id: string) => {
    setComplaintToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (complaintToDelete) {
      // In a real app, we would call an API to delete the complaint
      setCurrentComplaints(currentComplaints.filter(c => c.id !== complaintToDelete));
      toast.success("Complaint deleted successfully");
      setDeleteDialogOpen(false);
      setComplaintToDelete(null);
    }
  };

  const complaintToDeleteRef = currentComplaints.find(c => c.id === complaintToDelete)?.reference;

  return (
    <>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <tr>
              <TableHead>Reference</TableHead>
              <TableHead>Booking Ref.</TableHead>
              <TableHead>Fleet</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {currentComplaints.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-muted-foreground">
                  No complaints found
                </td>
              </tr>
            ) : (
              currentComplaints.map(complaint => (
                <ComplaintsTableRow 
                  key={complaint.id}
                  complaint={complaint}
                  onDelete={handleDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DeleteComplaintDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        complaintRef={complaintToDeleteRef}
      />
    </>
  );
};
