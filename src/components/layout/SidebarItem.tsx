
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSidebar } from './SidebarContext';
import { usePermission } from '@/context/PermissionContext';
import { LucideIcon } from 'lucide-react';
import { Permission } from '@/lib/permissions';

interface SidebarItemProps {
  item: {
    name: string;
    href: string;
    icon: LucideIcon;
    permission?: Permission;
    permissions?: Permission[];
    children?: Array<{ 
      name: string; 
      href: string; 
      permission?: Permission; 
    }>;
  };
}

export function SidebarItem({ item }: SidebarItemProps) {
  const { location, expanded, mobileOpen } = useSidebar();
  const { hasPermission, hasAnyPermission } = usePermission();
  
  // Access check is now always true
  
  const isActive = 
    location.pathname === item.href || 
    (item.href !== '/' && location.pathname.startsWith(item.href));
  
  // All children are now authorized
  const authorizedChildren = item.children;
  
  const hasAuthorizedChildren = authorizedChildren && authorizedChildren.length > 0;
  
  return (
    <div>
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
      
      {/* Submenu items */}
      {hasAuthorizedChildren && (expanded || mobileOpen) && isActive && (
        <div className="mt-1 ml-6 space-y-1">
          {authorizedChildren.map((subItem) => (
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
}
