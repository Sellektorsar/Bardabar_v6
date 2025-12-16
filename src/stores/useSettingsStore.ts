import { create } from "zustand";
import type { SiteSettings } from "../types";
import { siteApi } from "../api/supabaseApi";

// Начальные настройки (используются до загрузки из Supabase)
const initialSettings: SiteSettings = {
  cafeName: "Бар-да-бар",
  phone: "+7 (8452) 35-25-25",
  email: "info@bar-da-bar.ru",
  address: "г. Саратов, ул. Днепропетровская, 2/33",
  workingHours: "Вс-Чт: 13:00-23:00, Пт-Сб: 12:00-04:00",
  description: "Многофункциональный развлекательный центр в Саратове",
  isOpen: true,
  acceptsReservations: true,
};

interface SettingsState {
  settings: SiteSettings;
  isLoading: boolean;
  isLoaded: boolean;
  setSettings: (settings: SiteSettings) => void;
  updateSettings: (partial: Partial<SiteSettings>) => void;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()((set, get) => ({
  settings: initialSettings,
  isLoading: false,
  isLoaded: false,

  setSettings: (settings) => set({ settings }),

  updateSettings: (partial) =>
    set((state) => ({
      settings: { ...state.settings, ...partial },
    })),

  loadSettings: async () => {
    if (get().isLoaded || get().isLoading) return;
    
    set({ isLoading: true });
    try {
      const settings = await siteApi.getSettings();
      if (settings) {
        set({ settings, isLoaded: true });
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
