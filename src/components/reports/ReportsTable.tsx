
import { useState } from "react";
import { ReportData, ReportStatus } from "@/types/report";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Download, Trash, CheckCircle, ArchiveRestore } from "lucide-react";
import { format, parseISO } from "date-fns";

interface ReportsTableProps {
  reports: ReportData[];
  isTrashView?: boolean;
  onDeleteReport: (report: ReportData) => void;
  onRestoreReport?: (report: ReportData) => void;
  onViewReport: (report: ReportData) => void;
  onChangeStatus: (report: ReportData, newStatus: ReportStatus) => void;
  onExportReport: (report: ReportData, format: string) => void;
}

export function ReportsTable({
  reports,
  isTrashView = false,
  onDeleteReport,
  onRestoreReport,
  onViewReport,
  onChangeStatus,
  onExportReport,
}: ReportsTableProps) {
  // Render badge for report status
  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200">Draft</Badge>;
      case "final":
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">Final</Badge>;
      case "archived":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50 border-gray-200">Archived</Badge>;
      case "deleted":
        return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">Deleted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get type label
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "driver":
        return "Driver Report";
      case "customer":
        return "Customer Report";
      case "fleet":
        return "Fleet Report";
      case "vehicle":
        return "Vehicle Report";
      case "booking":
        return "Booking Report";
      default:
        return type;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Report Name</TableHead>
            <TableHead className="hidden md:table-cell">Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Created Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                {isTrashView
                  ? "Trash is empty."
                  : "No reports found."}
              </TableCell>
            </TableRow>
          ) : (
            reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <div className="font-medium">{report.name}</div>
                  <div className="text-sm text-muted-foreground md:hidden">
                    {getTypeLabel(report.type)}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {getTypeLabel(report.type)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        {getStatusBadge(report.status)}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {!isTrashView && (
                        <>
                          <DropdownMenuItem 
                            onClick={() => onChangeStatus(report, "draft")}
                            disabled={report.status === "draft"}
                          >
                            Set as Draft
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onChangeStatus(report, "final")}
                            disabled={report.status === "final"}
                          >
                            Set as Final
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onChangeStatus(report, "archived")}
                            disabled={report.status === "archived"}
                          >
                            Archive Report
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {format(parseISO(report.createdAt), "PPP")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!isTrashView ? (
                        <>
                          <DropdownMenuItem onClick={() => onViewReport(report)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="w-full flex items-center px-2 py-1.5 text-sm">
                              <Download className="mr-2 h-4 w-4" />
                              Export
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onExportReport(report, "pdf")}>
                                PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onExportReport(report, "csv")}>
                                CSV
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onExportReport(report, "excel")}>
                                Excel
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => onDeleteReport(report)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem onClick={() => onRestoreReport?.(report)}>
                            <ArchiveRestore className="mr-2 h-4 w-4" />
                            Restore
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => onDeleteReport(report)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Permanently
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
