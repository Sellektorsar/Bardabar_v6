// @ts-nocheck
import { createClient } from "@supabase/supabase-js";
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";

import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["*"],
    allowMethods: ["*"],
  }),
);

app.use("*", logger(console.log));

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// Создать бронирование столика
app.post("/make-server-c85ae302/reservations", async (c) => {
  try {
    const body = await c.req.json();
    const { name, phone, email, date, time, guests, specialRequests } = body;

    if (!name || !phone || !date || !time || !guests) {
      return c.json({ error: "Заполните все обязательные поля" }, 400);
    }

    const reservation = {
      id: Date.now().toString(),
      name,
      phone,
      email: email || "",
      date,
      time,
      guests: parseInt(guests),
      specialRequests: specialRequests || "",
      status: "pending",
      type: "table",
      createdAt: new Date().toISOString(),
    };

    await kv.set(`reservation:${reservation.id}`, reservation);

    // Отправляем уведомление администратору
    await kv.set(`notification:${Date.now()}`, {
      type: "new_reservation",
      message: `Новое бронирование столика от ${name} на ${date} в ${time}`,
      reservationId: reservation.id,
      createdAt: new Date().toISOString(),
      read: false,
    });

    console.log("Создано бронирование столика:", reservation);
    return c.json({ success: true, reservation });
  } catch (error) {
    console.log("Ошибка при создании бронирования столика:", error);
    return c.json({ error: "Внутренняя ошибка сервера" }, 500);
  }
});

// Создать бронирование мероприятия
app.post("/make-server-c85ae302/event-bookings", async (c) => {
  try {
    const body = await c.req.json();
    const { eventId, name, phone, email, tickets, paymentMethod } = body;

    if (!eventId || !name || !phone || !tickets) {
      return c.json({ error: "Заполните все обязательные поля" }, 400);
    }

    // Получаем информацию о мероприятии
    const event = await kv.get(`event:${eventId}`);
    if (!event) {
      return c.json({ error: "Мероприятие не найдено" }, 404);
    }

    const booking = {
      id: Date.now().toString(),
      eventId,
      eventTitle: event.title,
      name,
      phone,
      email: email || "",
      tickets: parseInt(tickets),
      totalAmount: event.price * parseInt(tickets),
      paymentMethod,
      paymentStatus: paymentMethod === "cash" ? "pending" : "requires_payment",
      status: "confirmed",
      type: "event",
      createdAt: new Date().toISOString(),
    };

    await kv.set(`booking:${booking.id}`, booking);

    // Отправляем уведомление администратору
    await kv.set(`notification:${Date.now()}`, {
      type: "new_event_booking",
      message: `Новое бронирование мероприятия "${event.title}" от ${name}`,
      bookingId: booking.id,
      createdAt: new Date().toISOString(),
      read: false,
    });

    console.log("Создано бронирование мероприятия:", booking);
    return c.json({ success: true, booking });
  } catch (error) {
    console.log("Ошибка при создании бронирования мероприятия:", error);
    return c.json({ error: "Внутренняя ошибка сервера" }, 500);
  }
});

// Получить все бронирования
app.get("/make-server-c85ae302/reservations", async (c) => {
  try {
    const reservations = await kv.getByPrefix("reservation:");
    const bookings = await kv.getByPrefix("booking:");

    const allBookings = [...reservations, ...bookings].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return c.json({ bookings: allBookings });
  } catch (error) {
    console.log("Ошибка при получении бронирований:", error);
    return c.json({ error: "Внутренняя ошибка сервера" }, 500);
  }
});

// Обновить статус бронирования
app.patch("/make-server-c85ae302/reservations/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { status } = body;

    // Попробуем найти как резервацию столика, так и бронирование мероприятия
    let booking = await kv.get(`reservation:${id}`);
    let key = `reservation:${id}`;

    if (!booking) {
      booking = await kv.get(`booking:${id}`);
      key = `booking:${id}`;
    }

    if (!booking) {
      return c.json({ error: "Бронирование не найдено" }, 404);
    }

    booking.status = status;
    booking.updatedAt = new Date().toISOString();

    await kv.set(key, booking);

    return c.json({ success: true, booking });
  } catch (error) {
    console.log("Ошибка при обновлении бронирования:", error);
    return c.json({ error: "Внутренняя ошибка сервера" }, 500);
  }
});

