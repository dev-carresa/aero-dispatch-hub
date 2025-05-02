
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Users, 
  FileText, 
  Settings, 
  Car,
  BarChart,
  MessageSquare,
  MessageCircle,
  ThumbsUp,
  Plane,
  Key
} from 'lucide-react';
import { Permission } from '@/lib/permissions';

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  permission?: Permission;
  permissions?: Permission[];
  children?: Array<{
    name: string;
    href: string;
    permission?: Permission;
  }>;
}

export const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, permission: 'dashboard:view' },
  { name: 'Bookings', href: '/bookings', icon: CalendarCheck, permission: 'bookings:view' },
  { name: 'Users', href: '/users', icon: Users, permission: 'users:view' },
  { name: 'API Users', href: '/api-users', icon: Key, permission: 'api_users:view' },
  { name: 'Vehicles', href: '/vehicles', icon: Car, permission: 'vehicles:view' },
  { name: 'Meeting Points', href: '/airports', icon: Plane, permission: 'airports:view' },
  { 
    name: 'Reports', 
    href: '/reports', 
    icon: BarChart, 
    permission: 'reports:view',
    children: [
      { name: 'Overview', href: '/reports', permission: 'reports:view' },
      { name: 'Generate Report', href: '/reports/generate', permission: 'reports:create' },
      { name: 'Saved Reports', href: '/reports/saved', permission: 'reports:view' },
    ]
  },
  { name: 'Complaints', href: '/complaints', icon: MessageSquare, permission: 'complaints:view' },
  { name: 'Driver Comments', href: '/driver-comments', icon: MessageCircle, permission: 'driver_comments:view' },
  { name: 'Quality Reviews', href: '/quality-reviews', icon: ThumbsUp, permission: 'quality_reviews:view' },
  { name: 'Invoices', href: '/invoices', icon: FileText, permission: 'invoices:view' },
  { name: 'Settings', href: '/settings', icon: Settings, permission: 'settings:view' },
];
