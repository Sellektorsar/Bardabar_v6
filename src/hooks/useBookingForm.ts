import { useCallback, useState } from "react";

import { formatPhoneNumber, isValidEmail, isValidPhone } from "../utils/formatters";

export interface BookingFormData {
  name: string;
  phone: string;
  email: string;
  date: Date | undefined;
  time: string;
  guests: string;
  specialRequests: string;
}

interface ValidationErrors {
  name?: string;
  phone?: string;
  email?: string;
  date?: string;
  time?: string;
  guests?: string;
}

interface UseBookingFormReturn {
  formData: BookingFormData;
  errors: ValidationErrors;
  isValid: boolean;
  isSubmitting: boolean;
  setField: <K extends keyof BookingFormData>(field: K, value: BookingFormData[K]) => void;
  setPhone: (value: string) => void;
  validate: () => boolean;
  reset: () => void;
  setSubmitting: (value: boolean) => void;
}

const initialFormData: BookingFormData = {
  name: "",
  phone: "",
  email: "",
  date: undefined,
  time: "",
  guests: "",
  specialRequests: "",
};

/**
 * Хук для управления формой бронирования столика
 */
export function useBookingForm(): UseBookingFormReturn {
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setSubmitting] = useState(false);

  // Валидация отдельных полей
  const isNameValid = formData.name.trim().length >= 2;
  const isPhoneValid = isValidPhone(formData.phone);
  const isEmailValid = isValidEmail(formData.email);
  const isDateValid = !!formData.date;
  const isTimeValid = !!formData.time;
  const isGuestsValid = !!formData.guests;

  const isValid =
    isNameValid && isPhoneValid && isEmailValid && isDateValid && isTimeValid && isGuestsValid;

  const setField = useCallback(
    <K extends keyof BookingFormData>(field: K, value: BookingFormData[K]) => {
      setFormData((prev: BookingFormData) => ({ ...prev, [field]: value }));
      // Очищаем ошибку при изменении поля
      setErrors((prev: ValidationErrors) => ({ ...prev, [field]: undefined }));
    },
    [],
  );

  const setPhone = useCallback((value: string) => {
    setFormData((prev: BookingFormData) => ({ ...prev, phone: formatPhoneNumber(value) }));
    setErrors((prev: ValidationErrors) => ({ ...prev, phone: undefined }));
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};

    if (formData.name.trim().length < 2) {
      newErrors.name = "Укажите имя (не короче 2 символов)";
    }

    if (!isValidPhone(formData.phone)) {
      newErrors.phone = "Укажите корректный телефон (не менее 10 цифр)";
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = "Укажите корректный email";
    }

    if (!formData.date) {
      newErrors.date = "Выберите дату бронирования";
    }

    if (!formData.time) {
      newErrors.time = "Выберите время бронирования";
    }

    if (!formData.guests) {
      newErrors.guests = "Выберите количество гостей";
    }

    // Проверка даты и времени
    if (formData.date) {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = "Нельзя забронировать на прошедшую дату";
      }

      if (selectedDate.getTime() === today.getTime() && formData.time) {
        const [hours, minutes] = formData.time.split(":").map(Number);
        const selectedDateTime = new Date();
        selectedDateTime.setHours(hours, minutes, 0, 0);

        if (selectedDateTime <= new Date()) {
          newErrors.time = "Выберите время, которое еще не прошло";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const reset = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setSubmitting(false);
  }, []);

  return {
    formData,
    errors,
    isValid,
    isSubmitting,
    setField,
    setPhone,
    validate,
    reset,
    setSubmitting,
  };
}
