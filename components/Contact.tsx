"'use client'";

import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { TableBooking } from "./TableBooking";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function Contact() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-4xl font-bold text-foreground">Контакты и бронирование</h2>
        <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
          Свяжитесь с нами для бронирования столика или по любым вопросам
        </p>
      </div>

      <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="border-orange-100 transition-shadow duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-foreground">
                <MapPin className="h-5 w-5 text-orange-600" />
                Адрес
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                г. Москва, ул. Центральная, 123
                <br />
                Район: Центральный
                <br />
                Ближайшее метро: Площадь Революции (5 мин пешком)
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-100 transition-shadow duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-foreground">
                <Phone className="h-5 w-5 text-orange-600" />
                Телефон
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                +7 (495) 123-45-67
                <br />
                +7 (495) 123-45-68 (для бронирования)
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-100 transition-shadow duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-foreground">
                <Mail className="h-5 w-5 text-orange-600" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                info@bar-da-bar.ru
                <br />
                booking@bar-da-bar.ru
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-100 transition-shadow duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-foreground">
                <Clock className="h-5 w-5 text-orange-600" />
                Часы работы
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-muted-foreground">
                <p>Понедельник - Четверг: 09:00 - 23:00</p>
                <p>Пятница - Суббота: 09:00 - 01:00</p>
                <p>Воскресенье: 10:00 - 22:00</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-100 bg-gradient-to-br from-orange-50 to-red-50">
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
          <TableBooking />
        </div>
      </div>
    </section>
  );
}
