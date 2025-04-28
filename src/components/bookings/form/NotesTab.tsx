
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NotesTabProps {
  isEditing: boolean;
  onBack: () => void;
  onSubmit: () => void;
}

export function NotesTab({ isEditing, onBack, onSubmit }: NotesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Notes</CardTitle>
        <CardDescription>Add any notes or comments about this booking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="admin-notes">Admin Notes</Label>
          <Textarea id="admin-notes" placeholder="Notes visible to admin only..." rows={4} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="driver-notes">Driver Notes</Label>
          <Textarea id="driver-notes" placeholder="Notes for the driver..." rows={4} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button type="submit" onClick={onSubmit}>
          {isEditing ? "Update Booking" : "Save Booking"}
        </Button>
      </CardFooter>
    </Card>
  );
}
