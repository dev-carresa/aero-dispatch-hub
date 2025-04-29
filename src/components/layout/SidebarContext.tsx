
import { createContext, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface SidebarContextType {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  location: ReturnType<typeof useLocation>;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setExpanded(!expanded);
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
        location,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
