"use client";

import { Admin } from "../../components/admin/Admin";
import type {
  MenuItem,
  Event,
  TeamMember,
  SiteSettings,
  GalleryImage,
} from "../types";

interface AdminPageProps {
  adminTab: string;
  onAdminTabChange: (tab: string) => void;
  siteSettings: SiteSettings;
  onSiteSettingsChange: (settings: SiteSettings) => void;
  onSaveSiteSettings: () => void;
  // Team members
  teamMembers: TeamMember[];
  newTeamMember: Omit<TeamMember, "id">;
  editingTeamMember: TeamMember | null;
  onNewTeamMemberChange: (member: Omit<TeamMember, "id">) => void;
  onEditingTeamMemberChange: (member: TeamMember | null) => void;
  onAddTeamMember: () => void;
  onUpdateTeamMember: () => void;
  onDeleteTeamMember: (id: number) => void;
  // Menu items
  menuItems: MenuItem[];
  newMenuItem: Omit<MenuItem, "id">;
  editingMenuItem: MenuItem | null;
  onNewMenuItemChange: (item: Omit<MenuItem, "id">) => void;
  onEditingMenuItemChange: (item: MenuItem | null) => void;
  onAddMenuItem: () => void;
  onUpdateMenuItem: () => void;
  onDeleteMenuItem: (id: number) => void;
  // Events
  events: Event[];
  newEvent: Omit<Event, "id">;
  editingEvent: Event | null;
  onNewEventChange: (event: Omit<Event, "id">) => void;
  onEditingEventChange: (event: Event | null) => void;
  onAddEvent: () => void;
  onUpdateEvent: () => void;
  onDeleteEvent: (id: number) => void;
  // Gallery
  galleryImages: GalleryImage[];
  newGalleryImage: Omit<GalleryImage, "id">;
  editingGalleryImage: GalleryImage | null;
  onNewGalleryImageChange: (image: Omit<GalleryImage, "id">) => void;
  onEditingGalleryImageChange: (image: GalleryImage | null) => void;
  onAddGalleryImage: () => void;
  onUpdateGalleryImage: () => void;
  onDeleteGalleryImage: (id: number) => void;
}

export function AdminPage(props: AdminPageProps) {
  return <Admin {...props} />;
}
