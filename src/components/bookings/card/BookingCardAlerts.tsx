
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle, 
} from "@/components/ui/alert-dialog";

interface BookingCardAlertsProps {
  showCancelAlert: boolean;
  showDeleteAlert: boolean;
  onCancelAlertChange: (open: boolean) => void;
  onDeleteAlertChange: (open: boolean) => void;
  onConfirmCancel: () => void;
  onConfirmDelete: () => void;
}

export function BookingCardAlerts({
  showCancelAlert,
  showDeleteAlert,
  onCancelAlertChange,
  onDeleteAlertChange,
  onConfirmCancel,
  onConfirmDelete
}: BookingCardAlertsProps) {
  return (
    <>
      <AlertDialog open={showCancelAlert} onOpenChange={onCancelAlertChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirmCancel} 
              className="bg-red-500 hover:bg-red-600"
            >
              Yes, Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={onDeleteAlertChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this booking? This action cannot be undone and will permanently remove this booking from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirmDelete} 
              className="bg-red-700 hover:bg-red-800"
            >
              Yes, Delete Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
