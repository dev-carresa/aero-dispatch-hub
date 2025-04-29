
import { ComplaintReply } from "@/types/complaint";
import { format } from "date-fns";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageBubbleProps {
  message: ComplaintReply;
  isAdmin: boolean;
}

export const MessageBubble = ({ message, isAdmin }: MessageBubbleProps) => {
  const isFleet = message.senderRole === "Fleet";
  const isFromCurrentUser = isAdmin ? message.senderRole === "Admin" : isFleet;
  
  return (
    <div className={`flex ${isFromCurrentUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[75%] ${isFromCurrentUser ? "bg-primary/10 rounded-tl-lg rounded-tr-lg rounded-bl-lg" : "bg-muted rounded-tl-lg rounded-tr-lg rounded-br-lg"} p-4`}>
        <div className="flex justify-between items-start mb-2">
          <div className="font-medium text-sm">
            {message.senderName} 
            <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${isFleet ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}`}>
              {message.senderRole}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {format(new Date(message.timestamp), "MMM d, h:mm a")}
          </div>
        </div>
        
        <div className="text-sm whitespace-pre-wrap">
          {message.message}
        </div>
        
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-medium text-gray-500">Attachments:</p>
            <div className="flex flex-wrap gap-2">
              {message.attachments.map(attachment => (
                <div 
                  key={attachment.id}
                  className="flex items-center gap-1 bg-background border rounded-md px-2.5 py-1.5 text-xs"
                >
                  <span className="truncate max-w-[150px]">{attachment.name}</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
