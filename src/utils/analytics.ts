/**
 * Analytics utilities for Yandex.Metrika and Google Analytics
 */

// Extend Window interface for analytics globals
declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// Yandex.Metrika counter ID (replace with actual ID)
const YM_COUNTER_ID = (import.meta as unknown as { env: Record<string, string> }).env.VITE_YM_COUNTER_ID || "";

// Google Analytics measurement ID (replace with actual ID)
const GA_MEASUREMENT_ID = (import.meta as unknown as { env: Record<string, string> }).env.VITE_GA_MEASUREMENT_ID || "";

/**
 * Initialize Yandex.Metrika
 */
export function initYandexMetrika(): void {
  if (!YM_COUNTER_ID || typeof window === "undefined") return;

  // @ts-ignore - Yandex.Metrika global
  window.ym =
    window.ym ||
    function (...args: unknown[]) {
      // @ts-ignore
      (window.ym.a = window.ym.a || []).push(args);
    };
  // @ts-ignore
  window.ym.l = Date.now();

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://mc.yandex.ru/metrika/tag.js";
  document.head.appendChild(script);

  // @ts-ignore
  window.ym(YM_COUNTER_ID, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  });
}

/**
 * Initialize Google Analytics
 */
export function initGoogleAnalytics(): void {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // @ts-ignore
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    // @ts-ignore
    window.dataLayer.push(args);
  }
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID);
}

/**
 * Track page view
 */
export function trackPageView(url: string, title?: string): void {
  // Yandex.Metrika
  if (YM_COUNTER_ID && typeof window !== "undefined") {
    // @ts-ignore
    window.ym?.(YM_COUNTER_ID, "hit", url, { title });
  }

  // Google Analytics
  if (GA_MEASUREMENT_ID && typeof window !== "undefined") {
    // @ts-ignore
    window.gtag?.("event", "page_view", {
      page_path: url,
      page_title: title,
    });
  }
}

/**
 * Track custom event
 */
export function trackEvent(
  category: string,
  action: string,
  label?: string,
  value?: number
): void {
  // Yandex.Metrika
  if (YM_COUNTER_ID && typeof window !== "undefined") {
    // @ts-ignore
    window.ym?.(YM_COUNTER_ID, "reachGoal", action, {
      category,
      label,
      value,
    });
  }

  // Google Analytics
  if (GA_MEASUREMENT_ID && typeof window !== "undefined") {
    // @ts-ignore
    window.gtag?.("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
}

/**
 * Track booking event
 */
export function trackBooking(type: "table" | "event", details?: string): void {
  trackEvent("Booking", `book_${type}`, details);
}

/**
 * Track menu view
 */
export function trackMenuView(category?: string): void {
  trackEvent("Menu", "view_menu", category);
}

/**
 * Track contact form submission
 */
export function trackContactForm(subject: string): void {
  trackEvent("Contact", "submit_form", subject);
}

/**
 * Initialize all analytics
 */
export function initAnalytics(): void {
  initYandexMetrika();
  initGoogleAnalytics();
}
