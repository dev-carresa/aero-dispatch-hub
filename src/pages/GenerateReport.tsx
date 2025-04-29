
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ReportFilter } from "@/types/report";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { ReportResults } from "@/components/reports/ReportResults";
import { format } from "date-fns";

const GenerateReport = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ReportFilter>({
    bookingStatus: ["completed"],
    includeDriver: true,
    includeCustomer: false,
    includeFleet: false,
    includeVehicle: false,
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResults, setGeneratedResults] = useState<any[] | null>(null);
  
  // These are the columns that will be displayed in the report results table
  const [reportColumns, setReportColumns] = useState<{ key: string; label: string }[]>([]);
  
  // Handle filter changes
  const handleFiltersChange = (newFilters: ReportFilter) => {
    setFilters(newFilters);
  };
  
  // Generate report
  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // This would normally be an API call
    setTimeout(() => {
      // Create sample data based on the selected filters
      const columns: { key: string; label: string }[] = [
        { key: 'id', label: 'ID' },
        { key: 'date', label: 'Date' },
      ];
      
      // Add columns based on selected data to include
      if (filters.includeCustomer) {
        columns.push({ key: 'customer', label: 'Customer' });
        columns.push({ key: 'email', label: 'Email' });
      }
      
      if (filters.includeDriver) {
        columns.push({ key: 'driver', label: 'Driver' });
        columns.push({ key: 'phone', label: 'Phone' });
      }
      
      if (filters.includeVehicle) {
        columns.push({ key: 'vehicle', label: 'Vehicle' });
        columns.push({ key: 'licensePlate', label: 'License Plate' });
      }
      
      if (filters.includeFleet) {
        columns.push({ key: 'fleet', label: 'Fleet' });
        columns.push({ key: 'fleetManager', label: 'Fleet Manager' });
      }
      
      columns.push({ key: 'status', label: 'Status' });
      columns.push({ key: 'amount', label: 'Amount' });
      
      setReportColumns(columns);
      
      // Generate mock results
      const results = Array.from({ length: 15 }).map((_, i) => {
        const result: Record<string, any> = {
          id: `B${10000 + i}`,
          date: format(new Date(2024, 0, i + 1), 'yyyy-MM-dd'),
          status: (filters.bookingStatus || [])[Math.floor(Math.random() * (filters.bookingStatus || []).length) % (filters.bookingStatus || []).length],
          amount: `$${(Math.random() * 150 + 50).toFixed(2)}`,
        };
        
        if (filters.includeCustomer) {
          result.customer = `Customer ${i + 1}`;
          result.email = `customer${i + 1}@example.com`;
        }
        
        if (filters.includeDriver) {
          result.driver = `Driver ${i + 1}`;
          result.phone = `+1 555-${1000 + i}`;
        }
        
        if (filters.includeVehicle) {
          const vehicles = ['Toyota Camry', 'Honda Accord', 'Ford Transit', 'Tesla Model Y', 'Chevrolet Suburban'];
          result.vehicle = vehicles[i % vehicles.length];
          result.licensePlate = `ABC${1000 + i}`;
        }
        
        if (filters.includeFleet) {
          result.fleet = `Fleet ${(i % 3) + 1}`;
          result.fleetManager = `Manager ${(i % 3) + 1}`;
        }
        
        return result;
      });
      
      setGeneratedResults(results);
      setIsGenerating(false);
      toast.success("Report generated successfully");
    }, 1500);
  };
  
  // Save report
  const handleSaveReport = (name: string) => {
    // This would normally be an API call
    toast.success(`Report "${name}" saved successfully`);
    // Navigate to saved reports after a brief delay
    setTimeout(() => {
      navigate("/reports/saved");
    }, 1500);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <ReportsHeader 
        title="Generate Report" 
        description="Create a custom report by selecting filters and data points"
        showGenerateButton={false}
      />
      
      <ReportFilters 
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onGenerateReport={handleGenerateReport}
        isGenerating={isGenerating}
      />
      
      {generatedResults && reportColumns.length > 0 && (
        <ReportResults 
          results={generatedResults}
          columns={reportColumns}
          onSaveReport={handleSaveReport}
        />
      )}
    </div>
  );
};

export default GenerateReport;
