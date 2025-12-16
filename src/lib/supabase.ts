import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Типы для таблиц
export interface DbSiteSettings {
  id: number;
  cafe_name: string;
  phone: string;
  phone2: string | null;
  email: string | null;
  address: string;
  working_hours: Record<string, unknown>;
  description: string | null;
  is_open: boolean;
  accepts_reservations: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbMenuItem {
  id: number;
  name: string;
  description: string | null;
  price: string;
  weight: string | null;
  image: string | null;
  category: string;
  is_special: boolean;
  calories: number | null;
  allergens: string[] | null;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DbEvent {
  id: number;
  title: string;
  date: string | null;
  time: string | null;
  description: string | null;
  image: string | null;
  type: string;
  price: string | null;
  is_free: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbGalleryImage {
  id: number;
  url: string;
  alt: string | null;
  category: "interior" | "food" | "events" | "team";
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface DbTeamMember {
  id: number;
  name: string;
  position: string;
  description: string | null;
  image: string | null;
  speciality: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbReview {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string | null;
  is_approved: boolean;
  created_at: string;
}

export interface DbBooking {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  type: "table" | "event";
  date: string | null;
  time: string | null;
  guests: number | null;
  special_requests: string | null;
  event_id: number | null;
  tickets: number | null;
  total_amount: number | null;
  payment_status: "paid" | "pending" | "requires_payment" | null;
  payment_method: "card" | "cash" | null;
  created_at: string;
  updated_at: string;
}
