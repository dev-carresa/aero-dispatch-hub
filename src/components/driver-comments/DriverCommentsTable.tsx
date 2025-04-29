
import { useState } from "react";
import { DriverComment } from "@/types/driverComment";
import { 
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Eye, Trash2, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { DeleteDriverCommentDialog } from "./DeleteDriverCommentDialog";
import { toast } from "sonner";

interface DriverCommentsTableProps {
  comments: DriverComment[];
}

export const DriverCommentsTable = ({ comments }: DriverCommentsTableProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [currentComments, setCurrentComments] = useState<DriverComment[]>(comments);

  const handleDelete = (id: string) => {
    setCommentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (commentToDelete) {
      // In a real app, we would call an API to delete the comment
      setCurrentComments(currentComments.filter(c => c.id !== commentToDelete));
      toast.success("Comment deleted successfully");
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    }
  };

  return (
    <>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Driver</TableHead>
              <TableHead>Comment Summary</TableHead>
              <TableHead>Booking Ref.</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentComments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No comments found
                </TableCell>
              </TableRow>
            ) : (
              currentComments.map(comment => (
                <TableRow key={comment.id}>
                  <TableCell className="font-medium">{comment.driverName}</TableCell>
                  <TableCell>
                    {comment.comment.length > 60
                      ? `${comment.comment.substring(0, 60)}...`
                      : comment.comment}
                  </TableCell>
                  <TableCell>
                    {comment.bookingReference || "-"}
                  </TableCell>
                  <TableCell>
                    {format(new Date(comment.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={comment.status === "unread" ? "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200" : ""}
                    >
                      {comment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Link to={`/driver-comments/${comment.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View comment">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="More actions">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(comment.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DeleteDriverCommentDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </>
  );
};
