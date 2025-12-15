"use client";

import { MessageCircle, Quote, Star, ThumbsUp, Users, Award } from "lucide-react";
import { toast } from "sonner";

import type { Review } from "../src/types";
import { AnimatedCounter } from "./AnimatedCounter";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface ReviewsProps {
  reviews: Review[];
}

export function Reviews({ reviews }: ReviewsProps) {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-4xl font-bold text-foreground">Отзывы гостей</h2>
        <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
          Узнайте, что говорят о нас наши довольные гости
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review, index) => (
          <Card
            key={review.id}
            className="hover-lift stagger-item group relative overflow-hidden border-orange-100 p-6"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-0">
              <div className="mb-4 flex items-start gap-4">
                <div className="relative">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-orange-200 transition-all group-hover:ring-orange-400"
                  />
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-green-500 p-1">
                    <ThumbsUp className="h-2 w-2 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground transition-colors group-hover:text-orange-600">{review.name}</h3>
                  <div className="mt-1 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 transition-transform ${
                          i < review.rating
                            ? "fill-current text-orange-500 group-hover:scale-110"
                            : "text-muted-foreground"
                        }`}
                        style={{ transitionDelay: `${i * 50}ms` }}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(review.date).toLocaleDateString("ru-RU")}
                  </p>
                </div>
              </div>

              <div className="relative">
                <Quote className="absolute -left-2 -top-2 h-6 w-6 text-orange-200 transition-transform group-hover:scale-125" />
                <p className="pl-4 leading-relaxed text-muted-foreground">{review.comment}</p>
              </div>
            </CardContent>
            
            {/* Decorative gradient - contained */}
            <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 overflow-hidden">
              <div className="absolute -right-10 -top-10 h-20 w-20 rounded-full bg-gradient-to-br from-orange-500/10 to-red-500/10 transition-all duration-500 group-hover:scale-150" />
            </div>
          </Card>
        ))}
      </div>

      {/* Add Review CTA */}
      <div className="mt-12 text-center">
        <Card className="inline-block bg-gradient-to-r from-orange-50 to-red-50 p-8 dark:from-orange-900/20 dark:to-red-900/20">
          <h3 className="mb-3 text-xl font-semibold text-foreground">Поделитесь своим мнением</h3>
          <p className="mb-4 text-muted-foreground">Ваш отзыв поможет нам стать еще лучше</p>
          <Button
            onClick={() => toast.success("Функция добавления отзывов скоро будет доступна!")}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Оставить отзыв
          </Button>
        </Card>
      </div>

      {/* Stats with animated counters */}
      <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
        <div className="group rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 p-6 text-center transition-all hover:scale-105 hover:shadow-lg dark:from-orange-900/20 dark:to-red-900/20">
          <Star className="mx-auto mb-2 h-8 w-8 text-orange-500 transition-transform group-hover:rotate-12" />
          <div className="text-3xl font-bold text-orange-600">4.8</div>
          <div className="text-sm text-muted-foreground">Средний рейтинг</div>
        </div>
        <div className="group rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 p-6 text-center transition-all hover:scale-105 hover:shadow-lg dark:from-orange-900/20 dark:to-red-900/20">
          <MessageCircle className="mx-auto mb-2 h-8 w-8 text-orange-500 transition-transform group-hover:scale-110" />
          <div className="text-3xl font-bold text-orange-600">
            <AnimatedCounter end={150} suffix="+" />
          </div>
          <div className="text-sm text-muted-foreground">Отзывов</div>
        </div>
        <div className="group rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 p-6 text-center transition-all hover:scale-105 hover:shadow-lg dark:from-orange-900/20 dark:to-red-900/20">
          <Users className="mx-auto mb-2 h-8 w-8 text-orange-500 transition-transform group-hover:scale-110" />
          <div className="text-3xl font-bold text-orange-600">
            <AnimatedCounter end={95} suffix="%" />
          </div>
          <div className="text-sm text-muted-foreground">Рекомендуют</div>
        </div>
        <div className="group rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 p-6 text-center transition-all hover:scale-105 hover:shadow-lg dark:from-orange-900/20 dark:to-red-900/20">
          <Award className="mx-auto mb-2 h-8 w-8 text-orange-500 transition-transform group-hover:rotate-12" />
          <div className="text-3xl font-bold text-orange-600">5★</div>
          <div className="text-sm text-muted-foreground">Большинство оценок</div>
        </div>
      </div>
    </section>
  );
}
