
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PaperclipIcon, Send } from "lucide-react";
import { FileInput } from "@/components/ui/file-input";
import { toast } from "sonner";

interface ReplyFormProps {
  onSendMessage: (message: string, attachments: File[]) => void;
}

export const ReplyForm = ({ onSendMessage }: ReplyFormProps) => {
  const [message, setMessage] = useState("");
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setFiles(prev => [...prev, ...fileList]);
    }
  };

  const handleSubmit = () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, we would send the message and attachments to an API
    onSendMessage(message, files);
    
    // Clear form
    setMessage("");
    setFiles([]);
    setShowFileUpload(false);
    setIsSubmitting(false);
  };

  return (
    <div className="border-t p-4 bg-white">
      <Textarea
        placeholder="Type your reply..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="resize-none mb-2"
        rows={3}
      />
      
      {showFileUpload && (
        <div className="mb-3">
          <FileInput
            onChange={handleAttachmentChange}
            showPreview={false}
            multiple
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
          />
          <div className="flex gap-2 mt-2">
            {files.map((file, index) => (
              <div 
                key={index}
                className="text-xs bg-muted px-2 py-1 rounded flex items-center gap-1"
              >
                {file.name}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-4 w-4 p-0" 
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1"
          onClick={() => setShowFileUpload(!showFileUpload)}
        >
          <PaperclipIcon className="h-4 w-4" />
          {showFileUpload ? 'Hide Attachments' : 'Add Attachments'}
        </Button>
        
        <Button
          type="button"
          size="sm"
          className="gap-1"
          onClick={handleSubmit}
          disabled={isSubmitting || !message.trim()}
        >
          <Send className="h-4 w-4" />
          Send Reply
        </Button>
      </div>
    </div>
  );
};
