
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

interface BookingsTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export function BookingsTabs({ activeTab, setActiveTab }: BookingsTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 md:grid-cols-7 lg:grid-cols-8 w-full h-auto">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="next24h">Next 24h</TabsTrigger>
        <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
        <TabsTrigger value="latest">Latest</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
        <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        <TabsTrigger value="trash">Trash</TabsTrigger>
        <TabsTrigger value="new" asChild>
          <Link to="/bookings/new" className="w-full flex items-center justify-center">
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
