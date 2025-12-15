import { describe, it, expect } from "vitest";
import {
  formatPhoneNumber,
  isValidPhone,
  isValidEmail,
  formatDateRu,
  formatCardNumber,
  formatExpiryDate,
} from "../formatters";

describe("formatPhoneNumber", () => {
  it("formats 10-digit phone number correctly", () => {
    expect(formatPhoneNumber("9991234567")).toBe("+7 (999) 123-45-67");
  });

  it("formats 11-digit phone number with 7 prefix", () => {
    expect(formatPhoneNumber("79991234567")).toBe("+7 (999) 123-45-67");
  });

  it("formats 11-digit phone number with 8 prefix", () => {
    expect(formatPhoneNumber("89991234567")).toBe("+7 (999) 123-45-67");
  });

  it("handles phone with spaces and dashes", () => {
    expect(formatPhoneNumber("999 123-45-67")).toBe("+7 (999) 123-45-67");
  });

  it("returns empty string for empty input", () => {
    expect(formatPhoneNumber("")).toBe("");
  });

  it("handles partial input", () => {
    expect(formatPhoneNumber("999")).toBe("+7 (999");
    expect(formatPhoneNumber("9991")).toBe("+7 (999) 1");
  });
});

describe("isValidPhone", () => {
  it("returns true for valid 11-digit phone", () => {
    expect(isValidPhone("+7 (999) 123-45-67")).toBe(true);
    expect(isValidPhone("79991234567")).toBe(true);
  });

  it("returns false for short phone", () => {
    expect(isValidPhone("999123")).toBe(false);
    expect(isValidPhone("")).toBe(false);
  });
});

describe("isValidEmail", () => {
  it("returns true for valid email", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
    expect(isValidEmail("user.name@domain.ru")).toBe(true);
  });

  it("returns true for empty email (optional field)", () => {
    expect(isValidEmail("")).toBe(true);
    expect(isValidEmail("   ")).toBe(true);
  });

  it("returns false for invalid email", () => {
    expect(isValidEmail("invalid")).toBe(false);
    expect(isValidEmail("test@")).toBe(false);
    expect(isValidEmail("@domain.com")).toBe(false);
  });
});

describe("formatDateRu", () => {
  it("formats ISO date to Russian format", () => {
    const result = formatDateRu("2025-12-16");
    expect(result).toContain("16");
    expect(result).toContain("2025");
  });
});

describe("formatCardNumber", () => {
  it("formats card number with spaces", () => {
    expect(formatCardNumber("4111111111111111")).toBe("4111 1111 1111 1111");
  });

  it("handles partial card number", () => {
    expect(formatCardNumber("411111")).toBe("4111 11");
  });

  it("removes non-digit characters", () => {
    expect(formatCardNumber("4111-1111-1111-1111")).toBe("4111 1111 1111 1111");
  });
});

describe("formatExpiryDate", () => {
  it("formats expiry date as MM/YY", () => {
    expect(formatExpiryDate("1225")).toBe("12/25");
  });

  it("handles partial input", () => {
    expect(formatExpiryDate("12")).toBe("12/");
    expect(formatExpiryDate("1")).toBe("1");
  });
});
