"use client";

import { Calendar, Clock, Heart, MapPin, Music, Ticket, Users, Utensils } from "lucide-react";

import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { EventBooking } from "./EventBooking";

interface LocalEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  image: string;
  type: string;
  capacity: string;
  price: string;
  isRecurring: boolean;
  isFree: boolean;
}

export function Events() {
  const upcomingEvents = [
    {
      id: 1,
      title: "Живая музыка по пятницам",
      date: "2025-01-31",
      time: "19:00",
      description:
        "Каждую пятницу в нашем кафе выступают местные музыканты. Джаз, блюз и авторская песня в уютной атмосфере.",
      image:
        "https://epzjzmvefnlchacvegtk.supabase.co/storage/v1/object/public/images/gallery/events-3.jpg",
      type: "Музыка",
      capacity: "50 человек",
      price: "Бесплатно",
      isRecurring: true,
      isFree: true,
    },
    {
      id: 2,
      title: "Мастер-класс по приготовлению коктейлей",
      date: "2025-02-05",
      time: "18:00",
      description:
        "Научитесь готовить авторские коктейли от нашего шеф-бармена. В стоимость включены все ингредиенты.",
      image:
        "https://epzjzmvefnlchacvegtk.supabase.co/storage/v1/object/public/images/gallery/events-2.jpg",
      type: "Мастер-класс",
      capacity: "15 человек",
      price: "1500 ₽",
      isRecurring: false,
      isFree: false,
    },
    {
      id: 3,
      title: "День святого Валентина",
      date: "2025-02-14",
      time: "18:00",
      description:
        "Романтический вечер для влюбленных. Специальное меню, живая музыка и особая атмосфера.",
      image:
        "https://epzjzmvefnlchacvegtk.supabase.co/storage/v1/object/public/images/gallery/events-4.jpg",
      type: "Праздник",
      capacity: "30 пар",
      price: "2500 ₽",
      isRecurring: false,
      isFree: false,
    },
    {
      id: 4,
      title: "Кулинарный мастер-класс",
      date: "2025-02-20",
      time: "16:00",
      description:
        "Готовим фирменные блюда под руководством шеф-повара. Все приготовленное можно забрать домой.",
      image:
        "https://epzjzmvefnlchacvegtk.supabase.co/storage/v1/object/public/images/gallery/events-5.jpg",
      type: "Кулинария",
      capacity: "12 человек",
      price: "2000 ₽",
      isRecurring: false,
      isFree: false,
    },
  ];

  const eventTypes = {
    Музыка: { icon: Music, color: "bg-purple-100 text-purple-700" },
    "Мастер-класс": { icon: Utensils, color: "bg-blue-100 text-blue-700" },
    Праздник: { icon: Heart, color: "bg-red-100 text-red-700" },
    Кулинария: { icon: Utensils, color: "bg-green-100 text-green-700" },
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Нормализуем данные события для компонента EventBooking
  const normalizeEvent = (e: LocalEvent) => {
    const priceNum = e.isFree
      ? 0
      : parseInt(String(e.price).replace(/\D/g, "")) || 0;
    const capacityNum = parseInt(String(e.capacity).replace(/\D/g, "")) || 50;
    return {
      id: String(e.id),
      title: e.title,
      date: e.date,
      time: e.time,
      price: priceNum,
      capacity: capacityNum,
      description: e.description,
    };
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h2 className="gradient-text-animated mb-4 text-4xl font-bold">Мероприятия</h2>
        <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
          Узнайте о предстоящих событиях и специальных предложениях в нашем кафе
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {upcomingEvents.map((event) => {
          const EventIcon = eventTypes[event.type as keyof typeof eventTypes]?.icon || Calendar;
          const typeColor =
            eventTypes[event.type as keyof typeof eventTypes]?.color ||
            "bg-gray-100 text-muted-foreground";

          return (
            <Card
              key={event.id}
              className="loft-card group transition-all duration-300 hover:scale-105"
            >
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <ImageWithFallback
                    src={event.image}
                    alt={event.title}
                    className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute left-4 top-4 flex gap-2">
                    <Badge className={`${typeColor} text-xs`}>
                      <EventIcon className="mr-1 h-3 w-3" />
                      {event.type}
                    </Badge>
                    {event.isRecurring && (
                      <Badge className="bg-orange-100 text-xs text-orange-700">Регулярно</Badge>
                    )}
                    {event.isFree && (
                      <Badge className="bg-green-100 text-xs text-green-700">Бесплатно</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <CardTitle className="mb-2 text-xl text-foreground">{event.title}</CardTitle>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {event.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-amber-400" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-400" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-amber-400" />
                      <span>{event.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-amber-400" />
                      <span>Наше кафе</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-amber-500/20 pt-4">
                    <div className="text-lg font-bold text-amber-400">{event.price}</div>
                    <EventBooking
                      event={normalizeEvent(event)}
                      trigger={
                        <Button
                          size="sm"
                          className="btn-loft"
                        >
                          <Ticket className="mr-2 h-4 w-4" />
                          Забронировать
                        </Button>
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="loft-card mt-16 rounded-2xl p-8">
        <div className="text-center">
          <h3 className="mb-4 text-2xl font-bold text-foreground">
            Хотите провести свое мероприятие?
          </h3>
          <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
            Подпишитесь на уведомления, чтобы не пропустить важные события
          </p>
          <Button
            size="lg"
            onClick={() =>
              console.log(
                "Свяжитесь с нами по телефону +7 (495) 123-45-67 для обсуждения вашего мероприятия!",
              )
            }
            className="btn-loft rounded-xl px-8 py-3 shadow-lg transition-all duration-300"
          >
            Обсудить мероприятие
          </Button>
        </div>
      </div>
    </section>
  );
}
