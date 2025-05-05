
import { ThemeProvider } from "./ThemeProvider";
import { ExtendedThemeProvider } from "./ExtendedThemeProvider";
import { ReactNode } from "react";

interface ThemeWrapperProps {
  children: ReactNode;
}

export function ThemeWrapper({ children }: ThemeWrapperProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <ExtendedThemeProvider>
        {children}
      </ExtendedThemeProvider>
    </ThemeProvider>
  );
}
