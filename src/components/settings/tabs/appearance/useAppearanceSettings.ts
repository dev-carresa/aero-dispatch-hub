
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLayout, LayoutSettings } from "@/components/layout/LayoutContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Theme } from "@/components/theme/ThemeProvider";
import { AccentColor, FontSize, useExtendedTheme } from "@/components/theme/ExtendedThemeProvider";

// Define theme settings type to match what's expected in ThemeSettingsCard
interface ThemeSettings {
  colorMode: Theme;
  accentColor: AccentColor;
  fontSize: FontSize;
}

export function useAppearanceSettings() {
  const { user } = useAuth();
  const { layoutSettings, updateLayoutSetting } = useLayout();
  const { setTheme } = useTheme();
  const { setAccentColor, setFontSize } = useExtendedTheme();
  
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    colorMode: "system",
    accentColor: "blue",
    fontSize: "medium",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.getUser();
        
        if (error) throw error;
        
        const savedThemeSettings = data.user?.user_metadata?.theme_settings;
        
        if (savedThemeSettings) {
          const updatedSettings = {
            ...themeSettings,
            ...savedThemeSettings
          };
          
          setThemeSettings(updatedSettings);
          
          // Apply the loaded settings to the theme context
          setTheme(updatedSettings.colorMode);
          setAccentColor(updatedSettings.accentColor);
          setFontSize(updatedSettings.fontSize);
        }
      } catch (error) {
        console.error('Error loading theme settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  // Handle theme setting changes
  const handleThemeSettingChange = useCallback((key: keyof ThemeSettings, value: string) => {
    setThemeSettings(prev => {
      const updatedSettings = {
        ...prev,
        [key]: value
      };
      
      // Apply the changes immediately
      if (key === 'colorMode') {
        setTheme(value as Theme);
      } else if (key === 'accentColor') {
        setAccentColor(value as AccentColor);
      } else if (key === 'fontSize') {
        setFontSize(value as FontSize);
      }
      
      return updatedSettings;
    });
  }, [setTheme, setAccentColor, setFontSize]);

  // Handle layout setting changes
  const handleLayoutSettingChange = useCallback((key: keyof LayoutSettings, value: boolean) => {
    updateLayoutSetting(key, value);
  }, [updateLayoutSetting]);

  // Save theme settings to user metadata
  const saveAppearanceSettings = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          theme_settings: themeSettings
        }
      });

      if (error) throw error;
      
      // Apply settings to theme context
      setTheme(themeSettings.colorMode);
      setAccentColor(themeSettings.accentColor);
      setFontSize(themeSettings.fontSize);
      
      toast.success('Theme settings saved successfully');
    } catch (error) {
      console.error('Error saving theme settings:', error);
      toast.error('Failed to save theme settings');
    } finally {
      setIsLoading(false);
    }
  }, [user, themeSettings, setTheme, setAccentColor, setFontSize]);

  // Save layout settings to user metadata
  const saveLayoutOptions = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          layout_settings: layoutSettings
        }
      });

      if (error) throw error;
      
      toast.success('Layout settings saved successfully');
    } catch (error) {
      console.error('Error saving layout settings:', error);
      toast.error('Failed to save layout settings');
    } finally {
      setIsLoading(false);
    }
  }, [user, layoutSettings]);

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

import { useTheme } from "@/components/theme/ThemeProvider";
