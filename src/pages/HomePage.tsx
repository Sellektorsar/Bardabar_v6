"use client";

import { Hero } from "../../components/Hero";
import { PopularContent } from "../../components/PopularContent";
import type { SiteSettings, MenuItem, Event, Review } from "../types";

interface HomePageProps {
  settings: SiteSettings;
  popularDishes: MenuItem[];
  upcomingEvents: Event[];
  recentReviews: Review[];
  onNavigate: (section: string) => void;
  onShowNewsletter: () => void;
  onBookEvent: () => void;
}

export function HomePage({
  settings,
  popularDishes,
  upcomingEvents,
  recentReviews,
  onNavigate,
  onShowNewsletter,
  onBookEvent,
}: HomePageProps) {
  return (
    <>
      <Hero
        settings={settings}
        onNavigate={onNavigate}
        onShowNewsletter={onShowNewsletter}
      />
      <PopularContent
        popularDishes={popularDishes}
        upcomingEvents={upcomingEvents}
        recentReviews={recentReviews}
        onNavigate={onNavigate}
        onBookEvent={onBookEvent}
      />
    </>
  );
}
