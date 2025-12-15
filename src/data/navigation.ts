import type { NavItem } from "../types";

export const navItems: NavItem[] = [
  { id: "home", label: "Главная" },
  { id: "menu", label: "Меню" },
  { id: "gallery", label: "Галерея" },
  { id: "events", label: "Мероприятия" },
  { id: "reservation", label: "Бронирование" },
  { id: "reviews", label: "Отзывы" },
  { id: "about", label: "О нас" },
  { id: "contact", label: "Контакты" },
  { id: "admin", label: "Админ" },
];

export const menuCategories = [
  "Горячие блюда",
  "Салаты",
  "Напитки",
  "Десерты",
];

export const eventTypes = [
  "Музыка",
  "Мастер-класс",
  "Праздник",
  "Кулинария",
  "Мероприятие",
];

export const galleryCategories = ["interior", "food", "events", "team"] as const;
