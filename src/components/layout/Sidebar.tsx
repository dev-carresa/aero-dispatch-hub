
import { cn } from '@/lib/utils';
import { SidebarProvider, useSidebar } from './SidebarContext';
import { navigation } from './sidebarNavigation';
import { SidebarItem } from './SidebarItem';
import { SidebarLogo } from './SidebarLogo';
import { MobileToggle, SidebarToggle } from './SidebarToggle';
import { useLayout } from './LayoutContext';
import { useEffect } from 'react';

function SidebarContent() {
  const { expanded, mobileOpen, toggleMobileSidebar, setExpanded } = useSidebar();
  const { layoutSettings } = useLayout();
  
  // Apply compact sidebar setting when it changes
  useEffect(() => {
    if (layoutSettings.compactSidebar && expanded) {
      setExpanded(false);
    }
  }, [layoutSettings.compactSidebar, expanded, setExpanded]);

  return (
    <>
      {/* Mobile menu button */}
      <div className="absolute top-3 left-4 z-40 md:hidden">
        <MobileToggle />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-transform duration-300 md:relative md:z-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          !expanded && 'md:w-16',
          layoutSettings.compactSidebar && 'md:w-16'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <SidebarLogo />
          {/* Unified sidebar toggle button with improved positioning */}
          <div className="flex items-center justify-center">
            <SidebarToggle />
          </div>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="space-y-1 px-2">
            {navigation.map((item) => (
              <SidebarItem key={item.name} item={item} />
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}

export function Sidebar() {
  return (
    <SidebarProvider>
      <SidebarContent />
    </SidebarProvider>
  );
}
