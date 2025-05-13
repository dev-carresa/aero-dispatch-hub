
import { useState } from "react";
import { BookingComBooking } from "@/types/externalBooking";
import { saveExternalBookings } from "@/services/external-booking";
import { toast } from "@/components/ui/use-toast";

export interface SaveProgress {
  current: number;
  total: number;
}

export interface UseBookingSaverProps {
  fetchedBookings: BookingComBooking[];
  setErrorDetails: (details: string | null) => void;
  isAuthenticated?: boolean;
}

export function useBookingSaver({ 
  fetchedBookings,
  setErrorDetails,
  isAuthenticated = false
}: UseBookingSaverProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState<SaveProgress>({ current: 0, total: 0 });

  const handleSaveBookings = async () => {
    if (!fetchedBookings.length) {
      toast({
        title: "Error",
        description: "No bookings to save",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSaving(true);
      setSaveProgress({ current: 0, total: fetchedBookings.length });
      setErrorDetails(null);

      // First, ensure the source is specified in the first booking
      const selectedBooking = fetchedBookings[0];

      // Save the first booking
      const response = await saveExternalBookings([selectedBooking]);

      if (response.success) {
        toast({
          title: "Success",
          description: `Successfully saved ${response.savedCount} bookings`
        });
        setSaveProgress({ current: response.savedCount, total: fetchedBookings.length });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to save bookings",
          variant: "destructive"
        });
        
        if (response.errors && response.errorDetails) {
          setErrorDetails(JSON.stringify(response.errorDetails, null, 2));
        } else {
          setErrorDetails(response.message || "Unknown error occurred while saving bookings");
        }
      }
    } catch (error: any) {
      console.error("Error saving bookings:", error);
      toast({
        title: "Error",
        description: "Error saving bookings",
        variant: "destructive"
      });
      setErrorDetails(error.message || "Unknown error occurred while saving bookings");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    saveProgress,
    handleSaveBookings
  };
}
