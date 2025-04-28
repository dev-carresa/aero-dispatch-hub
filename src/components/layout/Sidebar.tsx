
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  LucideIcon,
  Users,
  FileText,
  MessageSquare,
  FileInvoice,
  Star,
  MapPin,
  Key,
  Car,
  Settings
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  submenu?: {
    title: string;
    href: string;
  }[];
};

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: Grid2X2,
  },
  {
    title: 'Bookings',
    href: '/bookings',
    icon: Calendar,
    submenu: [
      { title: 'Next 24h', href: '/bookings/next-24h' },
      { title: 'Confirmed', href: '/bookings/confirmed' },
      { title: 'Latest', href: '/bookings/latest' },
      { title: 'All', href: '/bookings/all' },
      { title: 'Completed', href: '/bookings/completed' },
      { title: 'Cancelled', href: '/bookings/cancelled' },
    ]
  },
  {
    title: 'Users',
    href: '/users',
    icon: Users,
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: FileText,
  },
  {
    title: 'Complaints',
    href: '/complaints',
    icon: MessageSquare,
  },
  {
    title: 'Invoices',
    href: '/invoices',
    icon: FileInvoice,
  },
  {
    title: 'Statistics',
    href: '/statistics',
    icon: Grid2X2,
  },
  {
    title: 'Reviews',
    href: '/reviews',
    icon: Star,
  },
  {
    title: 'Meeting Points',
    href: '/meeting-points',
    icon: MapPin,
  },
  {
    title: 'API Users',
    href: '/api-users',
    icon: Key,
  },
  {
    title: 'Vehicles',
    href: '/vehicles',
    icon: Car,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const location = useLocation();

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 h-16">
        {!collapsed && (
          <div className="font-bold text-lg text-eto-800">
            ETO Dispatch
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      <Separator />
      <div className="flex-1 overflow-y-auto py-2">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <React.Fragment key={item.title}>
              {item.submenu ? (
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 font-normal",
                      isActive(item.href) && "bg-sidebar-accent text-sidebar-accent-foreground",
                      collapsed && "justify-center"
                    )}
                    onClick={() => toggleSubmenu(item.title)}
                  >
                    <item.icon className={cn("h-5 w-5", isActive(item.href) && "text-sidebar-primary")} />
                    {!collapsed && (
                      <>
                        <span className="flex-grow text-left">{item.title}</span>
                        <ChevronRight className={cn(
                          "h-4 w-4 transition-transform",
                          openSubmenu === item.title && "rotate-90"
                        )} />
                      </>
                    )}
                  </Button>
                  {!collapsed && openSubmenu === item.title && (
                    <div className="ml-9 space-y-1">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.title}
                          to={subitem.href}
                          className={cn(
                            "block px-3 py-2 rounded-md text-sm",
                            isActive(subitem.href)
                              ? "bg-sidebar-accent text-sidebar-primary"
                              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                          )}
                        >
                          {subitem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link to={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 font-normal",
                      isActive(item.href) && "bg-sidebar-accent text-sidebar-accent-foreground",
                      collapsed && "justify-center"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", isActive(item.href) && "text-sidebar-primary")} />
                    {!collapsed && <span>{item.title}</span>}
                  </Button>
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
    </div>
  );
}
