"use client";

import { Bell, Calendar, Image as ImageIcon, Settings, Users, Utensils } from "lucide-react";

import type {
  MenuItem,
  Event,
  TeamMember,
  SiteSettings,
  GalleryImage,
} from "../../src/types";
import { AdminNotifications } from "../AdminNotifications";
import { BookingManagement } from "../BookingManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import { AdminStaffTab } from "./AdminStaffTab";
import { AdminMenuTab } from "./AdminMenuTab";
import { AdminGalleryTab } from "./AdminGalleryTab";
import { AdminEventsTab } from "./AdminEventsTab";
import { AdminSettingsTab } from "./AdminSettingsTab";

interface AdminProps {
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

export function Admin({
  adminTab,
  onAdminTabChange,
  siteSettings,
  onSiteSettingsChange,
  onSaveSiteSettings,
  teamMembers,
  newTeamMember,
  editingTeamMember,
  onNewTeamMemberChange,
  onEditingTeamMemberChange,
  onAddTeamMember,
  onUpdateTeamMember,
  onDeleteTeamMember,
  menuItems,
  newMenuItem,
  editingMenuItem,
  onNewMenuItemChange,
  onEditingMenuItemChange,
  onAddMenuItem,
  onUpdateMenuItem,
  onDeleteMenuItem,
  events,
  newEvent,
  editingEvent,
  onNewEventChange,
  onEditingEventChange,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  galleryImages,
  newGalleryImage,
  editingGalleryImage,
  onNewGalleryImageChange,
  onEditingGalleryImageChange,
  onAddGalleryImage,
  onUpdateGalleryImage,
  onDeleteGalleryImage,
}: AdminProps) {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-4xl font-bold text-foreground">Админ-панель</h2>
        <p className="text-xl text-muted-foreground">
          Управление контентом сайта кафе "{siteSettings.cafeName}"
        </p>
      </div>

      <Tabs value={adminTab} onValueChange={onAdminTabChange} className="w-full">
        <TabsList className="relative z-10 mb-8 grid w-full grid-cols-7">
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Персонал
          </TabsTrigger>
          <TabsTrigger value="menu" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            Меню
          </TabsTrigger>
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Галерея
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            События
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Бронирования
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Уведомления
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Настройки
          </TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="space-y-6">
          <AdminStaffTab
            teamMembers={teamMembers}
            newTeamMember={newTeamMember}
            editingTeamMember={editingTeamMember}
            onNewTeamMemberChange={onNewTeamMemberChange}
            onEditingTeamMemberChange={onEditingTeamMemberChange}
            onAddTeamMember={onAddTeamMember}
            onUpdateTeamMember={onUpdateTeamMember}
            onDeleteTeamMember={onDeleteTeamMember}
          />
        </TabsContent>

        <TabsContent value="menu" className="space-y-6">
          <AdminMenuTab
            menuItems={menuItems}
            newMenuItem={newMenuItem}
            editingMenuItem={editingMenuItem}
            onNewMenuItemChange={onNewMenuItemChange}
            onEditingMenuItemChange={onEditingMenuItemChange}
            onAddMenuItem={onAddMenuItem}
            onUpdateMenuItem={onUpdateMenuItem}
            onDeleteMenuItem={onDeleteMenuItem}
          />
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          <AdminGalleryTab
            galleryImages={galleryImages}
            newGalleryImage={newGalleryImage}
            editingGalleryImage={editingGalleryImage}
            onNewGalleryImageChange={onNewGalleryImageChange}
            onEditingGalleryImageChange={onEditingGalleryImageChange}
            onAddGalleryImage={onAddGalleryImage}
            onUpdateGalleryImage={onUpdateGalleryImage}
            onDeleteGalleryImage={onDeleteGalleryImage}
          />
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <AdminEventsTab
            events={events}
            newEvent={newEvent}
            editingEvent={editingEvent}
            onNewEventChange={onNewEventChange}
            onEditingEventChange={onEditingEventChange}
            onAddEvent={onAddEvent}
            onUpdateEvent={onUpdateEvent}
            onDeleteEvent={onDeleteEvent}
          />
        </TabsContent>

        <TabsContent value="bookings" className="min-h-[400px]">
          <BookingManagement />
        </TabsContent>

        <TabsContent value="notifications" className="min-h-[400px]">
          <AdminNotifications />
        </TabsContent>

        <TabsContent value="settings">
          <AdminSettingsTab
            siteSettings={siteSettings}
            onSiteSettingsChange={onSiteSettingsChange}
            onSaveSiteSettings={onSaveSiteSettings}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}
