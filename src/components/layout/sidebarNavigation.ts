
import { 
  LayoutDashboard, 
  CalendarCheck,
  MessageSquare,
  Users,
  Key,
  Car,
  Plane,
  BarChart,
  MessageCircle,
  ThumbsUp,
  FileText,
  Settings
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
  adminOnly?: boolean;
}

// Core navigation items shown to all users with appropriate permissions
export const coreNavigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, permission: 'dashboard:view' },
  { name: 'Bookings', href: '/bookings', icon: CalendarCheck, permission: 'bookings:view' },
  { name: 'Complaints', href: '/complaints', icon: MessageSquare, permission: 'complaints:view' },
];

// Complete navigation including admin features
export const navigation: NavigationItem[] = [
  ...coreNavigation,
  // Additional items shown only to users with specific permissions
  { 
    name: 'Users', 
    href: '/users', 
    icon: Users, 
    permission: 'users:view',
    adminOnly: true
  },
  { 
    name: 'API Users', 
    href: '/api-users', 
    icon: Key,
    permission: 'api_users:view',
    adminOnly: true
  },
  { 
    name: 'Vehicles', 
    href: '/vehicles', 
    icon: Car,
    permission: 'vehicles:view' 
  },
  { 
    name: 'Meeting Points', 
    href: '/airports', 
    icon: Plane,
    permission: 'airports:view' 
  },
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
  { 
    name: 'Driver Comments', 
    href: '/driver-comments', 
    icon: MessageCircle,
    permission: 'driver_comments:view' 
  },
  { 
    name: 'Quality Reviews', 
    href: '/quality-reviews', 
    icon: ThumbsUp,
    permission: 'quality_reviews:view' 
  },
  { 
    name: 'Invoices', 
    href: '/invoices', 
    icon: FileText,
    permission: 'invoices:view' 
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Settings,
    permission: 'settings:view',
    adminOnly: true
  },
];
