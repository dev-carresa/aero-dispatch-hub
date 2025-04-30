
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

interface ApiUserStatusDialogProps {
  apiUser: ApiUser | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ApiUserStatusDialog({
  apiUser,
  isOpen,
  onClose,
  onConfirm,
}: ApiUserStatusDialogProps) {
  if (!apiUser) return null;
  
  const isActivating = apiUser.status === "inactive";
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isActivating ? "Activate API User" : "Deactivate API User"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isActivating ? (
              <>
                Are you sure you want to activate <strong>{apiUser.name}</strong>?
                This will allow them to use the API and access services again.
              </>
            ) : (
              <>
                Are you sure you want to deactivate <strong>{apiUser.name}</strong>?
                This will immediately revoke their access to the API and services.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {isActivating ? "Activate" : "Deactivate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