// Получить уведомления
app.get("/make-server-c85ae302/notifications", async (c) => {
  try {
    const notifications = await kv.getByPrefix("notification:");
    const sortedNotifications = notifications.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return c.json({ notifications: sortedNotifications });
  } catch (error) {
    console.log("Ошибка при получении уведомлений:", error);
    return c.json({ error: "Внутренняя ошибка сервера" }, 500);
  }
});

// Отметить уведомление как прочитанное
app.patch("/make-server-c85ae302/notifications/:id", async (c) => {
  try {
    const notificationKey = c.req.param("id");
    const notification = await kv.get(notificationKey);

    if (!notification) {
      return c.json({ error: "Уведомление не найдено" }, 404);
    }

    notification.read = true;
    await kv.set(notificationKey, notification);

    return c.json({ success: true });
  } catch (error) {
    console.log("Ошибка при обновлении уведомления:", error);
    return c.json({ error: "Внутренняя ошибка сервера" }, 500);
  }
});

// Обработка платежей (демо)
app.post("/make-server-c85ae302/process-payment", async (c) => {
  try {
    const body = await c.req.json();
    const { bookingId, paymentMethod, cardData } = body;

    // В реальном приложении здесь была бы интеграция с платежной системой
    // Сейчас симулируем успешную оплату
    const booking = await kv.get(`booking:${bookingId}`);
    if (!booking) {
      return c.json({ error: "Бронирование не найдено" }, 404);
    }

    // Симуляция обработки платежа
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Обновляем статус платежа
    booking.paymentStatus = "paid";
    booking.paymentMethod = paymentMethod;
    booking.paidAt = new Date().toISOString();

    await kv.set(`booking:${bookingId}`, booking);

    // Уведомление об оплате
    await kv.set(`notification:${Date.now()}`, {
      type: "payment_received",
      message: `Получена оплата за мероприятие "${booking.eventTitle}" от ${booking.name}`,
      bookingId: bookingId,
      amount: booking.totalAmount,
      createdAt: new Date().toISOString(),
      read: false,
    });

    return c.json({
      success: true,
      paymentId: `pay_${Date.now()}`,
      message: "Оплата прошла успешно",
    });
  } catch (error) {
    console.log("Ошибка при обработке платежа:", error);
    return c.json({ error: "Ошибка обработки платежа" }, 500);
  }
});

// Инициализация событий по умолчанию
app.post("/make-server-c85ae302/init-events", async (c) => {
  try {
    const defaultEvents = [
      {
        id: "1",
        title: "Живая музыка по пятницам",
        date: "2025-01-31",
        time: "19:00",
        price: 0,
        capacity: 50,
        description: "Каждую пятницу в нашем кафе выступают местные музыканты.",
      },
      {
        id: "2",
        title: "Мастер-класс по приготовлению коктейлей",
        date: "2025-02-05",
        time: "18:00",
        price: 1500,
        capacity: 15,
        description: "Научитесь готовить авторские коктейли от нашего шеф-бармена.",
      },
      {
        id: "3",
        title: "День святого Валентина",
        date: "2025-02-14",
        time: "18:00",
        price: 2500,
        capacity: 30,
        description: "Романтический вечер для влюбленных.",
      },
    ];

    for (const event of defaultEvents) {
      await kv.set(`event:${event.id}`, event);
    }

    return c.json({ success: true, message: "События инициализированы" });
  } catch (error) {
    console.log("Ошибка при инициализации событий:", error);
    return c.json({ error: "Внутренняя ошибка сервера" }, 500);
  }
});

Deno.serve(app.fetch);
