"use client";

import { Bell, Calendar, Check, CreditCard, Loader2, Users } from "lucide-react";
import { useEffect, useState } from "react";

import {
  notificationsApi,
  ProjectPausedError,
  isNetworkError,
} from "../src/api/client";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface Notification {
  type: string;
  message: string;
  createdAt: string;
  read: boolean;
  reservationId?: string;
  bookingId?: string;
  amount?: number;
}

export function AdminNotifications() {
  const [notifications, setNotifications] = useState<Array<Notification & { key: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [markingRead, setMarkingRead] = useState<string[]>([]);
  const [backendUnavailable, setBackendUnavailable] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Mock data for demo
  const mockNotifications = [
    {
      key: "notif_1",
      type: "new_reservation",
      message: "Новое бронирование столика от Иван Петров на 2025-02-01 в 19:00",
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      key: "notif_2",
      type: "new_event_booking",
      message: 'Новое бронирование мероприятия "Мастер-класс" от Мария Сидорова',
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      read: false,
      amount: 1500,
    },
    {
      key: "notif_3",
      type: "payment_received",
      message: "Получена оплата за мероприятие от Алексей Иванов",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: true,
      amount: 2500,
    },
  ];

  useEffect(() => {
    // Simulate loading mock data
    setLoading(true);
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      setBackendUnavailable(false);

      const data = await notificationsApi.getAll();
      setNotifications(Array.isArray(data) ? data : []);
      setBackendUnavailable(false);
      setErrorMsg(null);
    } catch (e) {
      console.error("Сбой загрузки уведомлений:", e);

      if (e instanceof ProjectPausedError) {
        setBackendUnavailable(true);
        setErrorMsg("Сервер уведомлений временно недоступен (Project Paused). Показаны демо-данные.");
      } else if (e instanceof Error && isNetworkError(e.message)) {
        setBackendUnavailable(true);
        setErrorMsg("Не удалось связаться с сервером уведомлений. Показаны демо-данные.");
      } else {
        setErrorMsg("Ошибка загрузки уведомлений. Попробуйте позже.");
      }
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationKey: string) => {
    setMarkingRead((prev) => [...prev, notificationKey]);
    try {
      await notificationsApi.markAsRead(notificationKey);
      setNotifications((prev) =>
        prev.map((n) => (n.key === notificationKey ? { ...n, read: true } : n)),
      );
    } catch (e) {
      console.error("Сбой при отметке уведомления как прочитанного:", e);

      // Фолбэк: отмечаем локально как прочитанное
      if (e instanceof ProjectPausedError) {
        setBackendUnavailable(true);
        setErrorMsg("Сервер уведомлений недоступен, отметка выполнена локально.");
      } else {
        setErrorMsg("Нет связи с сервером, отметка выполнена локально.");
      }

      setNotifications((prev) =>
        prev.map((n) => (n.key === notificationKey ? { ...n, read: true } : n)),
      );
    } finally {
      setMarkingRead((prev) => prev.filter((key) => key !== notificationKey));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_reservation":
        return <Calendar className="h-5 w-5" />;
      case "new_event_booking":
        return <Users className="h-5 w-5" />;
      case "payment_received":
        return <CreditCard className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "new_reservation":
        return "bg-accent/20 text-accent-foreground border-accent/30";
      case "new_event_booking":
        return "bg-primary/10 text-primary border-primary/20";
      case "payment_received":
        return "bg-secondary text-secondary-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} дн. назад`;
    if (hours > 0) return `${hours} ч. назад`;
    if (minutes > 0) return `${minutes} мин. назад`;
    return "Только что";
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Уведомления
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Уведомления
          </div>
          {unreadCount > 0 && <Badge variant="destructive">{unreadCount} новых</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Notice about backend availability */}
        {(backendUnavailable || errorMsg) && (
          <div className="mb-4 rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
            {errorMsg || "Сервер уведомлений временно недоступен. Показаны демо-данные."}
          </div>
        )}
        {notifications.length === 0 ? (
          <p className="py-4 text-center text-muted-foreground">Нет уведомлений</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.key}
                className={`rounded-lg border p-4 transition-all duration-200 ${
                  notification.read
                    ? "border-border bg-muted"
                    : getNotificationColor(notification.type)
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-1 items-start gap-3">
                    <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <p
                        className={`text-sm ${notification.read ? "text-muted-foreground" : "font-medium"}`}
                      >
                        {notification.message}
                      </p>
                      {notification.amount && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Сумма: {notification.amount} ₽
                        </p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>

                  {!notification.read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markAsRead(notification.key)}
                      disabled={markingRead.includes(notification.key)}
                      className="ml-2"
                    >
                      {markingRead.includes(notification.key) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <Button
          variant="outline"
          onClick={fetchNotifications}
          className="mt-4 w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Обновление...
            </>
          ) : (
            "Обновить"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
