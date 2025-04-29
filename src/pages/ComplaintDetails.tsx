
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ComplaintDetailsHeader } from "@/components/complaints/ComplaintDetailsHeader";
import { MessageBubble } from "@/components/complaints/conversation/MessageBubble";
import { ReplyForm } from "@/components/complaints/conversation/ReplyForm";
import { sampleComplaints } from "@/data/sampleComplaints";
import { Complaint, ComplaintReply } from "@/types/complaint";
import { toast } from "sonner";

const ComplaintDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would be an API call
    setLoading(true);
    setTimeout(() => {
      const foundComplaint = sampleComplaints.find(c => c.id === id);
      if (foundComplaint) {
        setComplaint(foundComplaint);
      } else {
        toast.error("Complaint not found");
      }
      setLoading(false);
    }, 500);
  }, [id]);
  
  const handleSendReply = (message: string, attachments: File[]) => {
    if (complaint) {
      const newReply: ComplaintReply = {
        id: `R-${Date.now()}`,
        complaintId: complaint.id,
        senderId: 4, // Admin ID
        senderName: "System Admin",
        senderRole: "Admin",
        message,
        timestamp: new Date().toISOString(),
        attachments: attachments.map((file, index) => ({
          id: `A-${Date.now()}-${index}`,
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
          createdAt: new Date().toISOString()
        }))
      };
      
      const updatedComplaint = {
        ...complaint,
        replies: [...complaint.replies, newReply],
        updatedAt: new Date().toISOString(),
        status: complaint.status === "new" ? "in_progress" as const : complaint.status
      };
      
      setComplaint(updatedComplaint);
      toast.success("Reply sent successfully");
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  if (!complaint) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Complaint not found</h2>
        <p className="text-muted-foreground">The complaint you are looking for does not exist or has been deleted.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <ComplaintDetailsHeader complaint={complaint} />
      
      <Card className="p-6">
        <h2 className="text-lg font-medium mb-4">Original Complaint</h2>
        <div className="p-4 border rounded-md bg-muted/30 mb-4">
          <p className="whitespace-pre-wrap">{complaint.message}</p>
          {complaint.attachments.length > 0 && (
            <div className="mt-3 border-t pt-3">
              <p className="text-sm font-medium mb-2">Attachments:</p>
              <div className="flex flex-wrap gap-2">
                {complaint.attachments.map(attachment => (
                  <a 
                    key={attachment.id}
                    href={attachment.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 bg-muted rounded-md px-3 py-1.5 text-sm hover:bg-muted/80"
                  >
                    {attachment.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
      
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b p-4 bg-muted/20">
          <h2 className="text-lg font-medium">Conversation Thread</h2>
          <div className="text-sm text-muted-foreground">
            {complaint.replies.length} {complaint.replies.length === 1 ? 'reply' : 'replies'}
          </div>
        </div>
        
        <div className="p-4 max-h-[500px] overflow-y-auto bg-gray-50">
          {complaint.replies.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No replies yet. Be the first to respond.
            </div>
          ) : (
            complaint.replies.map(reply => (
              <MessageBubble 
                key={reply.id} 
                message={reply} 
                isAdmin={true} 
              />
            ))
          )}
        </div>
        
        <ReplyForm onSendMessage={handleSendReply} />
      </Card>
    </div>
  );
};

export default ComplaintDetails;
