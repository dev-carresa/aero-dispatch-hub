
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MeetingPoint } from "@/types/airport";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { DeleteMeetingPointDialog } from "./DeleteMeetingPointDialog";

interface MeetingPointCardProps {
  meetingPoint: MeetingPoint;
  onDelete: (id: number) => void;
}

export function MeetingPointCard({ meetingPoint, onDelete }: MeetingPointCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={meetingPoint.imageUrl}
          alt={`Meeting point at ${meetingPoint.terminal}`}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">{meetingPoint.terminal}</h3>
          {meetingPoint.fleetName && (
            <span className="text-sm text-muted-foreground">
              Fleet: {meetingPoint.fleetName}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm line-clamp-3">{meetingPoint.pickupInstructions}</p>
        <div className="mt-2 flex items-center text-xs text-muted-foreground">
          <span>
            Location: {meetingPoint.latitude.toFixed(4)}, {meetingPoint.longitude.toFixed(4)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link to={`/airports/meeting-points/${meetingPoint.id}/edit`}>Edit</Link>
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete</Button>
          </DialogTrigger>
          <DeleteMeetingPointDialog meetingPoint={meetingPoint} onDelete={onDelete} />
        </Dialog>
      </CardFooter>
    </Card>
  );
}
