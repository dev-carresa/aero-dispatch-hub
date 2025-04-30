
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MeetingPoint } from "@/types/airport";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { DeleteMeetingPointDialog } from "./DeleteMeetingPointDialog";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin } from "lucide-react";

interface MeetingPointCardProps {
  meetingPoint: MeetingPoint;
  onDelete: (id: number) => void;
}

export function MeetingPointCard({ meetingPoint, onDelete }: MeetingPointCardProps) {
  return (
    <Card className="overflow-hidden hover-scale transition-all duration-300 shadow-sm hover:shadow-md">
      <div className="aspect-video w-full overflow-hidden relative">
        <img
          src={meetingPoint.imageUrl}
          alt={`Meeting point at ${meetingPoint.terminal}`}
          className="h-full w-full object-cover transition-transform hover:scale-105 duration-700"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-white/80 hover:bg-white text-primary shadow-sm font-medium">
            {meetingPoint.terminal}
          </Badge>
        </div>
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{meetingPoint.terminal}</h3>
          {meetingPoint.fleetName && (
            <Badge variant="outline" className="font-normal">
              {meetingPoint.fleetName}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm line-clamp-3 text-muted-foreground">{meetingPoint.pickupInstructions}</p>
        <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>
            {meetingPoint.latitude.toFixed(4)}, {meetingPoint.longitude.toFixed(4)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button variant="outline" size="sm" className="h-8" asChild>
          <Link to={`/airports/meeting-points/${meetingPoint.id}/edit`}>Edit</Link>
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm" className="h-8">Delete</Button>
          </DialogTrigger>
          <DeleteMeetingPointDialog meetingPoint={meetingPoint} onDelete={onDelete} />
        </Dialog>
      </CardFooter>
    </Card>
  );
}
