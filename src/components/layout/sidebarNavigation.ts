
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Users, 
  FileText, 
  Settings, 
  Car,
  BarChart,
  MessageSquare,
  MessageCircle
} from 'lucide-react';

export const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Bookings', href: '/bookings', icon: CalendarCheck },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Vehicles', href: '/vehicles', icon: Car },
  { name: 'Reports', href: '/reports', icon: BarChart, 
    children: [
      { name: 'Overview', href: '/reports' },
      { name: 'Generate Report', href: '/reports/generate' },
      { name: 'Saved Reports', href: '/reports/saved' },
    ]
  },
  { name: 'Complaints', href: '/complaints', icon: MessageSquare },
  { name: 'Driver Comments', href: '/driver-comments', icon: MessageCircle },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];
