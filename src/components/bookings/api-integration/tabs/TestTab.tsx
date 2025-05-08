
import { FetchControlsForm } from "@/components/bookings/api-integration/FetchControlsForm";
import { BookingDataPreview } from "@/components/bookings/api-integration/BookingDataPreview";
import { BookingComBooking } from "@/types/externalBooking";
import { OAuthTokenHandler } from "@/components/bookings/api-integration/OAuthTokenHandler";

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
  onTokenReceived?: (token: string) => void;
}

export function TestTab({ 
  onFetch, 
  isFetching, 
  fetchedBookings, 
  isSaving, 
  onSaveAll, 
  saveProgress,
  onTokenReceived
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
        <OAuthTokenHandler onTokenReceived={onTokenReceived || (() => {})} />
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
