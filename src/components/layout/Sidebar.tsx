
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SidebarProvider, useSidebar } from './SidebarContext';
import { navigation } from './sidebarNavigation';
import { SidebarItem } from './SidebarItem';
import { SidebarLogo } from './SidebarLogo';
import { MobileToggle, MobileClose, DesktopToggle } from './SidebarToggle';

function SidebarContent() {
  const { expanded, mobileOpen, toggleMobileSidebar } = useSidebar();
  
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
          !expanded && 'md:w-16'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <SidebarLogo />
          <div className="flex gap-1">
            <MobileClose />
            <DesktopToggle />
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
