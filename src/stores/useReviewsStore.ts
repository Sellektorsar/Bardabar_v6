import { create } from "zustand";
import type { Review } from "../types";
import { siteApi } from "../api/supabaseApi";

interface ReviewsState {
  reviews: Review[];
  isLoading: boolean;
  isLoaded: boolean;
  setReviews: (reviews: Review[]) => void;
  loadReviews: () => Promise<void>;
}

export const useReviewsStore = create<ReviewsState>((set, get) => ({
  reviews: [],
  isLoading: false,
  isLoaded: false,

  setReviews: (reviews) => set({ reviews }),

  loadReviews: async () => {
    if (get().isLoaded || get().isLoading) return;
    
    set({ isLoading: true });
    try {
      const reviews = await siteApi.getReviews();
      set({ reviews, isLoaded: true });
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
