
import { MeetingPoint } from "@/types/airport";
import { MeetingPointCard } from "./MeetingPointCard";

interface MeetingPointsListProps {
  meetingPoints: MeetingPoint[];
  onDelete: (id: number) => void;
}

export function MeetingPointsList({ meetingPoints, onDelete }: MeetingPointsListProps) {
  if (meetingPoints.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
        <p className="text-center text-sm text-muted-foreground">
          No meeting points found. Add your first meeting point!
        </p>
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
