import { expect, Page, test } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

/**
 * E2E-тест для вкладки "Столики" в админ-панели
 * Проверяет корректность отображения счетчиков статусов и фильтрации бронирований
 */

test.describe("Booking Tables Tab E2E Tests", () => {
  let screenshotDir: string;
  let testRunId: string;

  test.beforeEach(async ({ page }) => {
    // Создание уникальной папки для каждого прогона теста
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    testRunId = `tables-test-run-${timestamp}`;
    screenshotDir = path.join(process.cwd(), "test-screenshots", testRunId);

    // Создание директории для скриншотов
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    console.log(`📁 Скриншоты будут сохранены в: ${screenshotDir}`);

    // Переход в админ-панель
    await page.goto("http://localhost:5173");
    await page.waitForLoadState("networkidle");

    // Клик по кнопке "Админ" в хедере
    const adminButton = page.getByRole("button", { name: "Админ" });
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

  test("Tables tab counters and filtering functionality", async ({ page }) => {
    console.log("🚀 Начинаем тест вкладки «Столики»...");

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

    // Скриншот админ-панели с загруженным BookingManagement
    await takeScreenshot(page, "01-admin-booking-management-loaded");

    // 2. Проверка, что по умолчанию открыта вкладка "Столики"
    console.log("🔍 Шаг 2: Проверяем вкладку Столики");

    const tablesTab = page.getByTestId("tab-tables");
    await expect(tablesTab).toBeVisible();
    await expect(tablesTab).toHaveAttribute("data-state", "active");

    // Проверяем, что счетчик в заголовке вкладки отображается
    const tablesCount = page.getByTestId("tab-tables-count");
    await expect(tablesCount).toBeVisible();
    const tablesCountText = await tablesCount.textContent();
    console.log(`📊 Общее количество столиков: ${tablesCountText}`);

    // Скриншот вкладки столиков
    await takeScreenshot(page, "02-tables-tab-active");

    // 3. Проверка панели фильтров статусов
    console.log("🔧 Шаг 3: Проверяем фильтры статусов");

    // Проверка наличия всех кнопок фильтров
    const filterAll = page.getByTestId("tables-status-all");
    const filterPending = page.getByTestId("tables-status-pending");
    const filterConfirmed = page.getByTestId("tables-status-confirmed");
    const filterCompleted = page.getByTestId("tables-status-completed");
    const filterCancelled = page.getByTestId("tables-status-cancelled");

    await expect(filterAll).toBeVisible();
    await expect(filterPending).toBeVisible();
    await expect(filterConfirmed).toBeVisible();
    await expect(filterCompleted).toBeVisible();
    await expect(filterCancelled).toBeVisible();

    // Проверка, что фильтр "Все" активен по умолчанию
    await expect(filterAll).toHaveAttribute("data-state", "on");

    // Скриншот панели фильтров
    await takeScreenshot(page, "03-status-filters-panel");

    // 4. Получение изначальных счетчиков
    console.log("📊 Шаг 4: Читаем изначальные счетчики");

    const allCountEl = page.getByTestId("tables-status-all-count");
    const pendingCountEl = page.getByTestId("tables-status-pending-count");
    const confirmedCountEl = page.getByTestId("tables-status-confirmed-count");
    const completedCountEl = page.getByTestId("tables-status-completed-count");
    const cancelledCountEl = page.getByTestId("tables-status-cancelled-count");

    await expect(allCountEl).toBeVisible();
    await expect(pendingCountEl).toBeVisible();
    await expect(confirmedCountEl).toBeVisible();
    await expect(completedCountEl).toBeVisible();
    await expect(cancelledCountEl).toBeVisible();

    const allCount = parseInt((await allCountEl.textContent()) || "0");
    const pendingCount = parseInt((await pendingCountEl.textContent()) || "0");
    const confirmedCount = parseInt((await confirmedCountEl.textContent()) || "0");
    const completedCount = parseInt((await completedCountEl.textContent()) || "0");
    const cancelledCount = parseInt((await cancelledCountEl.textContent()) || "0");

    console.log(
      `📈 Счетчики: Все=${allCount}, Ожидает=${pendingCount}, Подтверждено=${confirmedCount}, Завершено=${completedCount}, Отменено=${cancelledCount}`,
    );

    // Проверка математической корректности счетчиков
    const totalCount = pendingCount + confirmedCount + completedCount + cancelledCount;
    expect(allCount).toBe(totalCount);
    console.log("✅ Счетчики математически корректны");

    // 5. Тестирование фильтрации по статусу "Ожидает"
    if (pendingCount > 0) {
      console.log("🔄 Шаг 5: Тестируем фильтр 'Ожидает'");

      await filterPending.click();
      await expect(filterPending).toHaveAttribute("data-state", "on");
      await expect(filterAll).toHaveAttribute("data-state", "off");

      // Подсчет видимых карточек бронирований
      const visibleBookings = page.locator("[data-testid^='table-booking-card-']");
      const visibleCount = await visibleBookings.count();

      console.log(`👀 Видимых карточек после фильтрации: ${visibleCount}`);
      expect(visibleCount).toBe(pendingCount);

      // Проверка, что все видимые карточки имеют статус "Ожидает"
      for (let i = 0; i < visibleCount; i++) {
        const booking = visibleBookings.nth(i);
        const statusBadge = booking.getByTestId("table-status-badge");
        await expect(statusBadge).toHaveText(/Ожидает/i);
      }

      await takeScreenshot(page, "04-pending-filter-applied");
      console.log("✅ Фильтр 'Ожидает' работает корректно");
    } else {
      console.log("⏭️ Пропускаем тест фильтра 'Ожидает' - нет данных");
    }

    // 6. Тестирование фильтрации по статусу "Подтверждено"
    if (confirmedCount > 0) {
      console.log("🔄 Шаг 6: Тестируем фильтр 'Подтверждено'");

      await filterConfirmed.click();
      await expect(filterConfirmed).toHaveAttribute("data-state", "on");
      await expect(filterPending).toHaveAttribute("data-state", "off");

      const visibleBookings = page.locator("[data-testid^='table-booking-card-']");
      const visibleCount = await visibleBookings.count();

      console.log(`👀 Видимых карточек после фильтрации: ${visibleCount}`);
      expect(visibleCount).toBe(confirmedCount);

      // Проверка статуса видимых карточек
      for (let i = 0; i < visibleCount; i++) {
        const booking = visibleBookings.nth(i);
        const statusBadge = booking.getByTestId("table-status-badge");
        await expect(statusBadge).toHaveText(/Подтверждено/i);
      }

      await takeScreenshot(page, "05-confirmed-filter-applied");
      console.log("✅ Фильтр 'Подтверждено' работает корректно");
    } else {
      console.log("⏭️ Пропускаем тест фильтра 'Подтверждено' - нет данных");
    }

    // 7. Тестирование фильтрации по статусу "Завершено"
    if (completedCount > 0) {
      console.log("🔄 Шаг 7: Тестируем фильтр 'Завершено'");

      await filterCompleted.click();
      await expect(filterCompleted).toHaveAttribute("data-state", "on");

      const visibleBookings = page.locator("[data-testid^='table-booking-card-']");
      const visibleCount = await visibleBookings.count();

      expect(visibleCount).toBe(completedCount);

      await takeScreenshot(page, "06-completed-filter-applied");
      console.log("✅ Фильтр 'Завершено' работает корректно");
    } else {
      console.log("⏭️ Пропускаем тест фильтра 'Завершено' - нет данных");
    }

    // 8. Тестирование фильтрации по статусу "Отменено"
    if (cancelledCount > 0) {
      console.log("🔄 Шаг 8: Тестируем фильтр 'Отменено'");

      await filterCancelled.click();
      await expect(filterCancelled).toHaveAttribute("data-state", "on");

      const visibleBookings = page.locator("[data-testid^='table-booking-card-']");
      const visibleCount = await visibleBookings.count();

      expect(visibleCount).toBe(cancelledCount);

      await takeScreenshot(page, "07-cancelled-filter-applied");
      console.log("✅ Фильтр 'Отменено' работает корректно");
    } else {
      console.log("⏭️ Пропускаем тест фильтра 'Отменено' - нет данных");
    }

    // 9. Возврат к фильтру "Все" и финальная проверка
    console.log("🔄 Шаг 9: Возвращаемся к фильтру 'Все'");

    await filterAll.click();
    await expect(filterAll).toHaveAttribute("data-state", "on");

    const finalVisibleBookings = page.locator("[data-testid^='table-booking-card-']");
    const finalVisibleCount = await finalVisibleBookings.count();

    expect(finalVisibleCount).toBe(allCount);
    console.log(
      `✅ Финальная проверка: отображается ${finalVisibleCount} из ${allCount} бронирований`,
    );

    await takeScreenshot(page, "08-all-filter-final-check");

    // 10. Проверка функции обновления (если есть демо-данные)
    console.log("🔄 Шаг 10: Тестируем кнопку обновления");

    const refreshButton = page.getByTestId("btn-refresh-bookings");
    await expect(refreshButton).toBeVisible();
    await refreshButton.click();

    // Ожидание завершения обновления (если есть spinner или изменение состояния)
    await page.waitForTimeout(1000);

    await takeScreenshot(page, "09-after-refresh");
    console.log("✅ Кнопка обновления работает");

    console.log("🎉 Тест вкладки 'Столики' завершен успешно!");
  });

  test("Empty state display for tables tab", async ({ page }) => {
    console.log("🚀 Тестируем отображение пустого состояния...");

    // Переход на вкладку "Бронирования"
    const bookingsTab = page.getByRole("tab", { name: /бронирования/i });
    await bookingsTab.click();

    // Проверка вкладки "Столики"
    const tablesTab = page.getByTestId("tab-tables");
    await expect(tablesTab).toBeVisible();

    // Если нет бронирований, проверяем отображение пустого состояния
    const allCountEl = page.getByTestId("tables-status-all-count");
    const allCount = parseInt((await allCountEl.textContent()) || "0");

    if (allCount === 0) {
      console.log("📭 Проверяем пустое состояние");

      const emptyMessage = page.locator("text=Нет бронирований столиков");
      await expect(emptyMessage).toBeVisible();

      await takeScreenshot(page, "empty-state-tables");
      console.log("✅ Пустое состояние отображается корректно");
    } else {
      console.log("⏭️ Пропускаем тест пустого состояния - есть данные");
    }
  });
});
