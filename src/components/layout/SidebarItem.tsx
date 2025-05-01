
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
    icon: LucideIcon | (() => JSX.Element);
    permission?: Permission;
    permissions?: Permission[];
    children?: Array<{ 
      name: string; 
      href: string; 
      permission?: Permission; 
    }>;
    adminOnly?: boolean;
  };
}

export function SidebarItem({ item }: SidebarItemProps) {
  const { location, expanded, mobileOpen } = useSidebar();
  const { hasPermission, hasAnyPermission, isAdmin } = usePermission();
  
  // Skip rendering if item is admin-only and user is not admin
  if (item.adminOnly && !isAdmin) {
    return null;
  }
  
  // Check if the user has permission to see this item
  if (item.permission && !hasPermission(item.permission)) {
    return null;
  }
  
  // Check if the user has any of the permissions required
  if (item.permissions && !hasAnyPermission(item.permissions)) {
    return null;
  }
  
  const isActive = 
    location.pathname === item.href || 
    (item.href !== '/' && location.pathname.startsWith(item.href));
  
  // Filter children based on permissions
  const authorizedChildren = item.children?.filter((subItem) => {
    return !subItem.permission || hasPermission(subItem.permission);
  });
  
  // If there are no authorized children, don't render them
  const hasAuthorizedChildren = authorizedChildren && authorizedChildren.length > 0;
  
  // Determine icon to display
  const IconComponent = typeof item.icon === 'function' 
    ? item.icon 
    : () => <item.icon className={cn(
        'h-5 w-5 flex-shrink-0',
        isActive ? 'text-primary' : 'text-muted-foreground'
      )} />;
  
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
        <span className={cn(
          'mr-3 flex-shrink-0',
          isActive ? 'text-primary' : 'text-muted-foreground'
        )}>
          <IconComponent />
        </span>
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
