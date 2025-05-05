
import React, { createContext, useContext, useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

// Define the available accent colors and font sizes
export type AccentColor = "blue" | "purple" | "pink" | "orange" | "green" | "gray";
export type FontSize = "small" | "medium" | "large";

type ExtendedThemeProviderState = {
  accentColor: AccentColor;
  fontSize: FontSize;
  setAccentColor: (color: AccentColor) => void;
  setFontSize: (size: FontSize) => void;
};

const initialState: ExtendedThemeProviderState = {
  accentColor: "blue",
  fontSize: "medium",
  setAccentColor: () => null,
  setFontSize: () => null,
};

const ExtendedThemeContext = createContext<ExtendedThemeProviderState>(initialState);

export function ExtendedThemeProvider({ children }: { children: React.ReactNode }) {
  const [accentColor, setAccentColorState] = useState<AccentColor>("blue");
  const [fontSize, setFontSizeState] = useState<FontSize>("medium");
  
  // Load saved preferences from localStorage
  useEffect(() => {
    const savedAccentColor = localStorage.getItem("ui-accent-color") as AccentColor | null;
    const savedFontSize = localStorage.getItem("ui-font-size") as FontSize | null;
    
    if (savedAccentColor) setAccentColorState(savedAccentColor);
    if (savedFontSize) setFontSizeState(savedFontSize);
  }, []);
  
  // Apply the accent color CSS variables when they change
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentColor);
    applyAccentColorVariables(accentColor);
    localStorage.setItem("ui-accent-color", accentColor);
  }, [accentColor]);
  
  // Apply the font size CSS variables when they change
  useEffect(() => {
    document.documentElement.style.setProperty('--font-size', fontSize);
    applyFontSizeVariables(fontSize);
    localStorage.setItem("ui-font-size", fontSize);
  }, [fontSize]);
  
  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
  };
  
  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
  };
  
  const value = {
    accentColor,
    fontSize,
    setAccentColor,
    setFontSize,
  };
  
  return (
    <ExtendedThemeContext.Provider value={value}>
      {children}
    </ExtendedThemeContext.Provider>
  );
}

export const useExtendedTheme = () => {
  const context = useContext(ExtendedThemeContext);
  
  if (context === undefined)
    throw new Error("useExtendedTheme must be used within an ExtendedThemeProvider");
  
  return context;
};

// Helper function to apply accent color CSS variables
function applyAccentColorVariables(color: AccentColor) {
  const root = document.documentElement;
  
  // Define color hex values
  const colorValues = {
    blue: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      500: '#3B82F6',
      600: '#2563EB',
      700: '#1D4ED8',
    },
    purple: {
      50: '#FAF5FF',
      100: '#F3E8FF',
      500: '#A855F7',
      600: '#9333EA',
      700: '#7E22CE',
    },
    pink: {
      50: '#FDF2F8',
      100: '#FCE7F3',
      500: '#EC4899',
      600: '#DB2777',
      700: '#BE185D',
    },
    orange: {
      50: '#FFF7ED',
      100: '#FFEDD5',
      500: '#F97316',
      600: '#EA580C',
      700: '#C2410C',
    },
    green: {
      50: '#ECFDF5',
      100: '#D1FAE5',
      500: '#10B981',
      600: '#059669',
      700: '#047857',
    },
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
    }
  };
  
  // Set CSS variables based on selected color
  const selectedColor = colorValues[color];
  root.style.setProperty('--icon-color', selectedColor[600]);
  root.style.setProperty('--icon-hover-color', selectedColor[700]);
  root.style.setProperty('--button-bg-color', selectedColor[500]);
  root.style.setProperty('--button-hover-bg-color', selectedColor[600]);
  root.style.setProperty('--link-color', selectedColor[500]);
  root.style.setProperty('--link-hover-color', selectedColor[600]);
  
  // Update primary color CSS variables in the theme
  root.style.setProperty('--primary', colorHSL(color));
  root.style.setProperty('--ring', colorHSL(color));
}

// Helper function to apply font size CSS variables
function applyFontSizeVariables(size: FontSize) {
  const root = document.documentElement;
  
  // Set icon sizes based on selected font size
  switch (size) {
    case 'small':
      root.style.setProperty('--icon-size-sm', '0.875rem');  // 14px
      root.style.setProperty('--icon-size-md', '1rem');      // 16px
      root.style.setProperty('--icon-size-lg', '1.25rem');   // 20px
      break;
    case 'medium':
      root.style.setProperty('--icon-size-sm', '1rem');      // 16px
      root.style.setProperty('--icon-size-md', '1.25rem');   // 20px
      root.style.setProperty('--icon-size-lg', '1.5rem');    // 24px
      break;
    case 'large':
      root.style.setProperty('--icon-size-sm', '1.25rem');   // 20px
      root.style.setProperty('--icon-size-md', '1.5rem');    // 24px
      root.style.setProperty('--icon-size-lg', '1.75rem');   // 28px
      break;
  }
  
  // Set text sizes based on selected font size
  switch (size) {
    case 'small':
      root.classList.add('text-size-small');
      root.classList.remove('text-size-medium', 'text-size-large');
      break;
    case 'medium':
      root.classList.add('text-size-medium');
      root.classList.remove('text-size-small', 'text-size-large');
      break;
    case 'large':
      root.classList.add('text-size-large');
      root.classList.remove('text-size-small', 'text-size-medium');
      break;
  }
}

// Helper function to convert color names to HSL values for CSS variables
function colorHSL(color: AccentColor) {
  // Return HSL values that match the colors in tailwind.config.ts
  switch (color) {
    case 'blue': return '221 83% 53%';
    case 'purple': return '270 71% 65%';
    case 'pink': return '330 81% 60%';
    case 'orange': return '24 94% 53%';
    case 'green': return '158 64% 39%';
    case 'gray': return '220 14% 46%';
    default: return '221 83% 53%'; // Default blue
  }
}
