import { useState, useCallback } from "react";

import { formatPhoneNumber, isValidPhone } from "../utils/formatters";

interface UsePhoneInputReturn {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: (value: string) => void;
  isValid: boolean;
  reset: () => void;
}

/**
 * Хук для работы с полем ввода телефона
 * Автоматически форматирует номер в формат +7 (XXX) XXX-XX-XX
 */
export function usePhoneInput(initialValue = ""): UsePhoneInputReturn {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue(formatted);
  }, []);

  const reset = useCallback(() => {
    setValue("");
  }, []);

  return {
    value,
    onChange: handleChange,
    setValue,
    isValid: isValidPhone(value),
    reset,
  };
}
