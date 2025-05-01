
import { X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from './SidebarContext';

export function MobileToggle() {
  const { toggleMobileSidebar } = useSidebar();
  
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleMobileSidebar}
      className="h-9 w-9"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}

export function MobileClose() {
  const { toggleMobileSidebar } = useSidebar();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleMobileSidebar}
    >
      <X className="h-5 w-5" />
    </Button>
  );
}

export function DesktopToggle() {
  const { toggleSidebar, expanded } = useSidebar();
  
  return (
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
  );
}
