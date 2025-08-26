"use client";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon, CheckCircle, Clock, Loader2, Mail, Phone, Users } from "lucide-react";
import { useState } from "react";

import { projectId, publicAnonKey } from "../utils/supabase/info";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

// Утилиты для унифицированного graceful fallback
const PAUSED_TEXT_REGEX = /project\s*paused/i;
const NETWORK_CORS_REGEX =
  /(Failed to fetch|NetworkError|CORS|TypeError: Failed to fetch|TypeError: Load failed|ERR_NETWORK|ERR_BLOCKED_BY_CLIENT)/i;
const isPausedMessage = (text?: string) => !!text && PAUSED_TEXT_REGEX.test(text);
const logPaused = (context: string) =>
  console.log(`${context}: проект приостановлен, включаем демо-режим`);

// Добавляем локальное сохранение бронирований в демо-режиме
const saveDemoTableReservation = (payload: {
  name: string;
  phone: string;
  email: string;
  date?: Date | undefined;
  time: string;
  guests: string;
  specialRequests: string;
}) => {
  try {
    const existing = JSON.parse(localStorage.getItem("demo_bookings") || "[]");
    const id = `demo-table-${Date.now()}`;
    const guestsNum =
      payload.guests === "10+" ? 10 : parseInt(payload.guests || "0", 10) || undefined;
    const demoItem = {
      id,
      type: "table" as const,
      status: "pending",
      createdAt: new Date().toISOString(),
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      date: payload.date ? format(payload.date, "yyyy-MM-dd") : undefined,
      time: payload.time,
      guests: guestsNum,
      specialRequests: payload.specialRequests || "",
    };
    localStorage.setItem("demo_bookings", JSON.stringify([demoItem, ...existing]));
    return id;
  } catch {
    return null;
  }
};

export function TableReservation({ acceptsReservations = true }: { acceptsReservations?: boolean }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: undefined as Date | undefined,
    time: "",
    guests: "",
    specialRequests: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isProjectPaused, setIsProjectPaused] = useState(false);

  const timeSlots = [
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
  ];

  const guestOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];

  // Если бронирования временно отключены администратором — показываем уведомление
  if (!acceptsReservations) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center">Бронирование столика</CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center text-muted-foreground">
          <p className="mb-2 text-lg font-medium text-foreground">Бронирования временно недоступны</p>
          <p>
            Администратор временно отключил приём заявок на бронирование столиков. Пожалуйста,
            зайдите позже или свяжитесь с нами по телефону.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Клиентская валидация обязательных полей перед отправкой
    const validations: string[] = [];
    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();

    if (name.length < 2) validations.push("Укажите имя (не короче 2 символов).");
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) validations.push("Укажите корректный телефон (не менее 10 цифр).");
    if (!formData.date) validations.push("Выберите дату бронирования.");
    if (!formData.time) validations.push("Выберите время бронирования.");
    if (!formData.guests) validations.push("Выберите количество гостей.");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validations.push("Укажите корректный email или оставьте поле пустым.");
    }

    if (validations.length > 0) {
      setError(validations.join(" "));
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `https://${projectId}.functions.supabase.co/server/make-server-c85ae302/reservations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            ...formData,
            date: formData.date ? format(formData.date, "yyyy-MM-dd") : null,
          }),
        },
      );

      // Graceful fallback: статус 540 или текстовое тело с признаком "Project paused"
      if (response.status === 540) {
        setIsProjectPaused(true);
        saveDemoTableReservation(formData);
        setSubmitted(true);
        logPaused("Бронирование (540)");
        return;
      }

      const textBody = await response
        .clone()
        .text()
        .catch(() => "");
      if (isPausedMessage(textBody)) {
        setIsProjectPaused(true);
        saveDemoTableReservation(formData);
        setSubmitted(true);
        logPaused("Бронирование (text)");
        return;
      }

      let data: any = undefined;
      try {
        data = await response.json();
      } catch (_) {
        // Ответ не JSON — полагаемся на статус и текст
      }

      if (!response.ok) {
        const serverMsg = data?.error || data?.message || textBody;
        throw new Error(serverMsg || "Ошибка при создании бронирования");
      }

      setSubmitted(true);
      console.log("Бронирование создано:", data?.reservation ?? null);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Ошибка бронирования:", message);

      // Сетевые/CORS ошибки или текстовый признак паузы — переходим в демо-режим
      if (NETWORK_CORS_REGEX.test(message) || isPausedMessage(message)) {
        setIsProjectPaused(true);
        saveDemoTableReservation(formData);
        setSubmitted(true);
        setError("");
        logPaused("Бронирование (network/CORS)");
      } else {
        setError(message || "Произошла ошибка");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="p-8 text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h3 className="mb-2 text-2xl font-bold text-foreground">
            {isProjectPaused ? "Демо-режим" : "Бронирование отправлено!"}
          </h3>
          <p className="mb-4 text-muted-foreground">
            {isProjectPaused
              ? "Система временно работает в демо-режиме. Ваш запрос сохранен локально для демонстрации функций."
              : "Спасибо за ваш запрос. Мы свяжемся с вами в ближайшее время для подтверждения бронирования."}
          </p>
          <Button
            onClick={() => {
              setSubmitted(false);
              setIsProjectPaused(false);
              setFormData({
                name: "",
                phone: "",
                email: "",
                date: undefined,
                time: "",
                guests: "",
                specialRequests: "",
              });
            }}
          >
            Создать новое бронирование
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="text-center">Бронирование столика</CardTitle>
        <p className="text-center text-muted-foreground">
          Выберите дату и время, чтобы забронировать столик в нашем кафе
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

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
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+7 (999) 999-99-99"
                  className="pl-10"
                  required
                />
              </div>
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label>Дата *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date
                      ? format(formData.date, "dd MMM yyyy", { locale: ru })
                      : "Выберите дату"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => setFormData({ ...formData, date })}
                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Время *</Label>
              <Select
                value={formData.time}
                onValueChange={(value) => setFormData({ ...formData, time: value })}
              >
                <SelectTrigger>
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Выберите время" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Количество гостей *</Label>
              <Select
                value={formData.guests}
                onValueChange={(value) => setFormData({ ...formData, guests: value })}
              >
                <SelectTrigger>
                  <Users className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Гости" />
                </SelectTrigger>
                <SelectContent>
                  {guestOptions.map((guests) => (
                    <SelectItem key={guests} value={guests}>
                      {guests}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="specialRequests">Особые пожелания</Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              placeholder="Особые пожелания, аллергии, предпочтения по размещению..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            disabled={
              isSubmitting ||
              !formData.name.trim() ||
              !formData.phone.trim() ||
              !formData.date ||
              !formData.time ||
              !formData.guests
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Отправляем...
              </>
            ) : (
              "Забронировать столик"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
