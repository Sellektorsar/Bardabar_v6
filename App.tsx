"use client";

import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { NewsletterModal } from "./components/NewsletterModal";

import { ROUTES, sectionToRoute, routeToSection } from "./src/router";
import {
  useSettingsStore,
  useMenuStore,
  useEventsStore,
  useTeamStore,
  useGalleryStore,
  useReviewsStore,
} from "./src/stores";
import { Toaster } from "./components/ui/sonner";
import { useLoadData } from "./src/hooks/useLoadData";

// Lazy loaded pages
const HomePage = lazy(() =>
  import("./src/pages/HomePage").then((m) => ({ default: m.HomePage }))
);
const MenuPage = lazy(() =>
  import("./src/pages/MenuPage").then((m) => ({ default: m.MenuPage }))
);
const GalleryPage = lazy(() =>
  import("./src/pages/GalleryPage").then((m) => ({ default: m.GalleryPage }))
);
const EventsPage = lazy(() =>
  import("./src/pages/EventsPage").then((m) => ({ default: m.EventsPage }))
);
const ReservationPage = lazy(() =>
  import("./src/pages/ReservationPage").then((m) => ({ default: m.ReservationPage }))
);
const ReviewsPage = lazy(() =>
  import("./src/pages/ReviewsPage").then((m) => ({ default: m.ReviewsPage }))
);
const AboutPage = lazy(() =>
  import("./src/pages/AboutPage").then((m) => ({ default: m.AboutPage }))
);
const ContactPage = lazy(() =>
  import("./src/pages/ContactPage").then((m) => ({ default: m.ContactPage }))
);
const AdminPage = lazy(() =>
  import("./src/pages/AdminPage").then((m) => ({ default: m.AdminPage }))
);

