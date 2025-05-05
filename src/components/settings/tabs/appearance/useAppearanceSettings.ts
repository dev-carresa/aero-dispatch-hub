
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/components/theme/ThemeProvider";
import { 
  useExtendedTheme, 
  AccentColor, 
  FontSize 
} from "@/components/theme/ExtendedThemeProvider";
import { toast } from "sonner";
import { Theme } from "@/components/theme/ThemeProvider";

export function useAppearanceSettings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { accentColor, fontSize, setAccentColor, setFontSize } = useExtendedTheme();
  const [isLoading, setIsLoading] = useState(false);
  
  const [themeSettings, setThemeSettings] = useState({
    colorMode: theme || "light",
    accentColor: accentColor,
    fontSize: fontSize
  });

  const [layoutSettings, setLayoutSettings] = useState({
    fixedHeader: true,
    compactSidebar: false,
    animations: true,
    cardShadows: true
  });

  // Load saved settings when component mounts
  useEffect(() => {
    fetchAppearanceSettings();
  }, [user]);

  const fetchAppearanceSettings = async () => {
    if (!user) return;

    try {
      // Try to get saved settings from user metadata
      const { data, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      const savedThemeSettings = data.user?.user_metadata?.theme_settings;
      const savedLayoutSettings = data.user?.user_metadata?.layout_settings;
      
      // Update state with saved settings or defaults
      if (savedThemeSettings) {
        setThemeSettings(prevSettings => ({
          ...prevSettings,
          ...savedThemeSettings
        }));
        
        // Update theme provider state if color mode is saved
        if (savedThemeSettings.colorMode) {
          setTheme(savedThemeSettings.colorMode as Theme);
        }
        
        // Update extended theme provider with saved accent color and font size
        if (savedThemeSettings.accentColor) {
          setAccentColor(savedThemeSettings.accentColor as AccentColor);
        }
        
        if (savedThemeSettings.fontSize) {
          setFontSize(savedThemeSettings.fontSize as FontSize);
        }
      }
      
      if (savedLayoutSettings) {
        setLayoutSettings(prevSettings => ({
          ...prevSettings,
          ...savedLayoutSettings
        }));
      }
      
    } catch (error) {
      console.error('Error fetching appearance settings:', error);
    }
  };

  const handleThemeSettingChange = (setting: string, value: string) => {
    setThemeSettings(prev => ({ ...prev, [setting]: value }));
    
    // If changing color mode, update theme provider immediately
    if (setting === 'colorMode') {
      setTheme(value as Theme);
    }
    
    // If changing accent color, update extended theme provider immediately
    if (setting === 'accentColor') {
      setAccentColor(value as AccentColor);
    }
    
    // If changing font size, update extended theme provider immediately
    if (setting === 'fontSize') {
      setFontSize(value as FontSize);
    }
  };

  const handleLayoutSettingChange = (setting: string, value: boolean) => {
    setLayoutSettings(prev => ({ ...prev, [setting]: value }));
    
    // Apply layout changes immediately
    if (setting === 'animations') {
      document.documentElement.classList.toggle('reduce-motion', !value);
    }
    
    if (setting === 'cardShadows') {
      document.documentElement.classList.toggle('no-shadows', !value);
    }
  };

  const saveAppearanceSettings = async () => {
    if (!user) {
      toast.error("You must be logged in to save settings");
      return;
    }
    
    setIsLoading(true);
    try {
      // Save theme settings to user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          theme_settings: themeSettings
        }
      });
      
      if (error) throw error;
      
      // Apply theme settings globally
      setTheme(themeSettings.colorMode as Theme);
      setAccentColor(themeSettings.accentColor as AccentColor);
      setFontSize(themeSettings.fontSize as FontSize);
      
      toast.success("Appearance settings saved successfully!");
    } catch (error) {
      console.error('Error saving appearance settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const saveLayoutOptions = async () => {
    if (!user) {
      toast.error("You must be logged in to save settings");
      return;
    }
    
    setIsLoading(true);
    try {
      // Save layout settings to user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          layout_settings: layoutSettings
        }
      });
      
      if (error) throw error;
      
      // Apply relevant layout settings
      document.documentElement.classList.toggle('reduce-motion', !layoutSettings.animations);
      document.documentElement.classList.toggle('no-shadows', !layoutSettings.cardShadows);
      
      toast.success("Layout options saved successfully!");
    } catch (error) {
      console.error('Error saving layout options:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    themeSettings,
    layoutSettings,
    isLoading,
    handleThemeSettingChange,
    handleLayoutSettingChange,
    saveAppearanceSettings,
    saveLayoutOptions
  };
}
