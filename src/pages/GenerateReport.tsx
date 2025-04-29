
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ReportFilter, ReportType } from "@/types/report";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { ReportResults } from "@/components/reports/ReportResults";
import { format } from "date-fns";

const GenerateReport = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ReportFilter>({
    bookingStatus: ["completed"],
    reportType: "driver",
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResults, setGeneratedResults] = useState<any[] | null>(null);
  
  // These are the columns that will be displayed in the report results table
  const [reportColumns, setReportColumns] = useState<{ key: string; label: string }[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Total calculations
  const [totalIncome, setTotalIncome] = useState<number | null>(null);
  
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
      
      // Add columns based on selected report type
      switch(filters.reportType) {
        case "driver":
          columns.push({ key: 'driver', label: 'Driver Name' });
          columns.push({ key: 'phone', label: 'Phone' });
          columns.push({ key: 'bookings', label: 'Bookings' });
          columns.push({ key: 'rating', label: 'Rating' });
          columns.push({ key: 'income', label: 'Income' });
          break;
        case "customer":
          columns.push({ key: 'customer', label: 'Customer Name' });
          columns.push({ key: 'email', label: 'Email' });
          columns.push({ key: 'bookings', label: 'Total Bookings' });
          columns.push({ key: 'totalSpent', label: 'Total Spent' });
          break;
        case "fleet":
          columns.push({ key: 'fleet', label: 'Fleet Name' });
          columns.push({ key: 'fleetManager', label: 'Fleet Manager' });
          columns.push({ key: 'vehicles', label: 'Total Vehicles' });
          columns.push({ key: 'bookings', label: 'Total Bookings' });
          columns.push({ key: 'income', label: 'Total Income' });
          break;
        case "vehicle":
          columns.push({ key: 'vehicle', label: 'Vehicle Model' });
          columns.push({ key: 'licensePlate', label: 'License Plate' });
          columns.push({ key: 'bookings', label: 'Total Bookings' });
          columns.push({ key: 'distance', label: 'Total Distance' });
          columns.push({ key: 'income', label: 'Total Income' });
          break;
      }
      
      columns.push({ key: 'status', label: 'Status' });
      
      setReportColumns(columns);
      
      // Generate mock results (total 45 items for pagination testing)
      const totalResults = 45;
      setTotalItems(totalResults);
      setTotalPages(Math.ceil(totalResults / itemsPerPage));
      
      // Generate all results but will only display current page
      const allResults = Array.from({ length: totalResults }).map((_, i) => {
        const result: Record<string, any> = {
          id: `B${10000 + i}`,
          date: format(new Date(2024, 0, i % 30 + 1), 'yyyy-MM-dd'),
          status: (filters.bookingStatus || [])[Math.floor(Math.random() * (filters.bookingStatus || []).length) % (filters.bookingStatus || []).length],
        };
        
        // Add specific data based on report type
        switch(filters.reportType) {
          case "driver":
            result.driver = `Driver ${i % 5 + 1}`;
            result.phone = `+1 555-${1000 + i % 5}`;
            result.bookings = Math.floor(Math.random() * 50) + 10;
            result.rating = (Math.random() * 2 + 3).toFixed(1);
            result.income = `$${(Math.random() * 500 + 200).toFixed(2)}`;
            break;
          case "customer":
            result.customer = `Customer ${i % 8 + 1}`;
            result.email = `customer${i % 8 + 1}@example.com`;
            result.bookings = Math.floor(Math.random() * 15) + 1;
            result.totalSpent = `$${(Math.random() * 1200 + 300).toFixed(2)}`;
            break;
          case "fleet":
            result.fleet = `Fleet ${i % 3 + 1}`;
            result.fleetManager = `Manager ${i % 3 + 1}`;
            result.vehicles = Math.floor(Math.random() * 10) + 5;
            result.bookings = Math.floor(Math.random() * 100) + 50;
            result.income = `$${(Math.random() * 5000 + 1000).toFixed(2)}`;
            break;
          case "vehicle":
            const vehicles = ['Toyota Camry', 'Honda Accord', 'Ford Transit', 'Tesla Model Y', 'Chevrolet Suburban'];
            result.vehicle = vehicles[i % vehicles.length];
            result.licensePlate = `ABC${1000 + i}`;
            result.bookings = Math.floor(Math.random() * 40) + 10;
            result.distance = `${Math.floor(Math.random() * 5000) + 1000} mi`;
            result.income = `$${(Math.random() * 3000 + 800).toFixed(2)}`;
            break;
        }
        
        return result;
      });
      
      // Calculate total income if applicable
      if (filters.reportType === "driver" || filters.reportType === "fleet" || filters.reportType === "vehicle") {
        const total = allResults.reduce((sum, item) => {
          const income = parseFloat(item.income.replace('$', ''));
          return sum + income;
        }, 0);
        setTotalIncome(total);
      } else {
        setTotalIncome(null);
      }
      
      // Slice the results for pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, totalResults);
      const paginatedResults = allResults.slice(startIndex, endIndex);
      
      setGeneratedResults(paginatedResults);
      setIsGenerating(false);
      toast.success("Report generated successfully");
    }, 1500);
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    handleGenerateReport();
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
          totalItems={totalItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalIncome={totalIncome}
          reportType={filters.reportType}
        />
      )}
    </div>
  );
};

export default GenerateReport;
