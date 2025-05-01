
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { navigation } from './sidebarNavigation';
import { useAuth } from '@/context/auth/AuthContext';
import { usePermission } from '@/context/permissions';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  useSidebar
} from '@/components/ui/sidebar';

export function Sidebar() {
  const { pathname } = useLocation();
  const { hasPermission, hasAnyPermission } = usePermission();
  const sidebar = useSidebar();
  const { user } = useAuth();

  return (
    <>
      <ShadcnSidebar className="border-r">
        <SidebarRail />
        <SidebarHeader className="flex h-16 items-center border-b px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary text-white flex items-center justify-center font-bold">
              T
            </div>
            <span className="font-semibold">Transport App</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navigation.map((item) => {
              // Check if user has permission to view this item
              const hasAccess =
                !item.permission || hasPermission(item.permission) ||
                (item.permissions && item.permissions.length > 0 && hasAnyPermission(item.permissions));
              
              // If user doesn't have access, don't render the item
              if (!hasAccess) return null;
              
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));
                
              // Filter children based on permissions
              const authorizedChildren = item.children?.filter(
                subItem => !subItem.permission || hasPermission(subItem.permission)
              );
              
              const hasAuthorizedChildren = authorizedChildren && authorizedChildren.length > 0;

              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.name}
                  >
                    <Link to={item.href} className={cn(
                      'flex w-full items-center',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                  
                  {/* Render submenu items if active and has children */}
                  {hasAuthorizedChildren && isActive && (
                    <div className="mt-1 ml-6 space-y-1">
                      {authorizedChildren.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className={cn(
                            'block rounded-md py-2 pl-6 pr-3 text-sm',
                            pathname === subItem.href
                              ? 'font-medium text-primary'
                              : 'text-muted-foreground hover:text-foreground'
                          )}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 text-xs text-muted-foreground">
          {user && <div>Logged in as {user.name}</div>}
        </SidebarFooter>
      </ShadcnSidebar>
    </>
  );
}
