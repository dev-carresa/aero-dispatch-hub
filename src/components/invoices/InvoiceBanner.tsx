
import { CalendarIcon } from "lucide-react";

export const InvoiceBanner = () => {
  return (
    <div className="info-banner">
      <CalendarIcon className="h-4 w-4 mr-2" />
      <span>The next batch of invoices will be generated on Feb 1, 2025</span>
    </div>
  );
};
