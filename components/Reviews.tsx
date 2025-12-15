"use client";

import { MessageCircle, Quote, Star } from "lucide-react";
import { toast } from "sonner";

import type { Review } from "../src/types";
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
        {reviews.map((review) => (
          <Card
            key={review.id}
            className="p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <CardContent className="p-0">
              <div className="mb-4 flex items-start gap-4">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{review.name}</h3>
                  <div className="mt-1 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "fill-current text-orange-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(review.date).toLocaleDateString("ru-RU")}
                  </p>
                </div>
              </div>

              <div className="relative">
                <Quote className="absolute -left-2 -top-2 h-6 w-6 text-orange-200" />
                <p className="pl-4 leading-relaxed text-muted-foreground">{review.comment}</p>
              </div>
            </CardContent>
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

      {/* Stats */}
      <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600">4.8</div>
          <div className="text-sm text-muted-foreground">Средний рейтинг</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600">150+</div>
          <div className="text-sm text-muted-foreground">Отзывов</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600">95%</div>
          <div className="text-sm text-muted-foreground">Рекомендуют</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600">5★</div>
          <div className="text-sm text-muted-foreground">Большинство оценок</div>
        </div>
      </div>
    </section>
  );
}
