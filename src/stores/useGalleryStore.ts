import { create } from "zustand";
import type { GalleryImage } from "../types";
import { siteApi } from "../api/supabaseApi";

interface GalleryState {
  images: GalleryImage[];
  editingImage: GalleryImage | null;
  newImage: Omit<GalleryImage, "id">;
  isLoading: boolean;
  isLoaded: boolean;
  setImages: (images: GalleryImage[]) => void;
  setEditingImage: (image: GalleryImage | null) => void;
  setNewImage: (image: Omit<GalleryImage, "id">) => void;
  addImage: () => boolean;
  updateImage: () => boolean;
  deleteImage: (id: number) => void;
  resetNewImage: () => void;
  loadImages: () => Promise<void>;
}

const defaultNewImage: Omit<GalleryImage, "id"> = {
  url: "",
  alt: "",
  category: "interior",
};

export const useGalleryStore = create<GalleryState>((set, get) => ({
  images: [],
  editingImage: null,
  newImage: defaultNewImage,
  isLoading: false,
  isLoaded: false,

  setImages: (images) => set({ images }),
  setEditingImage: (image) => set({ editingImage: image }),
  setNewImage: (image) => set({ newImage: image }),

  loadImages: async () => {
    if (get().isLoaded || get().isLoading) return;
    
    set({ isLoading: true });
    try {
      const images = await siteApi.getGalleryImages();
      if (images.length > 0) {
        set({ images, isLoaded: true });
      }
    } catch (error) {
      console.error("Failed to load gallery:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addImage: () => {
    const { newImage, images } = get();
    if (!newImage.url || !newImage.alt) return false;

    set({
      images: [...images, { ...newImage, id: Date.now() }],
      newImage: defaultNewImage,
    });
    return true;
  },

  updateImage: () => {
    const { editingImage, images } = get();
    if (!editingImage) return false;

    set({
      images: images.map((image) =>
        image.id === editingImage.id ? editingImage : image
      ),
      editingImage: null,
    });
    return true;
  },

  deleteImage: (id) => {
    set((state) => ({
      images: state.images.filter((image) => image.id !== id),
    }));
  },

  resetNewImage: () => set({ newImage: defaultNewImage }),
}));
