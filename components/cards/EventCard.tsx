"use client";

import { Calendar, Clock, Ticket } from "lucide-react";
import React, { memo } from "react";

import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";

interface EventCardProps {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  image: string;
  type: string;
  price: string;
  isFree: boolean;
  onBook?: (id: number) => void;
}

/**
 * Мемоизированная карточка события для оптимизации рендеринга
 */
export const EventCard = memo(function EventCard({
  id,
  title,
  date,
  time,
  description,
  image,
  type,
  price,
  isFree,
  onBook,
}: EventCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });

  return (
    <Card className="group overflow-hidden border-orange-100 transition-all duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden">
          <ImageWithFallback
            src={image}
            alt={title}
            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge className="absolute left-3 top-3 bg-orange-500 text-white">{type}</Badge>
          {isFree && (
            <Badge className="absolute right-3 top-3 bg-green-500 text-white">Бесплатно</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <h3 className="mb-2 text-xl font-bold text-foreground">{title}</h3>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{description}</p>

        <div className="mb-4 space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-500" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-500" />
            <span>{time}</span>
          </div>
          {!isFree && (
            <div className="flex items-center gap-2">
              <Ticket className="h-4 w-4 text-orange-500" />
              <span className="font-semibold text-orange-600">{price} ₽</span>
            </div>
          )}
        </div>

        {onBook && (
          <Button
            onClick={() => onBook(id)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            Забронировать
          </Button>
        )}
      </CardContent>
    </Card>
  );
});
