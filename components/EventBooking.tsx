"use client";

import {
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
  Mail,
  Phone,
  Users,
} from "lucide-react";
import { useState } from "react";

import { formatPhoneNumber, isValidPhone, isValidEmail } from "../src/utils/formatters";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  price: number;
  capacity: number;
  description: string;
}

interface EventBookingProps {
  event: Event;
  trigger?: React.ReactNode;
}

// Вспомогательные функции: сохранение/обновление демо-бронирований мероприятий
const saveDemoEventBooking = (payload: {
  name: string;
  phone: string;
  email: string;
  tickets: string;
  paymentMethod: string;
  event: Event;
  totalAmount: number;
}) => {
  try {
    const existing = JSON.parse(localStorage.getItem("demo_bookings") || "[]");
    const id = `demo-event-${Date.now()}`;
    const ticketsNum = parseInt(payload.tickets || "1", 10) || 1;
    const paymentStatus =
      payload.event.price > 0
        ? payload.paymentMethod === "card"
          ? "requires_payment"
          : "pending"
        : "paid";

    const demoItem = {
      id,
      type: "event" as const,
      status: "pending",
      createdAt: new Date().toISOString(),
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      eventTitle: payload.event.title,
      tickets: ticketsNum,
      totalAmount: payload.totalAmount,
      paymentStatus,
      paymentMethod: payload.paymentMethod,
    };

    localStorage.setItem("demo_bookings", JSON.stringify([demoItem, ...existing]));
    return id;
  } catch {
    return null;
  }
};

interface DemoBooking {
  id: string;
  paymentStatus?: string;
  status?: string;
}

const markDemoEventPaid = (id: string) => {
  try {
    const existing: DemoBooking[] = JSON.parse(localStorage.getItem("demo_bookings") || "[]");
    const updated = existing.map((b) =>
      b.id === id ? { ...b, paymentStatus: "paid", status: "confirmed" } : b,
    );
    localStorage.setItem("demo_bookings", JSON.stringify(updated));
  } catch (e) {
    console.error("Не удалось пометить демо-событие как оплачено:", e);
  }
};

export function EventBooking({ event, trigger }: EventBookingProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    tickets: "1",
    paymentMethod: "cash",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const totalAmount = event.price * parseInt(formData.tickets || "1");

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `https://${projectId}.functions.supabase.co/server/make-server-c85ae302/event-bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            eventId: event.id,
            ...formData,
          }),
        },
      );

      // Graceful fallback: Supabase project paused
      if (response.status === 540) {
        const demoId =
          saveDemoEventBooking({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            tickets: formData.tickets,
            paymentMethod: formData.paymentMethod,
            event,
            totalAmount,
          }) || `demo-event-${Date.now()}`;
        setBookingId(demoId);
        setSubmitted(true);
        console.log("Проект приостановлен (540). Включен демо-режим для бронирования мероприятия");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при создании бронирования");
      }

      setBookingId(data.booking.id);

      setSubmitted(true);

      console.log("Бронирование создано:", data.booking);
    } catch (error) {
      console.error("Ошибка бронирования:", error);
      const msg = error instanceof Error ? error.message : "Произошла ошибка";
      // Graceful fallback: сетевые/CORS ошибки
      if (/Network|CORS|Failed to fetch/i.test(msg)) {
        const demoId =
          saveDemoEventBooking({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            tickets: formData.tickets,
            paymentMethod: formData.paymentMethod,
            event,
            totalAmount,
          }) || `demo-event-${Date.now()}`;
        setBookingId(demoId);
        setSubmitted(true);
        console.log("Сетевая/CORS ошибка. Включен демо-режим для бронирования мероприятия");
      } else {
        setError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };



  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      tickets: "1",
      paymentMethod: "cash",
    });
    setSubmitted(false);
    setBookingId("");
    setError("");
    setOpen(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Определяем содержимое диалога на основе состояния
  const renderDialogContent = () => {
    if (submitted) {
      return (
        <div className="p-6 text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-primary" />
          <h3 className="mb-2 text-xl font-bold text-foreground">Бронирование подтверждено!</h3>
          <p className="mb-4 text-muted-foreground">
            {event.price > 0
              ? "Ваши билеты забронированы. Оплата при посещении."
              : "Ваши места забронированы!"}
          </p>
          <div className="mb-4 rounded-lg bg-muted p-4 text-sm">
            <p>
              <strong>Мероприятие:</strong> {event.title}
            </p>
            <p>
              <strong>Дата:</strong> {formatDate(event.date)} в {event.time}
            </p>
            <p>
              <strong>Билетов:</strong> {formData.tickets}
            </p>
            <p>
              <strong>Сумма:</strong> {totalAmount} ₽
            </p>
          </div>
          <Button onClick={resetForm} className="w-full">
            Закрыть
          </Button>
        </div>
      );
    }

    // Основная форма бронирования
    return (
      <>
        <DialogHeader>
          <DialogTitle>Бронирование мероприятия</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Информация о мероприятии */}
          <Card>
            <CardContent className="p-4">
              <h3 className="mb-2 text-lg font-bold">{event.title}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>До {event.capacity} человек</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {event.price > 0 ? `${event.price} ₽/билет` : "Бесплатно"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-4 text-destructive">
              {error}
            </div>
          )}

          {/* Форма бронирования */}
          <form onSubmit={handleBooking} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Имя *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ваше имя"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Телефон *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) })}
                    placeholder="+7 (999) 999-99-99"
                    className="pl-10"
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength={18}
                    aria-invalid={!isValidPhone(formData.phone)}
                    aria-describedby="phone-error"
                    required
                  />
                </div>
                {formData.phone.trim().length > 0 && !isValidPhone(formData.phone) && (
                  <span id="phone-error" role="alert" className="mt-1 block text-sm text-red-600">
                    Укажите корректный телефон (не менее 10 цифр).
                  </span>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label>Количество билетов</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={formData.tickets}
                onChange={(e) => setFormData({ ...formData, tickets: e.target.value })}
              />
            </div>



            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Итого:</span>
                <span>{totalAmount} ₽</span>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Обрабатываем...
                </>
              ) : (
                "Забронировать"
              )}
            </Button>
          </form>
        </div>
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button>Забронировать</Button>}</DialogTrigger>
      <DialogContent className={submitted ? "max-w-md" : "max-w-2xl"}>
        {renderDialogContent()}
      </DialogContent>
    </Dialog>
  );
}
