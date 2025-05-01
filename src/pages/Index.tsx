
import { useAuth } from "@/context/AuthContext";
import { Layout } from "@/components/layout/Layout";

const Index = () => {
  const { user } = useAuth();
  
  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome</h2>
            <p className="text-muted-foreground">
              {user ? `Welcome back, ${user.user_metadata?.name || user.email || 'User'}!` : 'Welcome to the transportation management system'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-950 p-6 rounded-lg border shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Quick Actions</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/bookings/new" className="text-blue-600 dark:text-blue-500 hover:underline">Create new booking</a>
                </li>
                <li>
                  <a href="/bookings" className="text-blue-600 dark:text-blue-500 hover:underline">Manage bookings</a>
                </li>
                <li>
                  <a href="/reports" className="text-blue-600 dark:text-blue-500 hover:underline">View reports</a>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-950 p-6 rounded-lg border shadow-sm">
              <h3 className="text-xl font-semibold mb-3">System Status</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span>All systems operational</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span>Database connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span>API services running</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
