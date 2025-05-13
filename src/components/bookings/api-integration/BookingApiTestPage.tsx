
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { BookingApiTestTabs } from "./BookingApiTestTabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export default function BookingApiTestPage() {
  const [lastImportStats, setLastImportStats] = useState<{
    saved: number;
    errors: number;
    duplicates: number;
    timestamp?: Date;
  } | null>(null);

  const handleImportComplete = (stats: {
    saved: number;
    errors: number;
    duplicates: number;
  }) => {
    setLastImportStats({
      ...stats,
      timestamp: new Date()
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Booking API Integration</h1>
        <p className="text-muted-foreground">
          Connect to external booking systems and import bookings directly
        </p>
      </div>
      
      <Card className="p-6">
        <BookingApiTestTabs onImportComplete={handleImportComplete} />
      </Card>
      
      {lastImportStats && (
        <Alert className="bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-600" />
          <AlertTitle>Last Import Summary</AlertTitle>
          <AlertDescription>
            Successfully imported {lastImportStats.saved} bookings. 
            {lastImportStats.duplicates > 0 && ` Skipped ${lastImportStats.duplicates} duplicates.`}
            {lastImportStats.errors > 0 && ` Failed to import ${lastImportStats.errors} bookings.`}
            <div className="text-xs text-muted-foreground mt-1">
              {lastImportStats.timestamp?.toLocaleString()}
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="text-sm text-muted-foreground bg-yellow-50 p-4 rounded-md border border-yellow-200">
        <p className="font-medium">Note:</p>
        <p>Imported bookings are now saved directly to your main bookings system and will appear in your bookings list.</p>
      </div>
    </div>
  );
}
