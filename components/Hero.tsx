"use client";

import { Clock, Mail, MapPin, Star } from "lucide-react";

import type { SiteSettings, MenuItem, Event, Review } from "../src/types";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";

// Custom VK icon component
const VKIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.785 16.241s.288-.032.436-.193c.136-.148.131-.425.131-.425s-.019-1.297.582-1.488c.593-.188 1.353 1.254 2.158 1.807.611.419 1.075.327 1.075.327l2.158-.03s1.13-.07.594-.958c-.044-.072-.31-.653-1.597-1.847-1.347-1.25-1.167-.996.456-3.051.988-1.25 1.382-2.013 1.259-2.34-.117-.312-.84-.23-.84-.23l-2.432.015s-.18-.025-.313.055c-.131.079-.215.263-.215.263s-.387.103-.759 2.42c-.789 1.807-1.105 1.904-1.235 1.792-.301-.261-.226-1.05-.226-1.61 0-1.751.265-2.48-.517-2.669-.259-.063-.45-.104-1.114-.111-.85-.009-1.569.003-1.976.202-.271.133-.48.428-.353.445.157.021.513.096.701.354.243.333.234.108.234 1.689 0 .356-.064 1.74-.41 1.996-.237.175-.56-.182-1.256-1.818-.356-.913-.625-1.923-.625-1.923s-.052-.207-.145-.318c-.113-.135-.271-.178-.271-.178l-2.316.015s-.347.01-.475.16c-.113.133-.009.409-.009.409s1.816 4.249 3.869 6.38c1.88 1.95 4.014 1.823 4.014 1.823h.968z" />
  </svg>
);

// Custom Telegram icon component
const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.302 1.4-1.123 1.645-2.03 1.026l-2.608-1.956-1.257 1.237c-.139.139-.256.256-.526.256l.188-2.759 4.766-4.308c.207-.184-.045-.287-.32-.103l-5.904 3.716-2.549-.827c-.555-.184-.566-.555.115-.822l9.956-3.838c.462-.154.867.106.713.83z" />
  </svg>
);

interface HeroProps {
  settings: SiteSettings;
  onNavigate: (section: string) => void;
  onShowNewsletter: () => void;
}

interface PopularContentProps {
  popularDishes: MenuItem[];
  upcomingEvents: Event[];
  recentReviews: Review[];
  onNavigate: (section: string) => void;
  onBookEvent: () => void;
}

export function Hero({ settings, onNavigate, onShowNewsletter }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="animate-fade-in space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight text-foreground md:text-6xl">
                Добро пожаловать в
                <span className="block bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {settings.cafeName}
                </span>
              </h1>
              <p className="text-xl leading-relaxed text-muted-foreground">
                {settings.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-orange-500" />
                <span>4.8 рейтинг</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <span>Работаем 09:00-23:00</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-500" />
                <span>Центр города</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={() => onNavigate("menu")}
                className="rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-8 py-3 text-white shadow-lg transition-all duration-300 hover:from-orange-600 hover:to-red-600 hover:shadow-xl"
              >
                Посмотреть меню
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => onNavigate("reservation")}
                className="rounded-xl border-orange-300 px-8 py-3 text-orange-600 transition-all duration-300 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              >
                Забронировать столик
              </Button>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center space-x-4 pt-4">
              <span className="text-sm text-muted-foreground">Мы в соцсетях:</span>
              <div className="flex space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-orange-600"
                >
                  <VKIcon className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-orange-600"
                >
                  <TelegramIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rotate-3 transform overflow-hidden rounded-2xl shadow-2xl transition-transform duration-500 hover:rotate-0">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt={`Интерьер кафе ${settings.cafeName}`}
                className="h-96 w-full object-cover"
              />
            </div>
            <div className="absolute inset-0 scale-105 transform rounded-2xl bg-gradient-to-br from-orange-400/20 to-red-400/20 blur-xl" />
          </div>
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="absolute bottom-8 right-8 z-20">
        <Button
          onClick={onShowNewsletter}
          className="rounded-full bg-orange-600 p-4 text-white shadow-lg hover:bg-orange-700"
        >
          <Mail className="h-5 w-5" />
        </Button>
      </div>

      <div className="absolute right-0 top-0 -z-10 h-96 w-96 rounded-full bg-gradient-to-bl from-orange-200/50 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-gradient-to-tr from-red-200/50 to-transparent blur-3xl" />
    </section>
  );
}
