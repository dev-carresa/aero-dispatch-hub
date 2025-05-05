
import { ThemeProvider } from "./ThemeProvider";
import { ExtendedThemeProvider } from "./ExtendedThemeProvider";
import { LayoutProvider } from "../layout/LayoutContext";
import { ReactNode } from "react";

interface ThemeWrapperProps {
  children: ReactNode;
}

export function ThemeWrapper({ children }: ThemeWrapperProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <ExtendedThemeProvider>
        <LayoutProvider>
          {children}
        </LayoutProvider>
      </ExtendedThemeProvider>
    </ThemeProvider>
  );
}
