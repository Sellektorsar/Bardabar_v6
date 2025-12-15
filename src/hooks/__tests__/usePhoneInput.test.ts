import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePhoneInput } from "../usePhoneInput";

describe("usePhoneInput", () => {
  it("initializes with empty value", () => {
    const { result } = renderHook(() => usePhoneInput());
    expect(result.current.value).toBe("");
    expect(result.current.isValid).toBe(false);
  });

  it("initializes with provided value", () => {
    const { result } = renderHook(() => usePhoneInput("79991234567"));
    expect(result.current.value).toBe("+7 (999) 123-45-67");
    expect(result.current.isValid).toBe(true);
  });

  it("formats phone on change", () => {
    const { result } = renderHook(() => usePhoneInput());

    act(() => {
      result.current.onChange({
        target: { value: "9991234567" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.value).toBe("+7 (999) 123-45-67");
    expect(result.current.isValid).toBe(true);
  });

  it("validates incomplete phone as invalid", () => {
    const { result } = renderHook(() => usePhoneInput());

    act(() => {
      result.current.onChange({
        target: { value: "999" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.isValid).toBe(false);
  });

  it("resets value", () => {
    const { result } = renderHook(() => usePhoneInput("79991234567"));

    act(() => {
      result.current.reset();
    });

    expect(result.current.value).toBe("");
    expect(result.current.isValid).toBe(false);
  });
});
