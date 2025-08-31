import { expect, Page, test } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

/**
 * E2E-тест для вкладки "Мероприятия" в админ-панели
 * Проверяет корректность отображения счетчиков статусов/оплаты и фильтрации бронирований
 */

test.describe("Booking Events Tab E2E Tests", () => {
  let screenshotDir: string;
  let testRunId: string;

  test.beforeEach(async ({ page }) => {
    // Создание уникальной папки для каждого прогона теста
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    testRunId = `events-test-run-${timestamp}`;
    screenshotDir = path.join(process.cwd(), "test-screenshots", testRunId);

    // Создание директории для скриншотов
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    console.log(`📁 Скриншоты будут сохранены в: ${screenshotDir}`);

    // Переход в админ-панель
    await page.goto("http://localhost:5173");
    await page.waitForLoadState("networkidle");

    // Клик по кнопке "Админ" в хедере (устойчивый селектор)
    let adminButton = page.getByTestId("btn-open-admin");
    if (!(await adminButton.isVisible())) {
      // Фолбэк: мобильная версия — явный селектор testid
      const menuToggle = page
        .getByRole("button")
        .filter({ has: page.locator("svg.h-4.w-4") })
        .nth(1);
      await menuToggle.click();
      adminButton = page.getByTestId("btn-open-admin-mobile");
    }
    await expect(adminButton).toBeVisible();
    await adminButton.click();

    // Ожидание загрузки админ-панели
    await page.waitForSelector("text=Админ-панель");
    await expect(page.getByRole("heading", { name: "Админ-панель", level: 2 })).toBeVisible();
  });

  /**
   * Вспомогательная функция для создания скриншотов
   */
  async function takeScreenshot(page: Page, name: string) {
    const screenshotPath = path.join(screenshotDir, `${name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 Скриншот сохранен: ${name}.png`);
  }

  test("Events tab counters and filtering functionality", async ({ page }) => {
    console.log("🚀 Начинаем тест вкладки «Мероприятия»...");

    // 1. Переход на вкладку "Бронирования" в админ-панели
    console.log("📋 Шаг 1: Переходим на вкладку Бронирования");

    const bookingsTab = page.getByRole("tab", { name: /бронирования/i });
    await expect(bookingsTab).toBeVisible();
    await bookingsTab.click();

    // Ожидание загрузки компонента BookingManagement
    await page.waitForSelector("text=Управление бронированиями");
    await expect(
      page.getByRole("heading", { name: "Управление бронированиями", level: 3 }),
    ).toBeVisible();

    // 2. Переход на вкладку "Мероприятия"
    console.log("🔍 Шаг 2: Открываем вкладку Мероприятия");
    const eventsTab = page.getByTestId("tab-events");
    await expect(eventsTab).toBeVisible();
    await eventsTab.click();

    // Проверяем, что счетчик в заголовке вкладки отображается
    const eventsCount = page.getByTestId("tab-events-count");
    await expect(eventsCount).toBeVisible();
    const eventsCountText = await eventsCount.textContent();
    console.log(`📊 Общее количество мероприятий: ${eventsCountText}`);

    await takeScreenshot(page, "01-events-tab-active");

    // 3. Проверка панели фильтров статусов
    console.log("🔧 Шаг 3: Проверяем фильтры статусов мероприятий");

    const statusAllBtn = page.getByTestId("events-status-all");
    const statusPendingBtn = page.getByTestId("events-status-pending");
    const statusConfirmedBtn = page.getByTestId("events-status-confirmed");
    const statusCompletedBtn = page.getByTestId("events-status-completed");
    const statusCancelledBtn = page.getByTestId("events-status-cancelled");

    await expect(statusAllBtn).toBeVisible();
    await expect(statusPendingBtn).toBeVisible();
    await expect(statusConfirmedBtn).toBeVisible();
    await expect(statusCompletedBtn).toBeVisible();
    await expect(statusCancelledBtn).toBeVisible();

    await takeScreenshot(page, "02-events-status-filters-panel");

    // 4. Читаем изначальные счетчики статусов
    console.log("📊 Шаг 4: Читаем изначальные счетчики статусов");

    const evAllCountEl = page.getByTestId("events-status-all-count");
    const evPendingCountEl = page.getByTestId("events-status-pending-count");
    const evConfirmedCountEl = page.getByTestId("events-status-confirmed-count");
    const evCompletedCountEl = page.getByTestId("events-status-completed-count");
    const evCancelledCountEl = page.getByTestId("events-status-cancelled-count");

    await expect(evAllCountEl).toBeVisible();
    await expect(evPendingCountEl).toBeVisible();
    await expect(evConfirmedCountEl).toBeVisible();
    await expect(evCompletedCountEl).toBeVisible();
    await expect(evCancelledCountEl).toBeVisible();

    const evAllCount = parseInt((await evAllCountEl.textContent()) || "0");
    const evPendingCount = parseInt((await evPendingCountEl.textContent()) || "0");
    const evConfirmedCount = parseInt((await evConfirmedCountEl.textContent()) || "0");
    const evCompletedCount = parseInt((await evCompletedCountEl.textContent()) || "0");
    const evCancelledCount = parseInt((await evCancelledCountEl.textContent()) || "0");

    console.log(
      `📈 Счетчики статуса: Все=${evAllCount}, Ожидает=${evPendingCount}, Подтверждено=${evConfirmedCount}, Завершено=${evCompletedCount}, Отменено=${evCancelledCount}`,
    );

    // Проверка математической корректности счетчиков статусов
    const evTotalByStatuses = evPendingCount + evConfirmedCount + evCompletedCount + evCancelledCount;
    expect(evAllCount).toBe(evTotalByStatuses);
    console.log("✅ Счетчики статусов математически корректны");

    // 5. Тестирование фильтрации по статусам
    console.log("🔄 Шаг 5: Тестируем фильтрацию по статусам");

    const visibleEventCards = () => page.locator("[data-testid^='event-booking-card-']");

    // Ожидает
    if (evPendingCount > 0) {
      await statusPendingBtn.click();
      const count = await visibleEventCards().count();
      console.log(`👀 Видимых карточек (Ожидает): ${count}`);
      expect(count).toBe(evPendingCount);
      await takeScreenshot(page, "03-events-status-pending");
    } else {
      console.log("⏭️ Пропускаем фильтр статуса 'Ожидает' — нет данных");
    }

    // Подтверждено
    if (evConfirmedCount > 0) {
      await statusConfirmedBtn.click();
      const count = await visibleEventCards().count();
      console.log(`👀 Видимых карточек (Подтверждено): ${count}`);
      expect(count).toBe(evConfirmedCount);
      await takeScreenshot(page, "04-events-status-confirmed");
    } else {
      console.log("⏭️ Пропускаем фильтр статуса 'Подтверждено' — нет данных");
    }

    // Завершено
    if (evCompletedCount > 0) {
      await statusCompletedBtn.click();
      const count = await visibleEventCards().count();
      console.log(`👀 Видимых карточек (Завершено): ${count}`);
      expect(count).toBe(evCompletedCount);
      await takeScreenshot(page, "05-events-status-completed");
    } else {
      console.log("⏭️ Пропускаем фильтр статуса 'Завершено' — нет данных");
    }

    // Отменено
    if (evCancelledCount > 0) {
      await statusCancelledBtn.click();
      const count = await visibleEventCards().count();
      console.log(`👀 Видимых карточек (Отменено): ${count}`);
      expect(count).toBe(evCancelledCount);
      await takeScreenshot(page, "06-events-status-cancelled");
    } else {
      console.log("⏭️ Пропускаем фильтр статуса 'Отменено' — нет данных");
    }

    // Возвращаемся к "Все"
    await statusAllBtn.click();

    // 6. Проверка панели фильтров оплаты
    console.log("💳 Шаг 6: Проверяем фильтры статусов оплаты");

    const payAllBtn = page.getByTestId("events-payment-all");
    const payPaidBtn = page.getByTestId("events-payment-paid");
    const payPendingBtn = page.getByTestId("events-payment-pending");
    const payRequiresBtn = page.getByTestId("events-payment-requires_payment");

    await expect(payAllBtn).toBeVisible();
    await expect(payPaidBtn).toBeVisible();
    await expect(payPendingBtn).toBeVisible();
    await expect(payRequiresBtn).toBeVisible();

    await takeScreenshot(page, "07-events-payment-filters-panel");

    const payAllCountEl = page.getByTestId("events-payment-all-count");
    const payPaidCountEl = page.getByTestId("events-payment-paid-count");
    const payPendingCountEl = page.getByTestId("events-payment-pending-count");
    const payRequiresCountEl = page.getByTestId("events-payment-requires_payment-count");

    await expect(payAllCountEl).toBeVisible();
    await expect(payPaidCountEl).toBeVisible();
    await expect(payPendingCountEl).toBeVisible();
    await expect(payRequiresCountEl).toBeVisible();

    const payAllCount = parseInt((await payAllCountEl.textContent()) || "0");
    const payPaidCount = parseInt((await payPaidCountEl.textContent()) || "0");
    const payPendingCount = parseInt((await payPendingCountEl.textContent()) || "0");
    const payRequiresCount = parseInt((await payRequiresCountEl.textContent()) || "0");

    console.log(
      `📈 Счетчики оплаты: Все=${payAllCount}, Оплачено=${payPaidCount}, Ожидает оплаты=${payPendingCount}, Требует оплаты=${payRequiresCount}`,
    );

    // Важно: не проверяем математическую корректность оплаты, т.к. возможны записи без paymentStatus

    // Оплачено
    if (payPaidCount > 0) {
      await payPaidBtn.click();
      const cards = visibleEventCards();
      const count = await cards.count();
      console.log(`👀 Видимых карточек (Оплачено): ${count}`);
      expect(count).toBe(payPaidCount);

      for (let i = 0; i < count; i++) {
        const badge = cards.nth(i).getByTestId("event-payment-badge");
        await expect(badge).toHaveText(/Оплачено/i);
      }

      await takeScreenshot(page, "08-events-pay-paid");
    } else {
      console.log("⏭️ Пропускаем фильтр оплаты 'Оплачено' — нет данных");
    }

    // Ожидает оплаты
    if (payPendingCount > 0) {
      await payPendingBtn.click();
      const cards = visibleEventCards();
      const count = await cards.count();
      console.log(`👀 Видимых карточек (Ожидает оплаты): ${count}`);
      expect(count).toBe(payPendingCount);

      for (let i = 0; i < count; i++) {
        const badge = cards.nth(i).getByTestId("event-payment-badge");
        await expect(badge).toHaveText(/Ожидает оплаты/i);
      }

      await takeScreenshot(page, "09-events-pay-pending");
    } else {
      console.log("⏭️ Пропускаем фильтр оплаты 'Ожидает оплаты' — нет данных");
    }

    // Требует оплаты
    if (payRequiresCount > 0) {
      await payRequiresBtn.click();
      const cards = visibleEventCards();
      const count = await cards.count();
      console.log(`👀 Видимых карточек (Требует оплаты): ${count}`);
      expect(count).toBe(payRequiresCount);

      for (let i = 0; i < count; i++) {
        const badge = cards.nth(i).getByTestId("event-payment-badge");
        await expect(badge).toHaveText(/Требует оплаты/i);
      }

      await takeScreenshot(page, "10-events-pay-requires");
    } else {
      console.log("⏭️ Пропускаем фильтр оплаты 'Требует оплаты' — нет данных");
    }

    // 7. Финальная проверка "Все" и итоговое количество карточек
    console.log("🔄 Шаг 7: Возвращаемся к фильтрам 'Все'");
    await statusAllBtn.click();
    await payAllBtn.click();

    const finalCards = visibleEventCards();
    const finalCount = await finalCards.count();
    const evAllCountFinal = parseInt((await evAllCountEl.textContent()) || "0");

    console.log(`✅ Финальная проверка: отображается ${finalCount} из ${evAllCountFinal} мероприятий`);
    expect(finalCount).toBe(evAllCountFinal);

    await takeScreenshot(page, "11-events-final-state");
  });
});