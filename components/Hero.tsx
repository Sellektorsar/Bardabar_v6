"use client";

import { Clock, MapPin, Star } from "lucide-react";

import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";

interface HeroProps {
  setActiveSection: (section: string) => void;
}

export function Hero({ setActiveSection }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="animate-fade-in space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight text-foreground md:text-6xl">
                Добро пожаловать в
                <span className="block bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Бар-да-бар
                </span>
              </h1>
              <p className="text-xl leading-relaxed text-muted-foreground">
                Уютное кафе в самом сердце города, где встречаются традиции и современность.
                Попробуйте наши фирменные блюда и насладитесь атмосферой домашнего уюта.
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
                onClick={() => setActiveSection("menu")}
                className="rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-8 py-3 text-white shadow-lg transition-all duration-300 hover:from-orange-600 hover:to-red-600 hover:shadow-xl"
              >
                Посмотреть меню
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setActiveSection("reservation")}
                className="rounded-xl border-orange-300 px-8 py-3 text-orange-600 transition-all duration-300 hover:bg-orange-50"
              >
                Забронировать столик
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rotate-3 transform overflow-hidden rounded-2xl shadow-2xl transition-transform duration-500 hover:rotate-0">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Интерьер кафе Бар-да-бар"
                className="h-96 w-full object-cover"
              />
            </div>
            <div className="absolute inset-0 scale-105 transform rounded-2xl bg-gradient-to-br from-orange-400/20 to-red-400/20 blur-xl" />
          </div>
        </div>
      </div>

      <div className="absolute right-0 top-0 -z-10 h-96 w-96 rounded-full bg-gradient-to-bl from-orange-200/50 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-gradient-to-tr from-red-200/50 to-transparent blur-3xl" />
    </section>
  );
}
