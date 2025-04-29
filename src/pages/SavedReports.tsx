
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ReportData, ReportStatus } from "@/types/report";
import { initialReports } from "@/data/sampleReports";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { ReportsTable } from "@/components/reports/ReportsTable";
import { ReportStatusDialog } from "@/components/reports/ReportStatusDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SavedReports = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("view") || "all";
  
  const [reports, setReports] = useState<ReportData[]>(initialReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [reportToChangeStatus, setReportToChangeStatus] = useState<ReportData | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  
  // Filter reports based on the active tab and search term
  const filteredReports = reports.filter(report => {
    // Filter by search term
    const matchesSearch = searchTerm === "" || 
      report.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by tab view
    if (activeTab === "trash") {
      return report.status === "deleted" && matchesSearch;
    } else if (activeTab === "all") {
      return report.status !== "deleted" && matchesSearch;
    } else {
      return report.status === activeTab && report.status !== "deleted" && matchesSearch;
    }
  });
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    if (value !== "all") {
      searchParams.set("view", value);
    } else {
      searchParams.delete("view");
    }
    setSearchParams(searchParams);
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle viewing report details
  const handleViewReport = (report: ReportData) => {
    toast.info("Viewing report details would open the report");
    // In a real app, this would navigate to a report detail page
    // navigate(`/reports/view/${report.id}`);
  };
  
  // Handle report status change
  const handleChangeStatus = (report: ReportData) => {
    setReportToChangeStatus(report);
    setIsStatusDialogOpen(true);
  };
  
  // Handle confirming status change
  const handleConfirmStatusChange = (newStatus: ReportStatus) => {
    if (reportToChangeStatus) {
      setReports(
        reports.map(r =>
          r.id === reportToChangeStatus.id
            ? { ...r, status: newStatus, updatedAt: new Date().toISOString() }
            : r
        )
      );
      toast.success(`Report status updated to ${newStatus}`);
      setIsStatusDialogOpen(false);
    }
  };
  
  // Handle deleting a report
  const handleDeleteReport = (report: ReportData) => {
    if (activeTab === "trash") {
      // Permanently delete from trash
      setReports(reports.filter(r => r.id !== report.id));
      toast.success(`Report permanently deleted`);
    } else {
      // Move to trash
      setReports(
        reports.map(r =>
          r.id === report.id
            ? { ...r, status: "deleted", updatedAt: new Date().toISOString() }
            : r
        )
      );
      toast.success(`Report moved to trash`);
    }
  };
  
  // Handle restoring a report from trash
  const handleRestoreReport = (report: ReportData) => {
    setReports(
      reports.map(r =>
        r.id === report.id
          ? { ...r, status: "draft", updatedAt: new Date().toISOString() }
          : r
      )
    );
    toast.success(`Report restored`);
  };
  
  // Handle exporting a report
  const handleExportReport = (report: ReportData, format: string) => {
    toast.success(`Report exported as ${format.toUpperCase()}`);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <ReportsHeader 
        title="Saved Reports" 
        description="View and manage your saved reports"
      />
      
      <div className="flex flex-col gap-4">
        <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList>
              <TabsTrigger value="all">All Reports</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="final">Final</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
              <TabsTrigger value="trash">Trash</TabsTrigger>
            </TabsList>
            
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-9 w-full sm:w-[250px]"
              />
            </div>
          </div>
          
          <TabsContent value="all" className="pt-4">
            <ReportsTable
              reports={filteredReports}
              onDeleteReport={handleDeleteReport}
              onViewReport={handleViewReport}
              onChangeStatus={handleChangeStatus}
              onExportReport={handleExportReport}
            />
          </TabsContent>
          
          <TabsContent value="draft" className="pt-4">
            <ReportsTable
              reports={filteredReports}
              onDeleteReport={handleDeleteReport}
              onViewReport={handleViewReport}
              onChangeStatus={handleChangeStatus}
              onExportReport={handleExportReport}
            />
          </TabsContent>
          
          <TabsContent value="final" className="pt-4">
            <ReportsTable
              reports={filteredReports}
              onDeleteReport={handleDeleteReport}
              onViewReport={handleViewReport}
              onChangeStatus={handleChangeStatus}
              onExportReport={handleExportReport}
            />
          </TabsContent>
          
          <TabsContent value="archived" className="pt-4">
            <ReportsTable
              reports={filteredReports}
              onDeleteReport={handleDeleteReport}
              onViewReport={handleViewReport}
              onChangeStatus={handleChangeStatus}
              onExportReport={handleExportReport}
            />
          </TabsContent>
          
          <TabsContent value="trash" className="pt-4">
            <ReportsTable
              reports={filteredReports}
              isTrashView={true}
              onDeleteReport={handleDeleteReport}
              onRestoreReport={handleRestoreReport}
              onViewReport={handleViewReport}
              onChangeStatus={handleChangeStatus}
              onExportReport={handleExportReport}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <ReportStatusDialog
        report={reportToChangeStatus}
        open={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
        onConfirm={handleConfirmStatusChange}
      />
    </div>
  );
};

export default SavedReports;
