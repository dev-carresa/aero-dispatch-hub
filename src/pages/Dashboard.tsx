
import { BookingStats } from "@/components/dashboard/BookingStats";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { BookingSourcesChart } from "@/components/dashboard/BookingSourcesChart";
import { RecentBookings } from "@/components/dashboard/RecentBookings";

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your transportation operation
        </p>
      </div>
      
      <BookingStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart />
        <BookingSourcesChart />
      </div>
      
      <RecentBookings />
    </div>
  );
};

export default Dashboard;
