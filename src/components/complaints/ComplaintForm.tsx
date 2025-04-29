
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileInput } from "@/components/ui/file-input";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

export const ComplaintForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    bookingReference: "",
    fleetId: "",
    message: ""
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Basic validation
    if (!formData.bookingReference || !formData.fleetId || !formData.message) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }
    
    // In a real app, we would call an API to create the complaint with the files
    console.log("Form data:", formData);
    console.log("Attachments:", attachments);
    
    setTimeout(() => {
      toast.success("Complaint created successfully");
      setIsSubmitting(false);
      navigate("/complaints");
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <Button 
        type="button" 
        variant="outline" 
        className="gap-1" 
        onClick={() => navigate("/complaints")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Complaints
      </Button>
      
      <div className="space-y-4 mt-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Booking Reference*</label>
            <Select
              value={formData.bookingReference} 
              onValueChange={(value) => handleSelectChange("bookingReference", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a booking" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="B10001">B10001</SelectItem>
                <SelectItem value="B10015">B10015</SelectItem>
                <SelectItem value="B10022">B10022</SelectItem>
                <SelectItem value="B10030">B10030</SelectItem>
                <SelectItem value="B10035">B10035</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Fleet*</label>
            <Select 
              value={formData.fleetId} 
              onValueChange={(value) => handleSelectChange("fleetId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a fleet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Premium Fleet Services</SelectItem>
                <SelectItem value="2">City Cab Co.</SelectItem>
                <SelectItem value="3">Express Transport</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Complaint Message*</label>
          <Textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={5}
            placeholder="Enter the details of the complaint..."
            className="resize-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Attachments</label>
          <FileInput
            label="Upload evidence or documents"
            showPreview={true}
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            multiple
            onChange={handleFileChange}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Supported formats: JPG, PNG, PDF, DOC up to 10MB
          </p>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button
          type="submit"
          className="gap-1"
          disabled={isSubmitting}
        >
          <Save className="h-4 w-4" />
          Save Complaint
        </Button>
      </div>
    </form>
  );
};
