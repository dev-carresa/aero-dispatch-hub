
import React from "react";
import { ThemeSettingsCard } from "./appearance/ThemeSettingsCard";
import { LayoutOptionsCard } from "./appearance/LayoutOptionsCard";
import { useAppearanceSettings } from "./appearance/useAppearanceSettings";

export function AppearanceSettings() {
  const {
    themeSettings,
    layoutSettings,
    isLoading,
    handleThemeSettingChange,
    handleLayoutSettingChange,
    saveAppearanceSettings,
    saveLayoutOptions
  } = useAppearanceSettings();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <ThemeSettingsCard
        themeSettings={themeSettings}
        isLoading={isLoading}
        onSettingChange={handleThemeSettingChange}
        onSave={saveAppearanceSettings}
      />
      <LayoutOptionsCard
        layoutSettings={layoutSettings}
        isLoading={isLoading}
        onSettingChange={handleLayoutSettingChange}
        onSave={saveLayoutOptions}
      />
    </div>
  );
}
