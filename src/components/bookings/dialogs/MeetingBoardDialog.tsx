
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Download, Edit, Eye, Printer, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MeetingBoardDialogProps {
  bookingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingData?: {
    customer: string;
    origin: string;
    destination: string;
    date: string;
    time: string;
    flightNumber?: string;
  };
}

export function MeetingBoardDialog({ 
  bookingId, 
  open, 
  onOpenChange, 
  bookingData = { 
    customer: "John Smith", 
    origin: "JFK Airport Terminal 4", 
    destination: "Hilton Manhattan Hotel", 
    date: "2023-10-15", 
    time: "14:30",
    flightNumber: "AA1234"
  } 
}: MeetingBoardDialogProps) {
  const [boardText, setBoardText] = useState(`Welcome ${bookingData.customer}`);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const handlePrint = () => {
    toast({
      title: "Print requested",
      description: "The meeting board has been sent to the printer.",
    });
    window.print();
  };

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "The meeting board is being downloaded.",
    });
    // In a real implementation, this would convert the board to an image or PDF
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Meeting board updated",
      description: "Your changes have been saved.",
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Meeting Board - Booking #{bookingId}</DialogTitle>
            <DialogDescription>
              Customize and print a meeting board for your driver.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center space-y-4 border p-6 rounded-lg relative">
              {!isEditing && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2" 
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              
              {isEditing ? (
                <div className="w-full space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="boardText">Board Text</Label>
                    <Input 
                      id="boardText" 
                      value={boardText} 
                      onChange={(e) => setBoardText(e.target.value)} 
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-3xl font-bold text-center my-8">
                  {boardText}
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                <p>Booking #{bookingId}</p>
                <p>{bookingData.date} at {bookingData.time}</p>
              </div>
              
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setShowPreview(true)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Board
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sample Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          <div className="bg-white p-10 flex flex-col items-center">
            <div className="text-4xl font-bold mb-10 text-center">
              {bookingData.customer}
            </div>
            
            <div className="mt-8 flex justify-center gap-4 w-full">
              <Button onClick={handlePrint} className="flex-1">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleDownload} variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
