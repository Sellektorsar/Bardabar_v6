import { defineConfig, devices } from "@playwright/test";
import path from "path";

export default defineConfig({
  testDir: path.join(process.cwd(), "tests", "e2e"),
  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  /* Включаем HTML-репортер */
  reporter: [["html", { open: "never" }], ["list"]],
  /* Используем общий контекст */
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "off",
    video: "off",
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    viewport: { width: 1366, height: 1080 },
    locale: "ru-RU",
  },
  /* Запуск на нескольких браузерах */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // Можно добавить Firefox/WebKit при необходимости
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: true,
    timeout: 120000,
  },
});
