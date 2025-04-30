
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
import { ApiUser } from "@/types/apiUser";

interface ApiUserDeleteDialogProps {
  apiUser: ApiUser | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ApiUserDeleteDialog({
  apiUser,
  isOpen,
  onClose,
  onConfirm,
}: ApiUserDeleteDialogProps) {
  if (!apiUser) return null;
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete API User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{apiUser.name}</strong>?
            This action cannot be undone and will permanently revoke all API access.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 focus:ring-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
