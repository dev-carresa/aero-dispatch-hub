
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface LayoutSettings {
  fixedHeader: boolean;
  compactSidebar: boolean;
  animations: boolean;
  cardShadows: boolean;
}

interface LayoutContextType {
  layoutSettings: LayoutSettings;
  setLayoutSettings: (settings: LayoutSettings) => void;
  updateLayoutSetting: (key: keyof LayoutSettings, value: boolean) => void;
}

const defaultLayoutSettings: LayoutSettings = {
  fixedHeader: true,
  compactSidebar: false,
  animations: true,
  cardShadows: true
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>(defaultLayoutSettings);

  // Load saved layout settings when component mounts or user changes
  useEffect(() => {
    if (!user) return;

    const fetchLayoutSettings = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        
        if (error) throw error;
        
        const savedLayoutSettings = data.user?.user_metadata?.layout_settings;
        
        if (savedLayoutSettings) {
          setLayoutSettings(prev => ({
            ...prev,
            ...savedLayoutSettings
          }));
          
          // Apply layout settings to the document
          applyLayoutSettings(savedLayoutSettings);
        }
      } catch (error) {
        console.error('Error fetching layout settings:', error);
      }
    };

    fetchLayoutSettings();
  }, [user]);

  // Apply layout settings whenever they change
  useEffect(() => {
    applyLayoutSettings(layoutSettings);
  }, [layoutSettings]);

  const applyLayoutSettings = (settings: LayoutSettings) => {
    document.documentElement.classList.toggle('fixed-header', settings.fixedHeader);
    document.documentElement.classList.toggle('compact-sidebar', settings.compactSidebar);
    document.documentElement.classList.toggle('reduce-motion', !settings.animations);
    document.documentElement.classList.toggle('no-shadows', !settings.cardShadows);
  };

  const updateLayoutSetting = (key: keyof LayoutSettings, value: boolean) => {
    setLayoutSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <LayoutContext.Provider value={{ layoutSettings, setLayoutSettings, updateLayoutSetting }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  
  return context;
}
