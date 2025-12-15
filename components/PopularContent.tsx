"use client";

import {
  Calendar,
  ChevronRight,
  Clock,
  Eye,
  Music,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";

import type { MenuItem, Event, Review } from "../src/types";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

// Custom Quote icon (lucide doesn't have Quote)
const Quote = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
  </svg>
);

// Custom MessageCircle icon
const MessageCircle = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

interface PopularContentProps {
  popularDishes: MenuItem[];
  upcomingEvents: Event[];
  recentReviews: Review[];
  onNavigate: (section: string) => void;
  onBookEvent: () => void;
}

export function PopularContent({
  popularDishes,
  upcomingEvents,
  recentReviews,
  onNavigate,
  onBookEvent,
}: PopularContentProps) {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-orange-500" />
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-1 text-white">
              Популярное
            </Badge>
            <Sparkles className="h-6 w-6 text-orange-500" />
          </div>
          <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Лучшее в нашем кафе
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            Откройте для себя наши самые популярные блюда, предстоящие события и мнения гостей
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Popular Dishes */}
          <div className="space-y-6">
            <div className="mb-6 flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-foreground">Хиты меню</h3>
            </div>
            <div className="space-y-4">
              {popularDishes.map((dish) => (
                <Card
                  key={dish.id}
                  className="group overflow-hidden border-orange-100 transition-all duration-300 hover:scale-105 hover:shadow-xl dark:border-gray-700"
                >
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="relative h-24 w-24 overflow-hidden">
                        <ImageWithFallback
                          src={dish.image}
                          alt={dish.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute left-2 top-2">
                          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-xs text-white">
                            ХИТ
                          </Badge>
                        </div>
                      </div>
                      <div className="flex-1 p-4">
                        <h4 className="mb-1 font-semibold text-foreground">{dish.name}</h4>
                        <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                          {dish.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-orange-600">{dish.price} ₽</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onNavigate("menu")}
                            className="text-xs"
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            Смотреть
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
              onClick={() => onNavigate("menu")}
            >
              Все меню
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Upcoming Events */}
          <div className="space-y-6">
            <div className="mb-6 flex items-center gap-3">
              <Calendar className="h-6 w-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-foreground">Ближайшие события</h3>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <Card
                  key={event.id}
                  className="group border-orange-100 transition-all duration-300 hover:scale-105 hover:shadow-xl dark:border-gray-700"
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <ImageWithFallback
                        src={event.image}
                        alt={event.title}
                        className="h-32 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute left-3 top-3">
                        <Badge className="bg-purple-100 text-xs text-purple-700">
                          <Music className="mr-1 h-3 w-3" />
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="mb-2 font-semibold text-foreground">{event.title}</h4>
                      <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-orange-600">
                          {event.isFree ? "Бесплатно" : `${event.price} ₽`}
                        </span>
                        <Button
                          size="sm"
                          onClick={onBookEvent}
                          className="bg-gradient-to-r from-orange-500 to-red-500 text-xs hover:from-orange-600 hover:to-red-600"
                        >
                          Участвовать
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
              onClick={() => onNavigate("events")}
            >
              Все мероприятия
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Recent Reviews */}
          <div className="space-y-6">
            <div className="mb-6 flex items-center gap-3">
              <MessageCircle className="h-6 w-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-foreground">Свежие отзывы</h3>
            </div>
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <Card
                  key={review.id}
                  className="border-orange-100 transition-all duration-300 hover:scale-105 hover:shadow-xl dark:border-gray-700"
                >
                  <CardContent className="p-4">
                    <div className="mb-3 flex items-start gap-3">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-foreground">{review.name}</h4>
                        <div className="mt-1 flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating
                                  ? "fill-current text-orange-500"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <Quote className="absolute -left-1 -top-1 h-4 w-4 text-orange-200" />
                      <p className="line-clamp-3 pl-3 text-sm leading-relaxed text-muted-foreground">
                        {review.comment}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
              onClick={() => onNavigate("reviews")}
            >
              Все отзывы
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 border-t border-orange-200 pt-16 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 p-6 text-center dark:from-orange-900/20 dark:to-red-900/20">
              <div className="mb-2 text-3xl font-bold text-orange-600">500+</div>
              <div className="text-sm text-muted-foreground">Довольных гостей</div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 p-6 text-center dark:from-orange-900/20 dark:to-red-900/20">
              <div className="mb-2 text-3xl font-bold text-orange-600">15+</div>
              <div className="text-sm text-muted-foreground">Лет опыта</div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 p-6 text-center dark:from-orange-900/20 dark:to-red-900/20">
              <div className="mb-2 text-3xl font-bold text-orange-600">50+</div>
              <div className="text-sm text-muted-foreground">Блюд в меню</div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 p-6 text-center dark:from-orange-900/20 dark:to-red-900/20">
              <div className="mb-2 text-3xl font-bold text-orange-600">100+</div>
              <div className="text-sm text-muted-foreground">Мероприятий</div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute right-10 top-20 -z-10 h-32 w-32 rounded-full bg-gradient-to-br from-orange-200/30 to-red-200/30 blur-2xl" />
      <div className="absolute bottom-20 left-10 -z-10 h-48 w-48 rounded-full bg-gradient-to-tr from-red-200/30 to-orange-200/30 blur-2xl" />
    </section>
  );
}
