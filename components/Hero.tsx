"use client";

import { Clock, Mail, MapPin, Sparkles, Star } from "lucide-react";

import type { SiteSettings } from "../src/types";
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

export function Hero({ settings, onNavigate, onShowNewsletter }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] animate-float rounded-full bg-gradient-to-bl from-orange-200/40 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] animate-float rounded-full bg-gradient-to-tr from-red-200/40 to-transparent blur-3xl" style={{ animationDelay: "1.5s" }} />
      <div className="absolute left-1/2 top-1/3 -z-10 h-[300px] w-[300px] animate-float rounded-full bg-gradient-to-r from-orange-300/20 to-red-300/20 blur-3xl" style={{ animationDelay: "3s" }} />

      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            {/* Badge */}
            <div className="animate-slide-up inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm text-orange-700 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>Лучшее место в городе</span>
            </div>

            <div className="space-y-4">
              <h1 className="animate-slide-up text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl" style={{ animationDelay: "0.1s" }}>
                Добро пожаловать в
                <span className="gradient-text-animated mt-2 block">
                  {settings.cafeName}
                </span>
              </h1>
              <p className="animate-slide-up max-w-lg text-lg leading-relaxed text-muted-foreground md:text-xl" style={{ animationDelay: "0.2s" }}>
                {settings.description}
              </p>
            </div>

            {/* Stats */}
            <div className="animate-slide-up flex flex-wrap gap-4 text-sm" style={{ animationDelay: "0.3s" }}>
              <div className="group flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 shadow-sm transition-all hover:border-orange-400 hover:shadow-md dark:border-orange-800 dark:bg-gray-900">
                <Star className="h-5 w-5 text-orange-500 transition-transform group-hover:scale-110" />
                <span className="font-semibold text-orange-600">4.8</span>
                <span className="text-gray-600 dark:text-gray-300">рейтинг</span>
              </div>
              <div className="group flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 shadow-sm transition-all hover:border-orange-400 hover:shadow-md dark:border-orange-800 dark:bg-gray-900">
                <Clock className="h-5 w-5 text-orange-500 transition-transform group-hover:scale-110" />
                <span className="text-gray-600 dark:text-gray-300">09:00-23:00</span>
              </div>
              <div className="group flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 shadow-sm transition-all hover:border-orange-400 hover:shadow-md dark:border-orange-800 dark:bg-gray-900">
                <MapPin className="h-5 w-5 text-orange-500 transition-transform group-hover:scale-110" />
                <span className="text-gray-600 dark:text-gray-300">Центр города</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="animate-slide-up flex flex-col gap-4 sm:flex-row" style={{ animationDelay: "0.4s" }}>
              <Button
                size="lg"
                onClick={() => onNavigate("menu")}
                className="glow-on-hover group relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-8 py-6 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-orange-600 hover:to-red-600 hover:shadow-xl"
              >
                <span className="relative z-10">Посмотреть меню</span>
                <div className="absolute inset-0 -z-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 transition-opacity group-hover:opacity-100" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => onNavigate("reservation")}
                className="group rounded-xl border-2 border-orange-300 px-8 py-6 text-lg font-semibold text-orange-600 transition-all duration-300 hover:scale-105 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              >
                <span className="underline-animation">Забронировать столик</span>
              </Button>
            </div>

            {/* Social Media Links */}
            <div className="animate-slide-up flex items-center space-x-4 pt-4" style={{ animationDelay: "0.5s" }}>
              <span className="text-sm text-muted-foreground">Мы в соцсетях:</span>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-muted-foreground transition-all hover:scale-110 hover:bg-orange-100 hover:text-orange-600 dark:hover:bg-orange-900/30"
                  aria-label="Мы ВКонтакте"
                >
                  <VKIcon className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-muted-foreground transition-all hover:scale-110 hover:bg-orange-100 hover:text-orange-600 dark:hover:bg-orange-900/30"
                  aria-label="Мы в Telegram"
                >
                  <TelegramIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-scale-in">
            {/* Main image with 3D effect */}
            <div className="card-3d relative z-10 overflow-hidden rounded-3xl shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt={`Интерьер кафе ${settings.cafeName}`}
                className="h-[400px] w-full object-cover lg:h-[500px]"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              
              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 animate-float rounded-xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm dark:bg-gray-900/90">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="h-8 w-8 rounded-full bg-orange-400" />
                    <div className="h-8 w-8 rounded-full bg-red-400" />
                    <div className="h-8 w-8 rounded-full bg-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">500+ гостей</p>
                    <p className="text-xs text-muted-foreground">в месяц</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements - hidden on mobile to prevent overflow */}
            <div className="absolute -right-4 -top-4 hidden h-24 w-24 animate-bounce-subtle rounded-2xl bg-gradient-to-br from-orange-400 to-red-400 opacity-80 md:block" />
            <div className="absolute -bottom-4 -left-4 hidden h-20 w-20 animate-bounce-subtle rounded-2xl bg-gradient-to-br from-red-400 to-orange-400 opacity-60 md:block" style={{ animationDelay: "1s" }} />
          </div>
        </div>
      </div>

      {/* Newsletter CTA - floating */}
      <div className="absolute bottom-8 right-8 z-20">
        <Button
          onClick={onShowNewsletter}
          className="animate-pulse-glow rounded-full bg-orange-600 p-4 text-white shadow-lg transition-transform hover:scale-110 hover:bg-orange-700"
          aria-label="Подписаться на новости"
        >
          <Mail className="h-5 w-5" />
        </Button>
      </div>


    </section>
  );
}
