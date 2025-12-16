import { supabase, DbSiteSettings, DbMenuItem, DbEvent, DbGalleryImage, DbTeamMember, DbReview } from "../lib/supabase";
import type { SiteSettings, MenuItem, Event, GalleryImage, TeamMember, Review } from "../types";

// Преобразование данных из БД в формат фронтенда
function mapSettings(db: DbSiteSettings): SiteSettings {
  return {
    cafeName: db.cafe_name,
    phone: db.phone,
    email: db.email || "",
    address: db.address,
    workingHours: formatWorkingHours(db.working_hours),
    description: db.description || "",
    isOpen: db.is_open,
    acceptsReservations: db.accepts_reservations,
  };
}

function formatWorkingHours(hours: Record<string, unknown>): string {
  const general = hours.general as { weekdays?: string; weekend?: string } | undefined;
  if (general) {
    return `${general.weekdays || ""}, ${general.weekend || ""}`.trim();
  }
  return "Вс-Чт: 13:00-23:00, Пт-Сб: 12:00-04:00";
}

function mapMenuItem(db: DbMenuItem): MenuItem {
  return {
    id: db.id,
    name: db.name,
    description: db.description || "",
    price: db.price,
    weight: db.weight || undefined,
    image: db.image || "https://epzjzmvefnlchacvegtk.supabase.co/storage/v1/object/public/images/gallery/food-3.jpg",
    category: db.category,
    isSpecial: db.is_special,
    calories: db.calories || undefined,
    allergens: db.allergens || [],
    isVegetarian: db.is_vegetarian,
    isVegan: db.is_vegan,
  };
}

function mapEvent(db: DbEvent): Event {
  return {
    id: db.id,
    title: db.title,
    date: db.date || "",
    time: db.time || "",
    description: db.description || "",
    image: db.image || "https://epzjzmvefnlchacvegtk.supabase.co/storage/v1/object/public/images/gallery/events-1.jpg",
    type: db.type,
    price: db.price || "Бесплатно",
    isFree: db.is_free,
  };
}

function mapGalleryImage(db: DbGalleryImage): GalleryImage {
  return {
    id: db.id,
    url: db.url,
    alt: db.alt || "",
    category: db.category,
  };
}

function mapTeamMember(db: DbTeamMember): TeamMember {
  return {
    id: db.id,
    name: db.name,
    position: db.position,
    description: db.description || "",
    image: db.image || "https://epzjzmvefnlchacvegtk.supabase.co/storage/v1/object/public/images/gallery/interior-2.jpg",
    speciality: db.speciality || "",
  };
}

function mapReview(db: DbReview): Review {
  return {
    id: db.id,
    name: db.name,
    rating: db.rating,
    comment: db.comment,
    date: db.date,
    avatar: db.avatar || "",
  };
}

// API функции
export const siteApi = {
  async getSettings(): Promise<SiteSettings | null> {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .single();
    
    if (error) {
      console.error("Error fetching settings:", error);
      return null;
    }
    return mapSettings(data);
  },

  async getMenuItems(): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    
    if (error) {
      console.error("Error fetching menu:", error);
      return [];
    }
    return data.map(mapMenuItem);
  },

  async getEvents(): Promise<Event[]> {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("is_active", true)
      .order("id");
    
    if (error) {
      console.error("Error fetching events:", error);
      return [];
    }
    return data.map(mapEvent);
  },

  async getGalleryImages(): Promise<GalleryImage[]> {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    
    if (error) {
      console.error("Error fetching gallery:", error);
      return [];
    }
    return data.map(mapGalleryImage);
  },

  async getTeamMembers(): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    
    if (error) {
      console.error("Error fetching team:", error);
      return [];
    }
    return data.map(mapTeamMember);
  },

  async getReviews(): Promise<Review[]> {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("is_approved", true)
      .order("date", { ascending: false });
    
    if (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
    return data.map(mapReview);
  },
};
