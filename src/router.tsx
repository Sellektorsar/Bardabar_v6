import { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";

// Lazy loaded pages
const HomePage = lazy(() => import("./pages/HomePage").then((m) => ({ default: m.HomePage })));
const MenuPage = lazy(() => import("./pages/MenuPage").then((m) => ({ default: m.MenuPage })));
const GalleryPage = lazy(() => import("./pages/GalleryPage").then((m) => ({ default: m.GalleryPage })));
const EventsPage = lazy(() => import("./pages/EventsPage").then((m) => ({ default: m.EventsPage })));
const ReservationPage = lazy(() => import("./pages/ReservationPage").then((m) => ({ default: m.ReservationPage })));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage").then((m) => ({ default: m.ReviewsPage })));
const AboutPage = lazy(() => import("./pages/AboutPage").then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import("./pages/ContactPage").then((m) => ({ default: m.ContactPage })));
const AdminPage = lazy(() => import("./pages/AdminPage").then((m) => ({ default: m.AdminPage })));

// Loading fallback
function PageLoader() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

// Route paths
export const ROUTES = {
  HOME: "/",
  MENU: "/menu",
  GALLERY: "/gallery",
  EVENTS: "/events",
  RESERVATION: "/reservation",
  REVIEWS: "/reviews",
  ABOUT: "/about",
  CONTACT: "/contact",
  ADMIN: "/admin",
} as const;

// Map old section names to routes
export const sectionToRoute: Record<string, string> = {
  home: ROUTES.HOME,
  menu: ROUTES.MENU,
  gallery: ROUTES.GALLERY,
  events: ROUTES.EVENTS,
  reservation: ROUTES.RESERVATION,
  reviews: ROUTES.REVIEWS,
  about: ROUTES.ABOUT,
  contact: ROUTES.CONTACT,
  admin: ROUTES.ADMIN,
};

// Map routes to section names (for Header active state)
export const routeToSection: Record<string, string> = {
  [ROUTES.HOME]: "home",
  [ROUTES.MENU]: "menu",
  [ROUTES.GALLERY]: "gallery",
  [ROUTES.EVENTS]: "events",
  [ROUTES.RESERVATION]: "reservation",
  [ROUTES.REVIEWS]: "reviews",
  [ROUTES.ABOUT]: "about",
  [ROUTES.CONTACT]: "contact",
  [ROUTES.ADMIN]: "admin",
};

export { PageLoader, Suspense };

// Note: Router is created in App.tsx where we have access to state
// This file exports utilities and lazy-loaded components
export {
  HomePage,
  MenuPage,
  GalleryPage,
  EventsPage,
  ReservationPage,
  ReviewsPage,
  AboutPage,
  ContactPage,
  AdminPage,
};
