"'use client'"

import { Calendar, Clock, Heart, MapPin, Music, Ticket, Users, Utensils } from "lucide-react";

import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { EventBooking } from "./EventBooking";

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
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
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
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
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
        "https://images.unsplash.com/photo-1518136247453-74e7b5265980?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
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
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
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
  const normalizeEvent = (e: any) => {
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
        <h2 className="mb-4 text-4xl font-bold text-foreground">Мероприятия</h2>
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
              className="group border-orange-100 transition-all duration-300 hover:scale-105 hover:shadow-xl"
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
                      <Calendar className="h-4 w-4 text-orange-500" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-orange-500" />
                      <span>{event.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      <span>Наше кафе</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div className="text-lg font-bold text-orange-600">{event.price}</div>
                    <EventBooking
                      event={normalizeEvent(event)}
                      trigger={
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
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

      <div className="mt-16 rounded-2xl bg-gradient-to-r from-orange-50 to-red-50 p-8">
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
            className="rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-8 py-3 text-white shadow-lg transition-all duration-300 hover:from-orange-600 hover:to-red-600 hover:shadow-xl"
          >
            Обсудить мероприятие
          </Button>
        </div>
      </div>
    </section>
  );
}
