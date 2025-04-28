
import { User } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UserStatusDialogProps {
  userToDeactivate: User | null;
  setUserToDeactivate: (user: User | null) => void;
  toggleUserStatus: (user: User) => void;
}

export const UserStatusDialog = ({
  userToDeactivate,
  setUserToDeactivate,
  toggleUserStatus,
}: UserStatusDialogProps) => {
  return (
    <Dialog open={!!userToDeactivate} onOpenChange={(open) => !open && setUserToDeactivate(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {userToDeactivate?.status === 'active' 
              ? 'Deactivate User' 
              : 'Activate User'}
          </DialogTitle>
          <DialogDescription>
            {userToDeactivate?.status === 'active'
              ? `Are you sure you want to deactivate ${userToDeactivate?.name}? They will no longer be able to access the system.`
              : `Are you sure you want to activate ${userToDeactivate?.name}? They will regain access to the system.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setUserToDeactivate(null)}>
            Cancel
          </Button>
          <Button 
            variant={userToDeactivate?.status === 'active' ? "destructive" : "default"}
            onClick={() => userToDeactivate && toggleUserStatus(userToDeactivate)}
          >
            {userToDeactivate?.status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
