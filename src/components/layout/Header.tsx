
import { Link } from 'react-router-dom';
import { 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Search,
  Plus,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

export function Header() {
  return (
    <div className="flex flex-col">
      <div className="bg-blue-50 px-4 py-2 text-sm text-blue-700 border-b border-blue-100">
        <div className="container mx-auto flex items-center">
          <HelpCircle className="h-4 w-4 mr-2" />
          <p>Welcome to the new interface! Check out our updated features and improved navigation.</p>
        </div>
      </div>
      
      <header className="border-b bg-white dark:bg-gray-950 p-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search bookings, users..."
              className="pl-9 w-[240px] lg:w-[320px] bg-gray-50 border-gray-100"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link to="/bookings/new">
            <Button size="sm" className="hidden sm:flex gap-1 bg-primary hover:bg-primary/90 shadow-sm">
              <Plus className="h-4 w-4" />
              New Booking
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                <div className="p-3 hover:bg-muted/50 cursor-pointer">
                  <p className="font-medium text-sm">New Booking Created</p>
                  <p className="text-xs text-muted-foreground">JFK to Manhattan - REF: B12345</p>
                  <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                </div>
                <div className="p-3 hover:bg-muted/50 cursor-pointer">
                  <p className="font-medium text-sm">Driver Assigned</p>
                  <p className="text-xs text-muted-foreground">John Smith assigned to B54321</p>
                  <p className="text-xs text-muted-foreground mt-1">10 minutes ago</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/notifications">View all notifications</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-sm">
                  AD
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Admin User</DropdownMenuLabel>
              <DropdownMenuItem className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 text-red-500">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  );
}
