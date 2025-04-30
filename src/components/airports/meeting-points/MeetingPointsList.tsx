
import { MeetingPoint } from "@/types/airport";
import { MeetingPointCard } from "./MeetingPointCard";
import { MapPin } from "lucide-react";

interface MeetingPointsListProps {
  meetingPoints: MeetingPoint[];
  onDelete: (id: number) => void;
}

export function MeetingPointsList({ meetingPoints, onDelete }: MeetingPointsListProps) {
  if (meetingPoints.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-md border border-dashed bg-gray-50">
        <div className="flex flex-col items-center text-center space-y-2">
          <MapPin className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">No meeting points found</p>
          <p className="text-sm text-muted-foreground">Add your first meeting point to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {meetingPoints.map((meetingPoint) => (
        <MeetingPointCard
          key={meetingPoint.id}
          meetingPoint={meetingPoint}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
