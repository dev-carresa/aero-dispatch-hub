
import { FetchControlsForm } from "@/components/bookings/api-integration/FetchControlsForm";
import { BookingDataPreview } from "@/components/bookings/api-integration/BookingDataPreview";
import { BookingComBooking } from "@/types/externalBooking";

// Static credentials for authentication
const STATIC_CREDENTIALS = {
  username: "1ej3odu98odoamfpml0lupclbo",
  password: "1u7bc2njok72t1spnbjqt019l4eiiva79u8rnsfjsq3ls761b552"
};

interface TestTabProps {
  onFetch: (params: any) => Promise<void>;
  isFetching: boolean;
  fetchedBookings: BookingComBooking[];
  isSaving: boolean;
  onSaveAll: () => Promise<void>;
  saveProgress: { current: number; total: number };
}

export function TestTab({ 
  onFetch, 
  isFetching, 
  fetchedBookings, 
  isSaving, 
  onSaveAll, 
  saveProgress 
}: TestTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FetchControlsForm
            onFetch={onFetch}
            isLoading={isFetching}
          />
        </div>
        <div className="p-6 border rounded-lg bg-muted/20">
          <h3 className="text-lg font-medium mb-4">Static Authentication Active</h3>
          <p className="text-sm text-muted-foreground">
            Using static credentials for API requests. No OAuth token required.
          </p>
        </div>
      </div>

      {fetchedBookings.length > 0 && (
        <BookingDataPreview
          bookings={fetchedBookings}
          isLoading={isSaving}
          onSaveAll={onSaveAll}
          currentProgress={saveProgress.current}
          totalProgress={saveProgress.total}
        />
      )}
    </div>
  );
}
