
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, 
  Car, 
  CheckCircle, 
  Clock, 
  DollarSign,
  UserPlus,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function BookingStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <Card className="overflow-hidden hover-scale shadow-sm card-gradient">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Today's Bookings</p>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-2xl font-bold">24</h3>
                <span className="text-xs font-medium text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                  +5%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                5 more than yesterday
              </p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-700" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>80%</span>
            </div>
            <Progress value={80} className="h-1" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden hover-scale shadow-sm card-gradient">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Active Drivers</p>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-2xl font-bold">18</h3>
                <span className="text-xs font-medium text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                  +12%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                3 currently on duty
              </p>
            </div>
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
              <Car className="h-5 w-5 text-green-700" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Capacity</span>
              <span>60%</span>
            </div>
            <Progress value={60} className="h-1" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden hover-scale shadow-sm card-gradient">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Pending Assignments</p>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-2xl font-bold">7</h3>
                <span className="text-xs font-medium text-yellow-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                  +2
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Need immediate attention
              </p>
            </div>
            <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-700" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Priority</span>
              <span>40%</span>
            </div>
            <Progress value={40} className="h-1" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden hover-scale shadow-sm card-gradient">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Completed Today</p>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-2xl font-bold">16</h3>
                <span className="text-xs font-medium text-blue-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                  +3
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                97% completion rate
              </p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-blue-700" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Efficiency</span>
              <span>97%</span>
            </div>
            <Progress value={97} className="h-1" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden hover-scale shadow-sm card-gradient">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">New Customers</p>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-2xl font-bold">5</h3>
                <span className="text-xs font-medium text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                  +2
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +2 from last week
              </p>
            </div>
            <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-indigo-700" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Growth</span>
              <span>25%</span>
            </div>
            <Progress value={25} className="h-1" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden hover-scale shadow-sm card-gradient">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Revenue Today</p>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-2xl font-bold">$2,854</h3>
                <span className="text-xs font-medium text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                  +12%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +12% from yesterday
              </p>
            </div>
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-700" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Target</span>
              <span>85%</span>
            </div>
            <Progress value={85} className="h-1" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
