
// We need to update the Sidebar component to include our new routes

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Users, 
  FileText, 
  Settings, 
  Menu,
  X,
  TrendingUp,
  Car,
  BarChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navigation = [
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
    { name: 'Invoices', href: '/invoices', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="absolute top-3 left-4 z-40 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMobileSidebar}
          className="h-9 w-9"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-transform duration-300 md:relative md:z-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          !expanded && 'md:w-16'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary text-white flex items-center justify-center font-bold">
              T
            </div>
            {expanded && <span className="font-semibold">Transport App</span>}
          </Link>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileSidebar}
              className="md:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hidden md:flex"
            >
              {expanded ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
              )}
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = 
                location.pathname === item.href || 
                (item.href !== '/' && location.pathname.startsWith(item.href));
              
              return (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      'group flex items-center rounded-md px-3 py-2 text-sm font-medium',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'mr-3 h-5 w-5 flex-shrink-0',
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      )}
                    />
                    {(expanded || mobileOpen) && <span>{item.name}</span>}
                  </Link>
                  
                  {/* Submenu items for Reports */}
                  {item.children && (expanded || mobileOpen) && isActive && (
                    <div className="mt-1 ml-6 space-y-1">
                      {item.children.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className={cn(
                            'block rounded-md py-2 pl-6 pr-3 text-sm',
                            location.pathname === subItem.href
                              ? 'font-medium text-primary'
                              : 'text-muted-foreground hover:text-foreground'
                          )}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
