
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
  Plane
} from 'lucide-react';

export const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Bookings', href: '/bookings', icon: CalendarCheck },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Vehicles', href: '/vehicles', icon: Car },
  { name: 'Airports', href: '/airports', icon: Plane, 
    children: [
      { name: 'All Airports', href: '/airports' },
      { name: 'Meeting Points', href: '/airports/meeting-points' },
    ]
  },
  { name: 'Reports', href: '/reports', icon: BarChart, 
    children: [
      { name: 'Overview', href: '/reports' },
      { name: 'Generate Report', href: '/reports/generate' },
      { name: 'Saved Reports', href: '/reports/saved' },
    ]
  },
  { name: 'Complaints', href: '/complaints', icon: MessageSquare },
  { name: 'Driver Comments', href: '/driver-comments', icon: MessageCircle },
  { name: 'Quality Reviews', href: '/quality-reviews', icon: ThumbsUp },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];
