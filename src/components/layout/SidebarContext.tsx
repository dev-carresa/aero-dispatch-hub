
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type SidebarContextType = {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  location: ReturnType<typeof useLocation>;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState<boolean>(
    localStorage.getItem('sidebarExpanded') !== 'false'
  );
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const location = useLocation();

  const toggleSidebar = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    localStorage.setItem('sidebarExpanded', String(newExpanded));
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <SidebarContext.Provider
      value={{
        expanded,
        setExpanded,
        mobileOpen,
        setMobileOpen,
        toggleSidebar,
        toggleMobileSidebar,
        location
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
