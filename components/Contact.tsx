"use client";

import { Clock, Mail, MapPin, Phone } from "lucide-react";

import type { SiteSettings } from "../src/types";
import { ContactForm } from "./ContactForm";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ContactProps {
  settings: SiteSettings;
}

export function Contact({ settings }: ContactProps) {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h2 className="gradient-text-animated mb-4 text-4xl font-bold">Контакты</h2>
        <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
          Свяжитесь с нами по любым вопросам
        </p>
      </div>

      <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="loft-card transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-foreground">
                <MapPin className="h-5 w-5 text-amber-400" />
                Адрес
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {settings.address}
                <br />
                Район: Центральный
                <br />
                Ближайшее метро: Площадь Революции (5 мин пешком)
              </p>
            </CardContent>
          </Card>

          <Card className="loft-card transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-foreground">
                <Phone className="h-5 w-5 text-amber-400" />
                Телефон
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {settings.phone}
                <br />
                +7 (495) 123-45-68 (для бронирования)
              </p>
            </CardContent>
          </Card>

          <Card className="loft-card transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-foreground">
                <Mail className="h-5 w-5 text-amber-400" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {settings.email}
                <br />
                booking@bar-da-bar.ru
              </p>
            </CardContent>
          </Card>

          <Card className="loft-card transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-foreground">
                <Clock className="h-5 w-5 text-amber-400" />
                Часы работы
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{settings.workingHours}</p>
            </CardContent>
          </Card>

          <Card className="loft-card">
            <CardContent className="p-6">
              <h3 className="mb-3 font-bold text-foreground">Как нас найти:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• От метро "Площадь Революции" - 5 минут пешком</li>
                <li>• Рядом с ТЦ "Центральный"</li>
                <li>• Парковка доступна во дворе здания</li>
                <li>• Вход со стороны улицы Центральная</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
