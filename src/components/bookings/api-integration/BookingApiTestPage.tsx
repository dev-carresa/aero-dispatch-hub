
import { Card } from "@/components/ui/card";
import { BookingApiTestTabs } from "./BookingApiTestTabs";

export default function BookingApiTestPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Booking API Integration</h1>
        <p className="text-muted-foreground">
          Connect to external booking systems and import bookings directly
        </p>
      </div>
      
      <Card className="p-6">
        <BookingApiTestTabs />
      </Card>
      
      <div className="text-sm text-muted-foreground bg-yellow-50 p-4 rounded-md">
        <p className="font-medium">Note:</p>
        <p>Imported bookings are now saved directly to your main bookings system and will appear in your bookings list.</p>
      </div>
    </div>
  );
}
