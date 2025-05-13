
import { useState } from "react";
import { BookingComBooking } from "@/types/externalBooking";
import { toast } from "sonner";
import { externalBookingService } from "@/services/externalBookingService";

interface UseBookingSaverProps {
  fetchedBookings: BookingComBooking[];
  isAuthenticated: boolean;
  setErrorDetails: React.Dispatch<React.SetStateAction<string | null>>;
}

export function useBookingSaver({
  fetchedBookings,
  isAuthenticated,
  setErrorDetails
}: UseBookingSaverProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState({ current: 0, total: 0 });
  
  // Handle save bookings - saves one or more bookings directly to bookings_data
  const handleSaveBookings = async () => {
    if (!fetchedBookings || fetchedBookings.length === 0) {
      toast.warning("No bookings to save");
      return;
    }
    
    // Check if user is authenticated before attempting to save
    if (!isAuthenticated) {
      toast.error("You must be logged in to save bookings");
      setErrorDetails(JSON.stringify({ 
        message: "Authentication required. Please log in to save bookings.",
        code: 401
      }, null, 2));
      return;
    }

    try {
      setIsSaving(true);
      setErrorDetails(null);
      
      // Select the booking to save - always use the first booking
      const bookingToSave = fetchedBookings[0];
      console.log("Attempting to save booking:", bookingToSave);
      setSaveProgress({ current: 0, total: 1 });
      
      // Small delay to show progress (this is just for UX)
      await new Promise(resolve => setTimeout(resolve, 500));
      setSaveProgress({ current: 1, total: 1 });
      
      const result = await externalBookingService.saveExternalBookings([bookingToSave], 'booking.com');
      
      if (result.success) {
        toast.success(`Successfully saved booking`);
        
        if (result.duplicates > 0) {
          toast.info(`The booking was already saved previously and was skipped`);
        }
        
        if (result.errors > 0) {
          toast.warning(`There was an error saving the booking`);
        }
      } else {
        // Handle authentication errors specially
        if (result.code === 401) {
          toast.error("Authentication required. Please log in to save bookings.");
          setErrorDetails(JSON.stringify({
            message: result.message || "Authentication failed. Please log in to save bookings.",
            code: 401
          }, null, 2));
        } else {
          throw new Error(result.message || 'Failed to save booking');
        }
      }
    } catch (error: any) {
      console.error('Error saving booking:', error);
      
      // Capture and display detailed error information
      const errorMessage = error.message || 'Failed to save booking';
      toast.error(errorMessage);
      
      // Store detailed error info for debugging
      if (error.status) {
        setErrorDetails(`Status: ${error.status}\nMessage: ${errorMessage}\nDetails: ${JSON.stringify(error, null, 2)}`);
      } else {
        setErrorDetails(JSON.stringify(error, null, 2));
      }
    } finally {
      setIsSaving(false);
      setSaveProgress({ current: 0, total: 0 });
    }
  };

  return {
    isSaving,
    saveProgress,
    handleSaveBookings
  };
}
