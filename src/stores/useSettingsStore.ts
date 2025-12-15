import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SiteSettings } from "../types";
import { defaultSiteSettings } from "../data/defaults";

interface SettingsState {
  settings: SiteSettings;
  isDarkMode: boolean;
  setSettings: (settings: SiteSettings) => void;
  updateSettings: (partial: Partial<SiteSettings>) => void;
  toggleDarkMode: () => void;
  saveSettings: () => boolean;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: defaultSiteSettings,
      isDarkMode: false,

      setSettings: (settings) => set({ settings }),

      updateSettings: (partial) =>
        set((state) => ({
          settings: { ...state.settings, ...partial },
        })),

      toggleDarkMode: () => {
        set((state) => ({ isDarkMode: !state.isDarkMode }));
        document.documentElement.classList.toggle("dark");
      },

      saveSettings: (): boolean => {
        const { settings } = get();
        try {
          localStorage.setItem("site_settings", JSON.stringify(settings));
          return true;
        } catch (e) {
          console.error("Failed to save settings:", e);
          return false;
        }
      },
    }),
    {
      name: "settings-storage",
      partialize: (state) => ({
        settings: state.settings,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);
