"use client";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon, Clock, Mail, Phone, User, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

interface TableBookingProps {
  onClose?: () => void;
}

export function TableBooking({ onClose }: TableBookingProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: undefined as Date | undefined,
    time: "",
    guests: "",
    specialRequests: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
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
    "22:30",
  ];

  const guestOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];

  // Простейшая проверка валидности телефона: не менее 10 цифр
  const isPhoneValid = formData.phone.replace(/\D/g, "").length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.date ||
      !formData.time ||
      !formData.guests
    ) {
      toast.error("Пожалуйста, заполните все обязательные поля");
      return;
    }

    setIsSubmitting(true);

    try {
      // Симуляция отправки данных
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Бронирование успешно создано! Мы свяжемся с вами для подтверждения.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: undefined,
        time: "",
        guests: "",
        specialRequests: "",
      });
      onClose?.();
    } catch (error) {
      console.error("Ошибка бронирования:", error);
      toast.error("Ошибка при создании бронирования. Попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Users className="h-6 w-6 text-orange-600" />
          Бронирование столика
        </CardTitle>
        <p className="text-muted-foreground">
          Вы можете указать предпочтения по столу или особые пожелания в комментариях.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Ваше имя *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Введите ваше имя"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Телефон *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  const raw = e.target.value;
                  let digits = raw.replace(/\D/g, "");
                  if (!digits) {
                    setFormData({ ...formData, phone: "" });
                    return;
                  }
                  // Нормализуем российские номера: 8 -> 7, 9********* -> 7 9*********, иначе добавляем 7
                  if (digits.startsWith("8")) {
                    digits = "7" + digits.slice(1);
                  }
                  if (!digits.startsWith("7")) {
                    digits = digits.startsWith("9") ? "7" + digits : "7" + digits.slice(0, 10);
                  }
                  digits = digits.slice(0, 11);

                  const d = digits.slice(1);
                  let formatted = "+7";
                  if (d.length > 0) {
                    formatted += " (" + d.slice(0, Math.min(3, d.length));
                    if (d.length >= 3) {
                      formatted += ")";
                      if (d.length > 3) {
                        formatted += " " + d.slice(3, Math.min(6, d.length));
                        if (d.length > 6) {
                          formatted += "-" + d.slice(6, Math.min(8, d.length));
                          if (d.length > 8) {
                            formatted += "-" + d.slice(8, Math.min(10, d.length));
                          }
                        }
                      }
                    }
                  }

                  setFormData({ ...formData, phone: formatted });
                }}
                placeholder="+7 (999) 999-99-99"
                autoComplete="tel"
                inputMode="tel"
                maxLength={18}
                aria-invalid={!isPhoneValid}
                aria-describedby="phone-error"
                required
              />
              {formData.phone.trim().length > 0 && !isPhoneValid && (
                <span id="phone-error" role="alert" className="mt-1 block text-sm text-red-600">
                  Укажите корректный телефон (не менее 10 цифр).
                </span>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Дата *
              </Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {formData.date ? (
                      format(formData.date, "dd MMMM yyyy", { locale: ru })
                    ) : (
                      <span>Выберите дату</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => {
                      setFormData({ ...formData, date });
                      setCalendarOpen(false);
                    }}
                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Время *
              </Label>
              <Select
                value={formData.time}
                onValueChange={(value) => setFormData({ ...formData, time: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите время" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Гостей *
              </Label>
              <Select
                value={formData.guests}
                onValueChange={(value) => setFormData({ ...formData, guests: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Количество" />
                </SelectTrigger>
                <SelectContent>
                  {guestOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}{" "}
                      {option === "1" ? "человек" : option === "10+" ? "человек" : "человека"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="requests">Особые пожелания</Label>
            <Textarea
              id="requests"
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              placeholder="Укажите особые пожелания или требования (высокий стул, аллергии и т.д.)"
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
            >
              {isSubmitting ? "Создание бронирования..." : "Забронировать столик"}
            </Button>
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Отмена
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
