import { expect, Page, test } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

/**
 * E2E-тест для интеграции бронирования с Supabase
 * Проверяет полный цикл: создание бронирования → отображение в админ-панели → изменение статуса
 */

test.describe("Booking Supabase Integration E2E Tests", () => {
  let screenshotDir: string;
  let testRunId: string;

  // Уникальные данные для каждого теста
  const generateTestData = () => {
    const timestamp = Date.now();
    return {
      name: `Тест Пользователь ${timestamp}`,
      phone: "+7 (999) 123-45-67",
      email: `test${timestamp}@example.com`,
      time: "19:00",
      guests: "4",
      specialRequests: `Тестовое бронирование ${timestamp}`,
    };
  };

  test.beforeEach(async ({ page }) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    testRunId = `supabase-integration-${timestamp}`;
    screenshotDir = path.join(process.cwd(), "test-screenshots", testRunId);

    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  async function takeScreenshot(page: Page, name: string) {
    const screenshotPath = path.join(screenshotDir, `${name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 Скриншот: ${name}.png`);
  }

  test("Full booking flow: create reservation and verify in admin panel", async ({ page }) => {
    const testData = generateTestData();
    console.log("🚀 Тест: создание бронирования и проверка в админ-панели");
    console.log(`📝 Тестовые данные: ${testData.name}`);

    // === ШАГ 1: Создание бронирования ===
    console.log("📋 Шаг 1: Создаем бронирование столика");

    await page.goto("http://localhost:5173");
    await page.waitForLoadState("networkidle");

    // Переход к форме бронирования
    const reservationButton = page.locator("button").filter({ hasText: "Забронировать столик" }).first();
    await reservationButton.click();
    await page.waitForTimeout(1000);

    // Заполнение формы
    await page.locator('input[placeholder="Ваше имя"]').fill(testData.name);
    await page.locator('input[placeholder="+7 (999) 999-99-99"]').fill(testData.phone);
    await page.locator('input[placeholder="your@email.com"]').fill(testData.email);

    // Выбор даты (завтра)
    const dateButton = page.locator("button#date");
    await dateButton.click();
    await page.waitForSelector(".rdp", { timeout: 5000 });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDay = tomorrow.getDate().toString();

    const calendar = page.locator(".rdp");
    await calendar.scrollIntoViewIfNeeded();

    const tomorrowButton = page
      .locator('.rdp button[role="gridcell"]:not([disabled]):not([aria-disabled="true"])')
      .filter({ hasText: new RegExp(`^${tomorrowDay}$`) });
    
    if (await tomorrowButton.count() > 0) {
      await tomorrowButton.first().evaluate((el) => (el as HTMLElement).click());
    } else {
      // Fallback: выбираем первый доступный день
      const firstAvailable = page
        .locator('.rdp button[role="gridcell"]:not([disabled]):not([aria-disabled="true"])')
        .first();
      await firstAvailable.evaluate((el) => (el as HTMLElement).click());
    }

    // Выбор времени
    const timeButton = page.locator("button[id='time']");
    await timeButton.click();
    await page.getByRole("option", { name: testData.time }).evaluate((el) => (el as HTMLElement).click());

    // Выбор количества гостей
    await page.locator("button[id='guests']").click();
    await page.getByRole("option", { name: testData.guests }).evaluate((el) => (el as HTMLElement).click());

    // Особые пожелания
    await page
      .locator('textarea[placeholder="Особые пожелания, аллергии, предпочтения по размещению..."]')
      .fill(testData.specialRequests);

    await takeScreenshot(page, "01-form-filled");

    // Отправка формы
    const submitButton = page.getByRole("button", { name: "Забронировать столик" });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Ожидание результата
    console.log("⏳ Ожидаем ответ от сервера...");
    
    // Проверяем успешное бронирование (без демо-режима!)
    const successHeading = page.getByRole("heading", { name: "Бронирование отправлено!" });
    await expect(successHeading).toBeVisible({ timeout: 15000 });
    
    // Убеждаемся, что это НЕ демо-режим
    const demoHeading = page.getByRole("heading", { name: "Демо-режим" });
    const isDemo = await demoHeading.isVisible().catch(() => false);
    expect(isDemo).toBe(false);
    
    console.log("✅ Бронирование успешно создано в Supabase!");
    await takeScreenshot(page, "02-booking-success");

    // === ШАГ 2: Проверка в админ-панели ===
    console.log("📋 Шаг 2: Проверяем бронирование в админ-панели");

    // Переход на главную
    await page.goto("http://localhost:5173");
    await page.waitForLoadState("networkidle");

    // Открытие админ-панели
    let adminButton = page.getByTestId("btn-open-admin");
    if (!(await adminButton.isVisible())) {
      const menuToggle = page.getByRole("button").filter({ has: page.locator("svg.h-4.w-4") }).nth(1);
      await menuToggle.click();
      adminButton = page.getByTestId("btn-open-admin-mobile");
    }
    await adminButton.click();

    await page.waitForSelector("text=Админ-панель");
    await expect(page.getByRole("heading", { name: "Админ-панель", level: 2 })).toBeVisible();

    // Переход на вкладку "Бронирования"
    const bookingsTab = page.getByRole("tab", { name: /бронирования|брони/i });
    await bookingsTab.click();

    await page.waitForSelector("text=Управление бронированиями");
    await takeScreenshot(page, "03-admin-bookings-tab");

    // Нажимаем кнопку обновления для получения свежих данных
    const refreshButton = page.getByTestId("btn-refresh-bookings");
    await refreshButton.click();
    await page.waitForTimeout(2000);

    // Поиск созданного бронирования по имени
    const bookingCard = page.locator(`text=${testData.name}`).first();
    await expect(bookingCard).toBeVisible({ timeout: 10000 });
    console.log("✅ Бронирование найдено в админ-панели!");

    await takeScreenshot(page, "04-booking-found-in-admin");

    // === ШАГ 3: Изменение статуса бронирования ===
    console.log("📋 Шаг 3: Изменяем статус бронирования");

    // Находим карточку бронирования
    const bookingCardContainer = page.locator("[data-testid^='table-booking-card-']").filter({ hasText: testData.name }).first();
    await expect(bookingCardContainer).toBeVisible();

    // Проверяем начальный статус "Ожидает"
    const statusBadge = bookingCardContainer.getByTestId("table-status-badge");
    await expect(statusBadge).toHaveText(/Ожидает/i);

    // Находим селектор статуса и меняем на "Подтверждено"
    const statusSelect = bookingCardContainer.locator("button").filter({ hasText: /Ожидает|Подтверждено|Завершено|Отменено/i }).first();
    await statusSelect.click();

    const confirmedOption = page.getByRole("option", { name: "Подтверждено" });
    await confirmedOption.click();

    // Ждем обновления
    await page.waitForTimeout(2000);

    // Проверяем, что статус изменился
    await expect(statusBadge).toHaveText(/Подтверждено/i);
    console.log("✅ Статус успешно изменен на 'Подтверждено'!");

    await takeScreenshot(page, "05-status-changed");

    console.log("🎉 Тест интеграции с Supabase успешно завершен!");
  });

  test("Booking appears in correct filter after creation", async ({ page }) => {
    const testData = generateTestData();
    console.log("🚀 Тест: проверка фильтрации после создания бронирования");

    // Создаем бронирование (сокращенная версия)
    await page.goto("http://localhost:5173");
    await page.waitForLoadState("networkidle");

    const reservationButton = page.locator("button").filter({ hasText: "Забронировать столик" }).first();
    await reservationButton.click();
    await page.waitForTimeout(1000);

    await page.locator('input[placeholder="Ваше имя"]').fill(testData.name);
    await page.locator('input[placeholder="+7 (999) 999-99-99"]').fill(testData.phone);

    // Выбор даты
    const dateButton = page.locator("button#date");
    await dateButton.click();
    await page.waitForSelector(".rdp", { timeout: 5000 });

    const firstAvailable = page
      .locator('.rdp button[role="gridcell"]:not([disabled]):not([aria-disabled="true"])')
      .first();
    await firstAvailable.evaluate((el) => (el as HTMLElement).click());

    // Выбор времени
    await page.locator("button[id='time']").click();
    await page.getByRole("option", { name: "19:00" }).evaluate((el) => (el as HTMLElement).click());

    // Выбор гостей
    await page.locator("button[id='guests']").click();
    await page.getByRole("option", { name: "2" }).evaluate((el) => (el as HTMLElement).click());

    // Отправка
    await page.getByRole("button", { name: "Забронировать столик" }).click();

    const successHeading = page.getByRole("heading", { name: "Бронирование отправлено!" });
    await expect(successHeading).toBeVisible({ timeout: 15000 });

    // Переход в админ-панель
    await page.goto("http://localhost:5173");
    await page.waitForLoadState("networkidle");

    let adminButton = page.getByTestId("btn-open-admin");
    if (!(await adminButton.isVisible())) {
      const menuToggle = page.getByRole("button").filter({ has: page.locator("svg.h-4.w-4") }).nth(1);
      await menuToggle.click();
      adminButton = page.getByTestId("btn-open-admin-mobile");
    }
    await adminButton.click();

    await page.waitForSelector("text=Админ-панель");

    const bookingsTab = page.getByRole("tab", { name: /бронирования|брони/i });
    await bookingsTab.click();

    await page.waitForSelector("text=Управление бронированиями");

    // Обновляем данные
    const refreshButton = page.getByTestId("btn-refresh-bookings");
    await refreshButton.click();
    await page.waitForTimeout(2000);

    // Проверяем фильтр "Ожидает"
    const filterPending = page.getByTestId("tables-status-pending");
    await filterPending.click();

    // Бронирование должно быть видно в фильтре "Ожидает"
    const bookingInPending = page.locator(`text=${testData.name}`);
    await expect(bookingInPending).toBeVisible({ timeout: 5000 });
    console.log("✅ Бронирование отображается в фильтре 'Ожидает'");

    // Переключаемся на "Подтверждено" - бронирование не должно быть видно
    const filterConfirmed = page.getByTestId("tables-status-confirmed");
    await filterConfirmed.click();
    await page.waitForTimeout(500);

    const bookingInConfirmed = page.locator(`text=${testData.name}`);
    const isVisibleInConfirmed = await bookingInConfirmed.isVisible().catch(() => false);
    expect(isVisibleInConfirmed).toBe(false);
    console.log("✅ Бронирование НЕ отображается в фильтре 'Подтверждено' (корректно)");

    await takeScreenshot(page, "filter-test-complete");
    console.log("🎉 Тест фильтрации завершен успешно!");
  });

  test("Multiple bookings are correctly counted", async ({ page }) => {
    console.log("🚀 Тест: проверка счетчиков бронирований");

    // Переход в админ-панель
    await page.goto("http://localhost:5173");
    await page.waitForLoadState("networkidle");

    let adminButton = page.getByTestId("btn-open-admin");
    if (!(await adminButton.isVisible())) {
      const menuToggle = page.getByRole("button").filter({ has: page.locator("svg.h-4.w-4") }).nth(1);
      await menuToggle.click();
      adminButton = page.getByTestId("btn-open-admin-mobile");
    }
    await adminButton.click();

    await page.waitForSelector("text=Админ-панель");

    const bookingsTab = page.getByRole("tab", { name: /бронирования|брони/i });
    await bookingsTab.click();

    await page.waitForSelector("text=Управление бронированиями");

    // Обновляем данные
    const refreshButton = page.getByTestId("btn-refresh-bookings");
    await refreshButton.click();
    await page.waitForTimeout(2000);

    // Получаем счетчики
    const allCountEl = page.getByTestId("tables-status-all-count");
    const pendingCountEl = page.getByTestId("tables-status-pending-count");
    const confirmedCountEl = page.getByTestId("tables-status-confirmed-count");
    const completedCountEl = page.getByTestId("tables-status-completed-count");
    const cancelledCountEl = page.getByTestId("tables-status-cancelled-count");

    const allCount = parseInt((await allCountEl.textContent()) || "0");
    const pendingCount = parseInt((await pendingCountEl.textContent()) || "0");
    const confirmedCount = parseInt((await confirmedCountEl.textContent()) || "0");
    const completedCount = parseInt((await completedCountEl.textContent()) || "0");
    const cancelledCount = parseInt((await cancelledCountEl.textContent()) || "0");

    console.log(`📊 Счетчики: Все=${allCount}, Ожидает=${pendingCount}, Подтверждено=${confirmedCount}, Завершено=${completedCount}, Отменено=${cancelledCount}`);

    // Проверка математической корректности
    const totalCount = pendingCount + confirmedCount + completedCount + cancelledCount;
    expect(allCount).toBe(totalCount);
    console.log("✅ Счетчики математически корректны!");

    // Проверяем, что количество карточек соответствует счетчику "Все"
    const visibleBookings = page.locator("[data-testid^='table-booking-card-']");
    const visibleCount = await visibleBookings.count();
    expect(visibleCount).toBe(allCount);
    console.log(`✅ Количество карточек (${visibleCount}) соответствует счетчику "Все" (${allCount})`);

    await takeScreenshot(page, "counters-test-complete");
    console.log("🎉 Тест счетчиков завершен успешно!");
  });
});
