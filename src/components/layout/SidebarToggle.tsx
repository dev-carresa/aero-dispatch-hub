
import { ChevronLeft, ChevronRight, X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from './SidebarContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * Mobile toggle button for opening the sidebar
 */
export function MobileToggle() {
  const { toggleMobileSidebar } = useSidebar();
  
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleMobileSidebar}
      className="h-9 w-9 md:hidden"
      aria-label="Open sidebar menu"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}

/**
 * Mobile close button for closing the sidebar
 */
export function MobileClose() {
  const { toggleMobileSidebar } = useSidebar();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleMobileSidebar}
      className="md:hidden"
      aria-label="Close sidebar"
    >
      <X className="h-5 w-5" />
    </Button>
  );
}

/**
 * Desktop toggle button with improved UX/UI
 * Uses chevron icons with proper tooltip and animations
 */
export function DesktopToggle() {
  const { toggleSidebar, expanded } = useSidebar();
  
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden md:flex h-8 w-8 rounded-full transition-all duration-200 hover:bg-accent"
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {expanded ? (
              <ChevronLeft className="h-4 w-4 transition-transform duration-200" />
            ) : (
              <ChevronRight className="h-4 w-4 transition-transform duration-200" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {expanded ? "Collapse sidebar" : "Expand sidebar"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Universal toggle that handles both mobile and desktop scenarios
 * Provides a unified, context-aware experience
 */
export function SidebarToggle() {
  const { expanded, toggleSidebar, mobileOpen, toggleMobileSidebar } = useSidebar();
  
  // On mobile: show X when sidebar is open, Menu when closed
  // On desktop: show chevron based on expanded state
  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMobileSidebar}
        className="md:hidden h-8 w-8 rounded-full"
        aria-label={mobileOpen ? "Close sidebar" : "Open sidebar"}
      >
        {mobileOpen ? (
          <X className="h-4 w-4" />
        ) : (
          <Menu className="h-4 w-4" />
        )}
      </Button>
      
      {/* Desktop toggle with tooltip */}
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hidden md:flex h-8 w-8 rounded-full transition-all duration-200 hover:bg-accent"
              aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              {expanded ? (
                <ChevronLeft className="h-4 w-4 transition-transform duration-200" />
              ) : (
                <ChevronRight className="h-4 w-4 transition-transform duration-200" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {expanded ? "Collapse sidebar" : "Expand sidebar"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
