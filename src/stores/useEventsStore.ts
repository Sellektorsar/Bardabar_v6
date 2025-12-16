import { create } from "zustand";
import type { Event } from "../types";
import { siteApi } from "../api/supabaseApi";

interface EventsState {
  events: Event[];
  editingEvent: Event | null;
  newEvent: Omit<Event, "id">;
  isLoading: boolean;
  isLoaded: boolean;
  setEvents: (events: Event[]) => void;
  setEditingEvent: (event: Event | null) => void;
  setNewEvent: (event: Omit<Event, "id">) => void;
  addEvent: () => boolean;
  updateEvent: () => boolean;
  deleteEvent: (id: number) => void;
  resetNewEvent: () => void;
  loadEvents: () => Promise<void>;
}

const defaultNewEvent: Omit<Event, "id"> = {
  title: "",
  date: "",
  time: "",
  description: "",
  image: "",
  type: "Мероприятие",
  price: "",
  isFree: false,
};

export const useEventsStore = create<EventsState>((set, get) => ({
  events: [],
  editingEvent: null,
  newEvent: defaultNewEvent,
  isLoading: false,
  isLoaded: false,

  setEvents: (events) => set({ events }),
  setEditingEvent: (event) => set({ editingEvent: event }),
  setNewEvent: (event) => set({ newEvent: event }),

  loadEvents: async () => {
    if (get().isLoaded || get().isLoading) return;
    
    set({ isLoading: true });
    try {
      const events = await siteApi.getEvents();
      if (events.length > 0) {
        set({ events, isLoaded: true });
      }
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addEvent: () => {
    const { newEvent, events } = get();
    if (!newEvent.title || !newEvent.date || !newEvent.time) return false;

    set({
      events: [...events, { ...newEvent, id: Date.now() }],
      newEvent: defaultNewEvent,
    });
    return true;
  },

  updateEvent: () => {
    const { editingEvent, events } = get();
    if (!editingEvent) return false;

    set({
      events: events.map((event) =>
        event.id === editingEvent.id ? editingEvent : event
      ),
      editingEvent: null,
    });
    return true;
  },

  deleteEvent: (id) => {
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
    }));
  },

  resetNewEvent: () => set({ newEvent: defaultNewEvent }),
}));
