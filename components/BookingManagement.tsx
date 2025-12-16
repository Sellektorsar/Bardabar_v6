"use client";

import {
  Calendar,
  CreditCard,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  Users,
} from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";

import { supabase } from "../src/lib/supabase";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  type: "table" | "event";
  createdAt: string;
  date?: string;
  time?: string;
  guests?: number;
  specialRequests?: string;
  eventTitle?: string;
  tickets?: number;
  totalAmount?: number;
  paymentStatus?: string;
  paymentMethod?: string;
}

export function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string[]>([]);
  const [statusFilterTables, setStatusFilterTables] = useState<
    "all" | "pending" | "confirmed" | "completed" | "cancelled"
  >("all");
  const [statusFilterEvents, setStatusFilterEvents] = useState<
    "all" | "pending" | "confirmed" | "completed" | "cancelled"
  >("all");
  const [paymentFilterEvents, setPaymentFilterEvents] = useState<
    "all" | "paid" | "pending" | "requires_payment"
  >("all");

  const fetchBookings = React.useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Ошибка при получении бронирований:", error);
        setBookings([]);
        return;
      }

      // Преобразуем данные из snake_case в camelCase для совместимости с UI
      const mappedBookings: Booking[] = (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        phone: item.phone,
        email: item.email || "",
        status: item.status,
        type: item.type,
        createdAt: item.created_at,
        date: item.date,
        time: item.time,
        guests: item.guests,
        specialRequests: item.special_requests,
        eventTitle: item.event_title,
        tickets: item.tickets,
        totalAmount: item.total_amount,
        paymentStatus: item.payment_status,
        paymentMethod: item.payment_method,
      }));

      setBookings(mappedBookings);
    } catch (error) {
      console.error("Ошибка при получении бронирований:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    setUpdatingStatus([...updatingStatus, bookingId]);

    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", bookingId);

      if (error) {
        console.error("Ошибка при обновлении статуса:", error);
      }

      // Обновляем локальное состояние
      setBookings(
        bookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking,
        ),
      );
    } catch (error) {
      console.error("Ошибка при обновлении статуса:", error);
    } finally {
      setUpdatingStatus(updatingStatus.filter((id) => id !== bookingId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "requires_payment":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Базовые списки по типам
  const tableReservationsAll = bookings.filter((b) => b.type === "table");
  const eventBookingsAll = bookings.filter((b) => b.type === "event");

  // Счетчики статусов/оплат
  const tableStatusCounts = {
    pending: tableReservationsAll.filter((b) => b.status === "pending").length,
    confirmed: tableReservationsAll.filter((b) => b.status === "confirmed").length,
    completed: tableReservationsAll.filter((b) => b.status === "completed").length,
    cancelled: tableReservationsAll.filter((b) => b.status === "cancelled").length,
  };

  // Промежуточные списки для консистентных счетчиков в событиях
  const eventFilteredByStatus =
    statusFilterEvents === "all"
      ? eventBookingsAll
      : eventBookingsAll.filter((b) => b.status === statusFilterEvents);

  const eventFilteredByPayment =
    paymentFilterEvents === "all"
      ? eventBookingsAll
      : eventBookingsAll.filter(
          (b) => (b.paymentStatus ?? "requires_payment") === paymentFilterEvents,
        );

  const eventStatusCounts = {
    pending: eventFilteredByPayment.filter((b) => b.status === "pending").length,
    confirmed: eventFilteredByPayment.filter((b) => b.status === "confirmed").length,
    completed: eventFilteredByPayment.filter((b) => b.status === "completed").length,
    cancelled: eventFilteredByPayment.filter((b) => b.status === "cancelled").length,
  };

  const eventPaymentCounts = {
    paid: eventFilteredByStatus.filter((b) => b.paymentStatus === "paid").length,
    pending: eventFilteredByStatus.filter((b) => b.paymentStatus === "pending").length,
    requires_payment: eventFilteredByStatus.filter(
      (b) => (b.paymentStatus ?? "requires_payment") === "requires_payment",
    ).length,
  };

  // Применение фильтров
  const tableReservations = tableReservationsAll.filter(
    (b) => statusFilterTables === "all" || b.status === statusFilterTables,
  );

  const eventBookings = eventBookingsAll
    .filter((b) => statusFilterEvents === "all" || b.status === statusFilterEvents)
    .filter(
      (b) =>
        paymentFilterEvents === "all" ||
        (b.paymentStatus ?? "requires_payment") === paymentFilterEvents,
    );

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          Загрузка бронирований...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Управление бронированиями</h3>
        <Button
          onClick={fetchBookings}
          variant="outline"
          size="sm"
          data-testid="btn-refresh-bookings"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Обновить
        </Button>
      </div>

      <Tabs defaultValue="tables" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tables" data-testid="tab-tables">
            Столики (<span data-testid="tab-tables-count">{tableReservationsAll.length}</span>)
          </TabsTrigger>
          <TabsTrigger value="events" data-testid="tab-events">
            Мероприятия (<span data-testid="tab-events-count">{eventBookingsAll.length}</span>)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-4">
          {/* Панель фильтров по статусам для столиков */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Статус:</span>
            <ToggleGroup
              type="single"
              value={statusFilterTables}
              onValueChange={(value) => {
                if (value) setStatusFilterTables(value as typeof statusFilterTables);
              }}
              size="sm"
              variant="outline"
              aria-label="Фильтр статуса столиков"
            >
              <ToggleGroupItem value="all" data-testid="tables-status-all">
                Все (
                <span data-testid="tables-status-all-count">{tableReservationsAll.length}</span>)
              </ToggleGroupItem>
              <ToggleGroupItem value="pending" data-testid="tables-status-pending">
                Ожидает (
                <span data-testid="tables-status-pending-count">{tableStatusCounts.pending}</span>)
              </ToggleGroupItem>
              <ToggleGroupItem value="confirmed" data-testid="tables-status-confirmed">
                Подтверждено (
                <span data-testid="tables-status-confirmed-count">
                  {tableStatusCounts.confirmed}
                </span>
                )
              </ToggleGroupItem>
              <ToggleGroupItem value="completed" data-testid="tables-status-completed">
                Завершено (
                <span data-testid="tables-status-completed-count">
                  {tableStatusCounts.completed}
                </span>
                )
              </ToggleGroupItem>
              <ToggleGroupItem value="cancelled" data-testid="tables-status-cancelled">
                Отменено (
                <span data-testid="tables-status-cancelled-count">
                  {tableStatusCounts.cancelled}
                </span>
                )
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {tableReservations.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Нет бронирований столиков</p>
              </CardContent>
            </Card>
          ) : (
            tableReservations.map((booking) => (
              <Card
                key={booking.id}
                className="border-l-4 border-l-blue-500"
                data-testid={`table-booking-card-${booking.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{booking.name}</CardTitle>
                      <div className="mt-2 flex gap-2">
                        <Badge
                          className={getStatusColor(booking.status)}
                          data-testid="table-status-badge"
                        >
                          {booking.status === "pending"
                            ? "Ожидает"
                            : booking.status === "confirmed"
                              ? "Подтверждено"
                              : booking.status === "cancelled"
                                ? "Отменено"
                                : "Завершено"}
                        </Badge>
                      </div>
                    </div>
                    {/* edited: text-gray-500 -> text-muted-foreground */}
                    <div className="text-right text-sm text-muted-foreground">
                      <p>Создано: {formatDate(booking.createdAt)}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        {/* edited: text-gray-400 -> text-muted-foreground */}
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {booking.date} в {booking.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {/* edited: text-gray-400 -> text-muted-foreground */}
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.guests} гостей</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {/* edited: text-gray-400 -> text-muted-foreground */}
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.phone}</span>
                      </div>
                      {booking.email && (
                        <div className="flex items-center gap-2 text-sm">
                          {/* edited: text-gray-400 -> text-muted-foreground */}
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.email}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      {booking.specialRequests && (
                        <div>
                          <p className="mb-1 text-sm font-medium text-muted-foreground">
                            Особые пожелания:
                          </p>
                          {/* edited: text-gray-600 bg-gray-50 -> text-muted-foreground bg-muted */}
                          <p className="rounded bg-muted p-2 text-sm text-muted-foreground">
                            {booking.specialRequests}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Select
                      value={booking.status}
                      onValueChange={(value) => updateBookingStatus(booking.id, value)}
                      disabled={updatingStatus.includes(booking.id)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Ожидает</SelectItem>
                        <SelectItem value="confirmed">Подтверждено</SelectItem>
                        <SelectItem value="completed">Завершено</SelectItem>
                        <SelectItem value="cancelled">Отменено</SelectItem>
                      </SelectContent>
                    </Select>

                    {updatingStatus.includes(booking.id) && (
                      <Loader2 className="mt-2 h-4 w-4 animate-spin" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          {/* Панель фильтров для мероприятий: статус + оплата */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Статус:</span>
              <Button
                size="sm"
                variant={statusFilterEvents === "all" ? "default" : "outline"}
                onClick={() => setStatusFilterEvents("all")}
                data-testid="events-status-all"
              >
                Все (
                <span data-testid="events-status-all-count">{eventFilteredByPayment.length}</span>)
              </Button>
              <Button
                size="sm"
                variant={statusFilterEvents === "pending" ? "default" : "outline"}
                onClick={() => setStatusFilterEvents("pending")}
                data-testid="events-status-pending"
              >
                Ожидает (
                <span data-testid="events-status-pending-count">{eventStatusCounts.pending}</span>)
              </Button>
              <Button
                size="sm"
                variant={statusFilterEvents === "confirmed" ? "default" : "outline"}
                onClick={() => setStatusFilterEvents("confirmed")}
                data-testid="events-status-confirmed"
              >
                Подтверждено (
                <span data-testid="events-status-confirmed-count">
                  {eventStatusCounts.confirmed}
                </span>
                )
              </Button>
              <Button
                size="sm"
                variant={statusFilterEvents === "completed" ? "default" : "outline"}
                onClick={() => setStatusFilterEvents("completed")}
                data-testid="events-status-completed"
              >
                Завершено (
                <span data-testid="events-status-completed-count">
                  {eventStatusCounts.completed}
                </span>
                )
              </Button>
              <Button
                size="sm"
                variant={statusFilterEvents === "cancelled" ? "default" : "outline"}
                onClick={() => setStatusFilterEvents("cancelled")}
                data-testid="events-status-cancelled"
              >
                Отменено (
                <span data-testid="events-status-cancelled-count">
                  {eventStatusCounts.cancelled}
                </span>
                )
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Оплата:</span>
              <Button
                size="sm"
                variant={paymentFilterEvents === "all" ? "default" : "outline"}
                onClick={() => setPaymentFilterEvents("all")}
                data-testid="events-payment-all"
              >
                Все (
                <span data-testid="events-payment-all-count">{eventFilteredByStatus.length}</span>)
              </Button>
              <Button
                size="sm"
                variant={paymentFilterEvents === "paid" ? "default" : "outline"}
                onClick={() => setPaymentFilterEvents("paid")}
                data-testid="events-payment-paid"
              >
                Оплачено (
                <span data-testid="events-payment-paid-count">{eventPaymentCounts.paid}</span>)
              </Button>
              <Button
                size="sm"
                variant={paymentFilterEvents === "pending" ? "default" : "outline"}
                onClick={() => setPaymentFilterEvents("pending")}
                data-testid="events-payment-pending"
              >
                Ожидает оплаты (
                <span data-testid="events-payment-pending-count">{eventPaymentCounts.pending}</span>
                )
              </Button>
              <Button
                size="sm"
                variant={paymentFilterEvents === "requires_payment" ? "default" : "outline"}
                onClick={() => setPaymentFilterEvents("requires_payment")}
                data-testid="events-payment-requires_payment"
              >
                Требует оплаты (
                <span data-testid="events-payment-requires_payment-count">
                  {eventPaymentCounts.requires_payment}
                </span>
                )
              </Button>
            </div>
          </div>

          {eventBookings.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Нет бронирований мероприятий</p>
              </CardContent>
            </Card>
          ) : (
            eventBookings.map((booking) => (
              <Card
                key={booking.id}
                className="border-l-4 border-l-green-500"
                data-testid={`event-booking-card-${booking.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{booking.name}</CardTitle>
                      <p className="text-muted-foreground">{booking.eventTitle}</p>
                      <div className="mt-2 flex gap-2">
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status === "pending"
                            ? "Ожидает"
                            : booking.status === "confirmed"
                              ? "Подтверждено"
                              : booking.status === "cancelled"
                                ? "Отменено"
                                : "Завершено"}
                        </Badge>
                        {booking.paymentStatus && (
                          <Badge
                            className={getPaymentStatusColor(booking.paymentStatus)}
                            data-testid="event-payment-badge"
                          >
                            {booking.paymentStatus === "paid"
                              ? "Оплачено"
                              : booking.paymentStatus === "pending"
                                ? "Ожидает оплаты"
                                : booking.paymentStatus === "requires_payment"
                                  ? "Требует оплаты"
                                  : booking.paymentStatus}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {/* edited: text-gray-500 -> text-muted-foreground */}
                    <div className="text-right text-sm text-muted-foreground">
                      <p>Создано: {formatDate(booking.createdAt)}</p>
                      {booking.totalAmount && (
                        <p className="text-lg font-medium text-foreground">
                          {booking.totalAmount} ₽
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        {/* edited: text-gray-400 -> text-muted-foreground */}
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.tickets} билетов</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {/* edited: text-gray-400 -> text-muted-foreground */}
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.phone}</span>
                      </div>
                      {booking.email && (
                        <div className="flex items-center gap-2 text-sm">
                          {/* edited: text-gray-400 -> text-muted-foreground */}
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.email}</span>
                        </div>
                      )}
                      {booking.paymentMethod && (
                        <div className="flex items-center gap-2 text-sm">
                          {/* edited: text-gray-400 -> text-muted-foreground */}
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {booking.paymentMethod === "card"
                              ? "Онлайн оплата"
                              : "Оплата при посещении"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Select
                      value={booking.status}
                      onValueChange={(value) => updateBookingStatus(booking.id, value)}
                      disabled={updatingStatus.includes(booking.id)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Ожидает</SelectItem>
                        <SelectItem value="confirmed">Подтверждено</SelectItem>
                        <SelectItem value="completed">Завершено</SelectItem>
                        <SelectItem value="cancelled">Отменено</SelectItem>
                      </SelectContent>
                    </Select>

                    {updatingStatus.includes(booking.id) && (
                      <Loader2 className="mt-2 h-4 w-4 animate-spin" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
