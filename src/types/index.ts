// Общие типы для проекта Бардабар

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  isSpecial: boolean;
  allergens?: string[];
  calories?: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  image: string;
  type: string;
  price: string;
  isFree: boolean;
}

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  description: string;
  image: string;
  speciality: string;
}

export interface SiteSettings {
  cafeName: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  description: string;
  isOpen: boolean;
  acceptsReservations: boolean;
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

export interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  category: "interior" | "food" | "events" | "team";
}

export interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  type: "table" | "event";
  createdAt: string;
  date?: string;
  time?: string;
  guests?: number;
  specialRequests?: string;
  eventTitle?: string;
  tickets?: number;
  totalAmount?: number;
  paymentStatus?: "paid" | "pending" | "requires_payment";
  paymentMethod?: "card" | "cash";
}

export interface NavItem {
  id: string;
  label: string;
}