// Loading fallback
function PageLoader() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Загрузка данных из Supabase
  useLoadData();

  // Zustand stores
  const { settings, setSettings } = useSettingsStore();
  const menuStore = useMenuStore();
  const eventsStore = useEventsStore();
  const teamStore = useTeamStore();
  const galleryStore = useGalleryStore();

  // Reviews store
  const { reviews } = useReviewsStore();

  // Local state (не в stores)
  const [adminTab, setAdminTab] = useState("staff");
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  // Get active section from current route
  const activeSection = routeToSection[location.pathname] || "home";

  // Navigation using React Router
  const handleNavClick = (sectionId: string) => {
    const route = sectionToRoute[sectionId] || ROUTES.HOME;
    navigate(route);
  };

  const handleBooking = () => {
    toast.success(
      "Спасибо за интерес! Свяжитесь с нами по телефону +7 (495) 123-45-67 для бронирования.",
    );
  };

  // Popular content for preview section
  const popularDishes = menuStore.items.filter((item: { isSpecial?: boolean }) => item.isSpecial).slice(0, 3);
  const upcomingEvents = eventsStore.events.slice(0, 2);
  const recentReviews = reviews.slice(0, 2);

  // Handlers with toast notifications
  const handleAddMenuItem = () => {
    if (menuStore.addItem()) {
      toast.success("Блюдо добавлено в меню");
    } else {
      toast.error("Заполните название и цену");
    }
  };

  const handleUpdateMenuItem = () => {
    if (menuStore.updateItem()) {
      toast.success("Блюдо обновлено");
    }
  };

  const handleDeleteMenuItem = (id: number) => {
    menuStore.deleteItem(id);
    toast.success("Блюдо удалено из меню");
  };

  const handleAddEvent = () => {
    if (eventsStore.addEvent()) {
      toast.success("Мероприятие добавлено");
    } else {
      toast.error("Заполните название, дату и время");
    }
  };

  const handleUpdateEvent = () => {
    if (eventsStore.updateEvent()) {
      toast.success("Мероприятие обновлено");
    }
  };

  const handleDeleteEvent = (id: number) => {
    eventsStore.deleteEvent(id);
    toast.success("Мероприятие удалено");
  };

  const handleAddTeamMember = () => {
    if (teamStore.addMember()) {
      toast.success("Сотрудник добавлен");
    } else {
      toast.error("Заполните имя и должность");
    }
  };

  const handleUpdateTeamMember = () => {
    if (teamStore.updateMember()) {
      toast.success("Данные сотрудника обновлены");
    }
  };

  const handleDeleteTeamMember = (id: number) => {
    teamStore.deleteMember(id);
    toast.success("Сотрудник удален");
  };

  const handleAddGalleryImage = () => {
    if (galleryStore.addImage()) {
      toast.success("Изображение добавлено в галерею");
    } else {
      toast.error("Заполните URL и описание изображения");
    }
  };

  const handleUpdateGalleryImage = () => {
    if (galleryStore.updateImage()) {
      toast.success("Изображение обновлено");
    }
  };

  const handleDeleteGalleryImage = (id: number) => {
    galleryStore.deleteImage(id);
    toast.success("Изображение удалено из галереи");
  };

  const handleSaveSiteSettings = () => {
    // TODO: Сохранение в Supabase
    toast.success("Настройки сайта сохранены");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        activeSection={activeSection}
        onNavClick={handleNavClick}
        cafeName={settings.cafeName}
      />
      <main className="transition-all duration-500 ease-in-out">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route
              path={ROUTES.HOME}
              element={
                <HomePage
                  settings={settings}
                  popularDishes={popularDishes}
                  upcomingEvents={upcomingEvents}
                  recentReviews={recentReviews}
                  onNavigate={handleNavClick}
                  onShowNewsletter={() => setShowNewsletterModal(true)}
                  onBookEvent={handleBooking}
                />
              }
            />
            <Route path={ROUTES.MENU} element={<MenuPage />} />
            <Route
              path={ROUTES.GALLERY}
              element={<GalleryPage images={galleryStore.images} />}
            />
            <Route path={ROUTES.EVENTS} element={<EventsPage />} />
            <Route
              path={ROUTES.RESERVATION}
              element={
                <ReservationPage
                  acceptsReservations={settings.acceptsReservations}
                />
              }
            />
            <Route
              path={ROUTES.REVIEWS}
              element={<ReviewsPage reviews={reviews} />}
            />
            <Route
              path={ROUTES.ABOUT}
              element={
                <AboutPage
                  cafeName={settings.cafeName}
                  teamMembers={teamStore.members}
                />
              }
            />
            <Route
              path={ROUTES.CONTACT}
              element={<ContactPage settings={settings} />}
            />
            <Route
              path={ROUTES.ADMIN}
              element={
                <AdminPage
                  adminTab={adminTab}
                  onAdminTabChange={setAdminTab}
                  siteSettings={settings}
                  onSiteSettingsChange={setSettings}
                  onSaveSiteSettings={handleSaveSiteSettings}
                  // Team members
                  teamMembers={teamStore.members}
                  newTeamMember={teamStore.newMember}
                  editingTeamMember={teamStore.editingMember}
                  onNewTeamMemberChange={teamStore.setNewMember}
                  onEditingTeamMemberChange={teamStore.setEditingMember}
                  onAddTeamMember={handleAddTeamMember}
                  onUpdateTeamMember={handleUpdateTeamMember}
                  onDeleteTeamMember={handleDeleteTeamMember}
                  // Menu items
                  menuItems={menuStore.items}
                  newMenuItem={menuStore.newItem}
                  editingMenuItem={menuStore.editingItem}
                  onNewMenuItemChange={menuStore.setNewItem}
                  onEditingMenuItemChange={menuStore.setEditingItem}
                  onAddMenuItem={handleAddMenuItem}
                  onUpdateMenuItem={handleUpdateMenuItem}
                  onDeleteMenuItem={handleDeleteMenuItem}
                  // Events
                  events={eventsStore.events}
                  newEvent={eventsStore.newEvent}
                  editingEvent={eventsStore.editingEvent}
                  onNewEventChange={eventsStore.setNewEvent}
                  onEditingEventChange={eventsStore.setEditingEvent}
                  onAddEvent={handleAddEvent}
                  onUpdateEvent={handleUpdateEvent}
                  onDeleteEvent={handleDeleteEvent}
                  // Gallery
                  galleryImages={galleryStore.images}
                  newGalleryImage={galleryStore.newImage}
                  editingGalleryImage={galleryStore.editingImage}
                  onNewGalleryImageChange={galleryStore.setNewImage}
                  onEditingGalleryImageChange={galleryStore.setEditingImage}
                  onAddGalleryImage={handleAddGalleryImage}
                  onUpdateGalleryImage={handleUpdateGalleryImage}
                  onDeleteGalleryImage={handleDeleteGalleryImage}
                />
              }
            />
          </Routes>
        </Suspense>
      </main>
      <Footer settings={settings} onNavClick={handleNavClick} />
      <NewsletterModal
        isOpen={showNewsletterModal}
        onClose={() => setShowNewsletterModal(false)}
      />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
