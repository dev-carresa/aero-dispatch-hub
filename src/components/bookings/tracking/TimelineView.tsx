import { CheckCircle, Clock, MapPin, MessageSquare, User, X } from "lucide-react";
import { TrackingHistoryEntry } from '@/lib/schemas/bookingSchema';
interface TimelineViewProps {
  trackingHistory: TrackingHistoryEntry[];
  className?: string;
}
export function TimelineView({
  trackingHistory,
  className
}: TimelineViewProps) {
  const getStatusIcon = (status: string, index: number) => {
    if (status === 'completed') return <CheckCircle className="h-4 w-4 text-white" />;
    if (status === 'noshow') return <X className="h-4 w-4 text-white" />;
    return <Clock className="h-4 w-4 text-white" />;
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'noshow':
        return 'bg-red-500';
      case 'accepted':
        return 'bg-blue-500';
      default:
        return 'bg-muted-foreground';
    }
  };
  return <div className={`space-y-6 overflow-y-auto pr-2 ${className}`}>
      {trackingHistory.map((event, index) => <div key={event.id} className="relative pl-8 pb-6 border-l border-muted last:border-0 last:pb-0 py-0 px-[31px] mx-[16px]">
          <div className={`absolute w-6 h-6 rounded-full flex items-center justify-center -left-3 top-0 ${getStatusColor(event.status)}`}>
            {getStatusIcon(event.status, index)}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <p className="font-medium capitalize">{event.status}</p>
              <p className="text-xs text-muted-foreground">{event.timestamp}</p>
            </div>
            <div className="flex items-start gap-2 mt-1">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
              <p className="text-sm">{event.location}</p>
            </div>
            {event.notes && <div className="flex items-start gap-2 mt-1">
                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                <p className="text-sm">{event.notes}</p>
              </div>}
            <div className="flex items-start gap-2 mt-1">
              <User className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
              <p className="text-sm text-muted-foreground">{event.user}</p>
            </div>
          </div>
        </div>)}
    </div>;
}