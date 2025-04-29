
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReportData, ReportStatus } from "@/types/report";

interface ReportStatusDialogProps {
  report: ReportData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (newStatus: ReportStatus) => void;
}

export function ReportStatusDialog({
  report,
  open,
  onOpenChange,
  onConfirm,
}: ReportStatusDialogProps) {
  if (!report) return null;
  
  const statusOptions: { status: ReportStatus; label: string; description: string }[] = [
    {
      status: "draft",
      label: "Draft",
      description: "The report is still in progress and can be modified."
    },
    {
      status: "final",
      label: "Final",
      description: "The report is complete and ready for distribution."
    },
    {
      status: "archived",
      label: "Archived",
      description: "The report is no longer active but kept for reference."
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Report Status</DialogTitle>
          <DialogDescription>
            Select a new status for "{report.name}"
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {statusOptions.map((option) => (
            <div
              key={option.status}
              className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${
                report.status === option.status
                  ? "border-primary bg-primary/5"
                  : "hover:bg-muted/50 cursor-pointer"
              }`}
              onClick={() => report.status !== option.status && onConfirm(option.status)}
            >
              <div className="flex-1">
                <h4 className="font-semibold">{option.label}</h4>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
              {report.status === option.status && (
                <div className="h-2 w-2 rounded-full bg-primary" />
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
