import { create } from "zustand";
import type { MenuItem } from "../types";
import { siteApi } from "../api/supabaseApi";

interface MenuState {
  items: MenuItem[];
  editingItem: MenuItem | null;
  newItem: Omit<MenuItem, "id">;
  isLoading: boolean;
  isLoaded: boolean;
  setItems: (items: MenuItem[]) => void;
  setEditingItem: (item: MenuItem | null) => void;
  setNewItem: (item: Omit<MenuItem, "id">) => void;
  addItem: () => boolean;
  updateItem: () => boolean;
  deleteItem: (id: number) => void;
  resetNewItem: () => void;
  loadItems: () => Promise<void>;
}

const defaultNewItem: Omit<MenuItem, "id"> = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "Горячие блюда",
  isSpecial: false,
  allergens: [],
  calories: 0,
  isVegetarian: false,
  isVegan: false,
};

export const useMenuStore = create<MenuState>((set, get) => ({
  items: [],
  editingItem: null,
  newItem: defaultNewItem,
  isLoading: false,
  isLoaded: false,

  setItems: (items) => set({ items }),
  setEditingItem: (item) => set({ editingItem: item }),
  setNewItem: (item) => set({ newItem: item }),

  loadItems: async () => {
    if (get().isLoaded || get().isLoading) return;
    
    set({ isLoading: true });
    try {
      const items = await siteApi.getMenuItems();
      if (items.length > 0) {
        set({ items, isLoaded: true });
      }
    } catch (error) {
      console.error("Failed to load menu:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: () => {
    const { newItem, items } = get();
    if (!newItem.name || !newItem.price) return false;

    set({
      items: [...items, { ...newItem, id: Date.now() }],
      newItem: defaultNewItem,
    });
    return true;
  },

  updateItem: () => {
    const { editingItem, items } = get();
    if (!editingItem) return false;

    set({
      items: items.map((item) =>
        item.id === editingItem.id ? editingItem : item
      ),
      editingItem: null,
    });
    return true;
  },

  deleteItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },

  resetNewItem: () => set({ newItem: defaultNewItem }),
}));
