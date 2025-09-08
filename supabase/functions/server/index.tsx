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

// Функция отправки email уведомлений
const sendEmailNotification = async (to: string, subject: string, htmlContent: string, templateType?: string) => {
  try {
    // Проверяем настройки email
    const emailSettings = await kv.get("email_settings") || {
      enabled: true,
      fromEmail: "noreply@bar-da-bar.ru",
      templates: {
        tableReservation: true,
        eventBooking: true,
        paymentConfirmation: true
      }
    };
    
    // Если email уведомления отключены
    if (!emailSettings.enabled) {
      console.log("Email уведомления отключены в настройках");
      return { success: false, reason: "disabled" };
    }
    
    // Если конкретный тип уведомления отключен
    if (templateType && emailSettings.templates && !emailSettings.templates[templateType]) {
      console.log(`Email уведомления типа ${templateType} отключены`);
      return { success: false, reason: "template_disabled" };
    }
    
    // Используем EmailJS или другой сервис для отправки email
    // В продакшене здесь должна быть интеграция с реальным почтовым сервисом
    const emailData = {
      to,
      subject,
      html: htmlContent,
      from: emailSettings.fromEmail || "noreply@bar-da-bar.ru"
    };
    
    console.log("Email отправлен:", emailData);
    return { success: true };
  } catch (error) {
    console.log("Ошибка отправки email:", error);
    return { success: false, error };
  }
};

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

    // Отправляем email подтверждение клиенту, если указан email
    if (email) {
      const emailSubject = "Подтверждение бронирования столика - Кафе Bar da Bar";
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ea580c;">Подтверждение бронирования</h2>
          <p>Здравствуйте, ${name}!</p>
          <p>Ваше бронирование столика в кафе <strong>Bar da Bar</strong> принято:</p>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Дата:</strong> ${date}</p>
            <p><strong>Время:</strong> ${time}</p>
            <p><strong>Количество гостей:</strong> ${guests}</p>
            <p><strong>Телефон:</strong> ${phone}</p>
            ${specialRequests ? `<p><strong>Особые пожелания:</strong> ${specialRequests}</p>` : ''}
          </div>
          <p>Мы свяжемся с вами для подтверждения бронирования.</p>
          <p>С уважением,<br>Команда кафе Bar da Bar</p>
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #6b7280;">Адрес: ул. Примерная, 123, Москва<br>Телефон: +7 (495) 123-45-67</p>
        </div>
      `;
      
      await sendEmailNotification(email, emailSubject, emailContent, "tableReservation");
    }

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

    // Отправляем email подтверждение клиенту, если указан email
    if (email) {
      const emailSubject = `Подтверждение бронирования: ${event.title} - Кафе Bar da Bar`;
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ea580c;">Подтверждение бронирования мероприятия</h2>
          <p>Здравствуйте, ${name}!</p>
          <p>Ваше бронирование на мероприятие в кафе <strong>Bar da Bar</strong> принято:</p>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #ea580c; margin-top: 0;">${event.title}</h3>
            <p><strong>Дата:</strong> ${event.date}</p>
            <p><strong>Время:</strong> ${event.time}</p>
            <p><strong>Количество билетов:</strong> ${tickets}</p>
            <p><strong>Стоимость билета:</strong> ${event.price > 0 ? `${event.price} ₽` : 'Бесплатно'}</p>
            <p><strong>Общая сумма:</strong> ${booking.totalAmount > 0 ? `${booking.totalAmount} ₽` : 'Бесплатно'}</p>
            <p><strong>Способ оплаты:</strong> ${paymentMethod === 'cash' ? 'Наличными на месте' : 'Онлайн'}</p>
            <p><strong>Телефон:</strong> ${phone}</p>
          </div>
          ${event.description ? `<p><strong>Описание:</strong> ${event.description}</p>` : ''}
          ${booking.totalAmount > 0 && paymentMethod !== 'cash' ? 
            '<p style="color: #dc2626;"><strong>Внимание:</strong> Для завершения бронирования необходимо произвести оплату.</p>' : 
            '<p style="color: #16a34a;">Бронирование подтверждено! Ждем вас на мероприятии.</p>'
          }
          <p>С уважением,<br>Команда кафе Bar da Bar</p>
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #6b7280;">Адрес: ул. Примерная, 123, Москва<br>Телефон: +7 (495) 123-45-67</p>
        </div>
      `;
      
      await sendEmailNotification(email, emailSubject, emailContent, "eventBooking");
    }

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

    // Отправляем email подтверждение об оплате клиенту
    if (booking.email) {
      const emailSubject = `Оплата подтверждена: ${booking.eventTitle} - Кафе Bar da Bar`;
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Оплата успешно получена!</h2>
          <p>Здравствуйте, ${booking.name}!</p>
          <p>Мы получили вашу оплату за мероприятие:</p>
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
            <h3 style="color: #ea580c; margin-top: 0;">${booking.eventTitle}</h3>
            <p><strong>Сумма оплаты:</strong> ${booking.totalAmount} ₽</p>
            <p><strong>Количество билетов:</strong> ${booking.tickets}</p>
            <p><strong>ID платежа:</strong> pay_${Date.now()}</p>
          </div>
          <p style="color: #16a34a; font-weight: bold;">✅ Ваше бронирование полностью подтверждено!</p>
          <p>Ждем вас на мероприятии. При входе назовите ваше имя.</p>
          <p>С уважением,<br>Команда кафе Bar da Bar</p>
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #6b7280;">Адрес: ул. Примерная, 123, Москва<br>Телефон: +7 (495) 123-45-67</p>
        </div>
      `;
      
      await sendEmailNotification(booking.email, emailSubject, emailContent, "paymentConfirmation");
    }

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

// Настройки email уведомлений
app.get("/make-server-c85ae302/email-settings", async (c) => {
  try {
    const settings = await kv.get("email_settings") || {
      enabled: true,
      adminEmail: "admin@bar-da-bar.ru",
      fromEmail: "noreply@bar-da-bar.ru",
      templates: {
        tableReservation: true,
        eventBooking: true,
        paymentConfirmation: true
      }
    };
    
    return c.json({ settings });
  } catch (error) {
    console.log("Ошибка при получении настроек email:", error);
    return c.json({ error: "Внутренняя ошибка сервера" }, 500);
  }
});

// Обновить настройки email уведомлений
app.post("/make-server-c85ae302/email-settings", async (c) => {
  try {
    const body = await c.req.json();
    const { enabled, adminEmail, fromEmail, templates } = body;
    
    const settings = {
      enabled: enabled !== undefined ? enabled : true,
      adminEmail: adminEmail || "admin@bar-da-bar.ru",
      fromEmail: fromEmail || "noreply@bar-da-bar.ru",
      templates: templates || {
        tableReservation: true,
        eventBooking: true,
        paymentConfirmation: true
      },
      updatedAt: new Date().toISOString()
    };
    
    await kv.set("email_settings", settings);
    
    return c.json({ success: true, settings });
  } catch (error) {
    console.log("Ошибка при обновлении настроек email:", error);
    return c.json({ error: "Внутренняя ошибка сервера" }, 500);
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
