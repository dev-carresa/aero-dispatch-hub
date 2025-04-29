
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2 } from "lucide-react";
import { sampleDriverComments } from "@/data/sampleDriverComments";
import { DriverComment } from "@/types/driverComment";
import { format } from "date-fns";
import { DeleteDriverCommentDialog } from "@/components/driver-comments/DeleteDriverCommentDialog";
import { toast } from "sonner";

const DriverCommentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [comment, setComment] = useState<DriverComment | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call
    setLoading(true);
    setTimeout(() => {
      const foundComment = sampleDriverComments.find(c => c.id === id);
      if (foundComment) {
        // Mark as read
        setComment({
          ...foundComment,
          status: "read"
        });
      } else {
        toast.error("Comment not found");
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const handleDelete = () => {
    // In a real app, this would be an API call
    toast.success("Comment deleted successfully");
    navigate("/driver-comments");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!comment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Comment not found</h2>
        <p className="text-muted-foreground">The driver comment you are looking for does not exist or has been deleted.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        className="gap-1" 
        onClick={() => navigate("/driver-comments")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Driver Comments
      </Button>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Driver Comment</CardTitle>
            <Badge 
              variant="outline" 
              className={comment.status === "unread" ? "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200" : ""}
            >
              {comment.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Driver Name</p>
              <p className="font-medium">{comment.driverName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Date Submitted</p>
              <p>{format(new Date(comment.createdAt), "MMMM d, yyyy 'at' h:mm a")}</p>
            </div>
            {comment.bookingReference && (
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground mb-1">Related Booking</p>
                <p className="text-primary font-medium">{comment.bookingReference}</p>
              </div>
            )}
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Comment</p>
            <div className="bg-muted/30 p-4 rounded-md border whitespace-pre-wrap">
              {comment.comment}
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            variant="destructive" 
            className="gap-1 ml-auto" 
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete Comment
          </Button>
        </CardFooter>
      </Card>
      
      <DeleteDriverCommentDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default DriverCommentDetails;
