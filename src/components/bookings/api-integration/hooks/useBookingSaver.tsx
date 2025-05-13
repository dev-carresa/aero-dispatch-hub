
import { useState } from "react";
import { BookingComBooking } from "@/types/externalBooking";
import { saveExternalBookings } from "@/services/external-booking";
import { toast } from "sonner";

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
      toast.error("No bookings to save");
      return;
    }

    try {
      setIsSaving(true);
      setSaveProgress({ current: 0, total: fetchedBookings.length });
      setErrorDetails(null);

      // Save all bookings at once
      const response = await saveExternalBookings(fetchedBookings);

      if (response.success) {
        toast.success(`Successfully saved ${response.savedCount} bookings`);
        setSaveProgress({ current: response.savedCount, total: fetchedBookings.length });
      } else {
        toast.error(response.message || "Failed to save bookings");
        if (response.errors && response.errors.length > 0) {
          setErrorDetails(JSON.stringify(response.errors, null, 2));
        } else {
          setErrorDetails(response.message || "Unknown error occurred while saving bookings");
        }
      }
    } catch (error: any) {
      console.error("Error saving bookings:", error);
      toast.error("Error saving bookings");
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
