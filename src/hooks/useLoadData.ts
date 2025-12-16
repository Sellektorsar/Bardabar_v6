import { useEffect } from "react";
import { useSettingsStore } from "../stores/useSettingsStore";
import { useMenuStore } from "../stores/useMenuStore";
import { useEventsStore } from "../stores/useEventsStore";
import { useGalleryStore } from "../stores/useGalleryStore";
import { useReviewsStore } from "../stores/useReviewsStore";

/**
 * Хук для загрузки всех данных из Supabase при старте приложения
 */
export function useLoadData() {
  const loadSettings = useSettingsStore((state) => state.loadSettings);
  const loadMenu = useMenuStore((state) => state.loadItems);
  const loadEvents = useEventsStore((state) => state.loadEvents);
  const loadGallery = useGalleryStore((state) => state.loadImages);
  const loadReviews = useReviewsStore((state) => state.loadReviews);

  useEffect(() => {
    // Загружаем все данные параллельно
    Promise.all([
      loadSettings(),
      loadMenu(),
      loadEvents(),
      loadGallery(),
      loadReviews(),
    ]).catch(console.error);
  }, [loadSettings, loadMenu, loadEvents, loadGallery, loadReviews]);
}
