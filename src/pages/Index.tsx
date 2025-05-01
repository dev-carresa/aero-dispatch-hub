
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="py-8 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Transport Management System</h1>
        <p className="text-xl text-gray-600">Manage your fleet, bookings, and customers in one place</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
            <CardDescription>Manage all your customer bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">View, create, and edit bookings. Assign drivers and track status.</p>
            <Link to="/bookings">
              <Button className="w-full">
                Go to Bookings <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Fleet Management</CardTitle>
            <CardDescription>Manage your vehicles and drivers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Access information about your vehicles, drivers, and maintenance.</p>
            <Link to="/vehicles">
              <Button className="w-full">
                Go to Vehicles <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>View key performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Get insights into bookings, revenue, and driver performance.</p>
            <Link to="/dashboard">
              <Button className="w-full">
                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
