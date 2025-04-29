
import { Button } from "@/components/ui/button";
import { DownloadIcon, FileInput } from "lucide-react";

export const QualityReviewsHeader = () => {
  const handleExport = () => {
    // In a real app, implement CSV export functionality
    console.log("Exporting reviews...");
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Quality Reviews</h2>
        <p className="text-muted-foreground">
          Monitor customer feedback and service quality metrics
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
        <DownloadIcon className="h-4 w-4" />
        Export Data
      </Button>
    </div>
  );
};
