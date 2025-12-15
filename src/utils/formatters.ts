/**
 * Форматирование телефонного номера в формат +7 (XXX) XXX-XX-XX
 */
export function formatPhoneNumber(value: string): string {
  let digits = value.replace(/\D/g, "");

  if (!digits) return "";

  // Заменяем 8 на 7 в начале
  if (digits.startsWith("8")) {
    digits = "7" + digits.slice(1);
  }

  // Добавляем 7 если номер начинается с 9
  if (!digits.startsWith("7")) {
    digits = digits.startsWith("9") ? "7" + digits : "7" + digits.slice(0, 10);
  }

  // Ограничиваем до 11 цифр
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

  return formatted;
}

/**
 * Проверка валидности телефонного номера (минимум 11 цифр)
 */
export function isValidPhone(phone: string): boolean {
  return phone.replace(/\D/g, "").length >= 11;
}

/**
 * Проверка валидности email
 */
export function isValidEmail(email: string): boolean {
  if (!email.trim()) return true; // Пустой email валиден (необязательное поле)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Форматирование даты в русском формате
 */
export function formatDateRu(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Форматирование даты и времени
 */
export function formatDateTimeRu(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Форматирование номера карты (добавление пробелов)
 */
export function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  const matches = cleaned.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || "";
  const parts = [];

  for (let i = 0; i < match.length; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  return parts.length ? parts.join(" ") : match;
}

/**
 * Форматирование срока действия карты (MM/YY)
 */
export function formatExpiryDate(value: string): string {
  const cleaned = value.replace(/\D+/g, "");
  if (cleaned.length >= 2) {
    return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
  }
  return cleaned;
}
