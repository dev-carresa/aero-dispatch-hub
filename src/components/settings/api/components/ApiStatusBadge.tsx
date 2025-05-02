
import { Check, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type ApiStatus = "connected" | "disconnected" | "error" | "pending";

interface ApiStatusBadgeProps {
  status: ApiStatus;
}

export function ApiStatusBadge({ status }: ApiStatusBadgeProps) {
  switch (status) {
    case "connected":
      return <Badge className="bg-green-500 hover:bg-green-600"><Check className="h-3 w-3 mr-1" /> Connected</Badge>;
    case "error":
      return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> Error</Badge>;
    case "pending":
      return <Badge variant="secondary">Pending Setup</Badge>;
    default:
      return <Badge variant="outline">Disconnected</Badge>;
  }
}
