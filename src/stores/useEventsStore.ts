import { create } from "zustand";
import type { Event } from "../types";
import { defaultEvents } from "../data/defaults";

interface EventsState {
  events: Event[];
  editingEvent: Event | null;
  newEvent: Omit<Event, "id">;
  setEvents: (events: Event[]) => void;
  setEditingEvent: (event: Event | null) => void;
  setNewEvent: (event: Omit<Event, "id">) => void;
  addEvent: () => boolean;
  updateEvent: () => boolean;
  deleteEvent: (id: number) => void;
  resetNewEvent: () => void;
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
  events: defaultEvents,
  editingEvent: null,
  newEvent: defaultNewEvent,

  setEvents: (events) => set({ events }),
  setEditingEvent: (event) => set({ editingEvent: event }),
  setNewEvent: (event) => set({ newEvent: event }),

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
