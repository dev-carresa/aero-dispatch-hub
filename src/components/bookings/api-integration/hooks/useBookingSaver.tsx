
import { useState } from "react";
import { BookingComBooking } from "@/types/externalBooking";
import { toast } from "sonner";
import { saveService } from "@/services/external-booking";

interface UseBookingSaverProps {
  fetchedBookings: BookingComBooking[];
  setErrorDetails: React.Dispatch<React.SetStateAction<string | null>>;
  isAuthenticated?: boolean; // Make this optional with a default value
}

export function useBookingSaver({
  fetchedBookings,
  setErrorDetails,
  isAuthenticated = true // Default to true if not provided
}: UseBookingSaverProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState({ current: 0, total: 0 });
  
  // Handle save bookings - saves one or more bookings directly to bookings_data
  const handleSaveBookings = async () => {
    if (!fetchedBookings || fetchedBookings.length === 0) {
      toast.warning("No bookings to save");
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
      
      const result = await saveService.saveExternalBookings([bookingToSave], 'booking.com');
      
      if (result.success) {
        toast.success(`Successfully saved booking`);
        
        if (result.duplicates > 0) {
          toast.info(`The booking was already saved previously and was skipped`);
        }
        
        if (result.errors > 0) {
          toast.warning(`There was an error saving the booking`);
        }
      } else {
        throw new Error(result.message || 'Failed to save booking');
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
