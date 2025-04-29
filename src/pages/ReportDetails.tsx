
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ReportData } from "@/types/report";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { ReportResults } from "@/components/reports/ReportResults";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const ReportDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportColumns, setReportColumns] = useState<{ key: string; label: string }[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    const fetchReport = async () => {
      // This would normally be an API call
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - in real app would come from API
        const mockReport: ReportData = {
          id: Number(id),
          name: `Report ${id}`,
          type: "driver",
          status: "final",
          filters: {
            dateFrom: "2023-01-01",
            dateTo: "2023-12-31",
            bookingStatus: ["completed"],
            reportType: "driver"
          },
          createdAt: "2023-12-15T10:30:00Z",
          updatedAt: "2023-12-15T10:30:00Z",
          createdBy: 1,
          results: Array.from({ length: 15 }).map((_, i) => ({
            id: `B${10000 + i}`,
            date: `2023-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
            driver: `Driver ${i % 5 + 1}`,
            phone: `+1 555-${1000 + i % 5}`,
            bookings: Math.floor(Math.random() * 50) + 10,
            rating: (Math.random() * 2 + 3).toFixed(1),
            income: `$${(Math.random() * 500 + 200).toFixed(2)}`,
            status: "completed"
          })),
          totalBookings: 45,
          totalIncome: 15750.25
        };
        
        const columns = [
          { key: 'id', label: 'ID' },
          { key: 'date', label: 'Date' },
          { key: 'driver', label: 'Driver Name' },
          { key: 'phone', label: 'Phone' },
          { key: 'bookings', label: 'Bookings' },
          { key: 'rating', label: 'Rating' },
          { key: 'income', label: 'Income' },
          { key: 'status', label: 'Status' }
        ];
        
        setReport(mockReport);
        setReportColumns(columns);
        setTotalPages(Math.ceil((mockReport.results?.length || 0) / 10));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching report", error);
        toast.error("Failed to load report details");
        setLoading(false);
      }
    };
    
    fetchReport();
  }, [id]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <ReportsHeader
          title="Loading Report Details..." 
          description="Please wait while we load the report details"
        />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (!report) {
    return (
      <div className="space-y-6 animate-fade-in">
        <ReportsHeader
          title="Report Not Found" 
          description="The report you're looking for couldn't be found"
        />
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-muted-foreground mb-4">This report may have been deleted or doesn't exist</p>
          <Button onClick={() => navigate("/reports/saved")}>
            Back to Saved Reports
          </Button>
        </div>
      </div>
    );
  }
  
  const startIdx = (currentPage - 1) * 10;
  const endIdx = startIdx + 10;
  const currentPageResults = report.results?.slice(startIdx, endIdx) || [];
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/reports/saved")}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="flex-1">
          <ReportsHeader
            title={report.name} 
            description={`${report.type.charAt(0).toUpperCase() + report.type.slice(1)} report created on ${new Date(report.createdAt).toLocaleDateString()}`}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/40 p-4 rounded-lg border">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Report Type</h3>
          <p className="font-medium capitalize">{report.type}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
          <p className="font-medium capitalize">{report.status}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Date Range</h3>
          <p className="font-medium">
            {report.filters.dateFrom && new Date(report.filters.dateFrom).toLocaleDateString()} to{" "}
            {report.filters.dateTo && new Date(report.filters.dateTo).toLocaleDateString()}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Booking Status</h3>
          <p className="font-medium capitalize">
            {report.filters.bookingStatus?.join(", ") || "All"}
          </p>
        </div>
      </div>
      
      {report.results && reportColumns && (
        <ReportResults
          results={currentPageResults}
          columns={reportColumns}
          onSaveReport={() => {}} // Not needed in details view
          totalItems={report.totalBookings || 0}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalIncome={report.totalIncome || null}
          reportType={report.type}
        />
      )}
    </div>
  );
};

export default ReportDetails;
