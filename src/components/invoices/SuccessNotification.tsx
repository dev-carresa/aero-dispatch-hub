
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check } from "lucide-react";

interface SuccessNotificationProps {
  message: string | null;
}

export const SuccessNotification = ({ message }: SuccessNotificationProps) => {
  if (!message) return null;
  
  return (
    <Alert className="bg-green-50 border-green-200">
      <Check className="h-4 w-4 text-green-600" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
