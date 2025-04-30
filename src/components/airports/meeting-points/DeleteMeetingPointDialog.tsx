
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MeetingPoint } from "@/types/airport";
import { DialogClose } from "@radix-ui/react-dialog";
import { useState } from "react";

interface DeleteMeetingPointDialogProps {
  meetingPoint: MeetingPoint;
  onDelete: (id: number) => void;
}

export function DeleteMeetingPointDialog({
  meetingPoint,
  onDelete,
}: DeleteMeetingPointDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    // Simulate API call delay
    setTimeout(() => {
      onDelete(meetingPoint.id);
      setIsDeleting(false);
    }, 500);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Meeting Point</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete the meeting point at {meetingPoint.terminal}?
          This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" disabled={isDeleting}>
            Cancel
          </Button>
        </DialogClose>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
