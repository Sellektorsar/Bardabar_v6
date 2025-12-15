import { projectId, publicAnonKey } from "../../utils/supabase/info";

const API_BASE = `https://${projectId}.functions.supabase.co/server/make-server-c85ae302`;

// Ошибки API
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ProjectPausedError extends Error {
  constructor() {
    super("Проект приостановлен");
    this.name = "ProjectPausedError";
  }
}

// Регулярки для определения типа ошибки
const PAUSED_TEXT_REGEX = /project\s*paused/i;
const NETWORK_CORS_REGEX =
  /(Failed to fetch|NetworkError|CORS|TypeError: Failed to fetch|TypeError: Load failed|ERR_NETWORK|ERR_BLOCKED_BY_CLIENT)/i;

export const isPausedMessage = (text?: string) => !!text && PAUSED_TEXT_REGEX.test(text);
export const isNetworkError = (message: string) => NETWORK_CORS_REGEX.test(message);

/**
 * Базовый API-клиент для запросов к Supabase Edge Functions
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${publicAnonKey}`,
      ...options.headers,
    },
  });

  // Проверка на паузу проекта
  if (response.status === 540) {
    throw new ProjectPausedError();
  }

  const textBody = await response.clone().text().catch(() => "");

  if (isPausedMessage(textBody)) {
    throw new ProjectPausedError();
  }

  if (!response.ok) {
    let errorMessage = textBody;
    try {
      const errorData = JSON.parse(textBody);
      errorMessage = errorData.error || errorData.message || textBody;
    } catch {
      // Используем текстовое тело как есть
    }
    throw new ApiError(response.status, errorMessage || `HTTP ${response.status}`);
  }

  // Пустой ответ
  if (!textBody) {
    return {} as T;
  }

  try {
    return JSON.parse(textBody) as T;
  } catch {
    return {} as T;
  }
}

// === Reservations API ===

export interface ReservationPayload {
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number | string;
  specialRequests?: string;
}

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export const reservationsApi = {
  create: (data: ReservationPayload) =>
    apiRequest<{ reservation: Reservation }>("/reservations", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAll: () => apiRequest<Reservation[]>("/reservations"),

  updateStatus: (id: string, status: string) =>
    apiRequest<{ reservation: Reservation }>(`/reservations/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};

// === Event Bookings API ===

export interface EventBookingPayload {
  eventId: string;
  name: string;
  phone: string;
  email?: string;
  tickets: number;
  paymentMethod?: string;
}

export interface EventBooking {
  id: string;
  eventId: string;
  name: string;
  phone: string;
  email?: string;
  tickets: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export const eventBookingsApi = {
  create: (data: EventBookingPayload) =>
    apiRequest<{ booking: EventBooking }>("/event-bookings", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// === Payments API ===

export interface PaymentPayload {
  bookingId: string;
  amount: number;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolder: string;
}

export const paymentsApi = {
  process: (data: PaymentPayload) =>
    apiRequest<{ success: boolean; transactionId?: string }>("/process-payment", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// === Notifications API ===

export interface Notification {
  key: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const notificationsApi = {
  getAll: () => apiRequest<Notification[]>("/notifications"),

  markAsRead: (key: string) =>
    apiRequest<{ success: boolean }>(`/notifications/${encodeURIComponent(key)}`, {
      method: "PATCH",
      body: JSON.stringify({ read: true }),
    }),
};

// === Email Settings API ===

export interface EmailSettings {
  enabled: boolean;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  fromEmail?: string;
  fromName?: string;
}

export const emailSettingsApi = {
  get: () => apiRequest<EmailSettings>("/email-settings"),

  update: (data: EmailSettings) =>
    apiRequest<{ success: boolean }>("/email-settings", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
