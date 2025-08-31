import { expect, Page, test } from "@playwright/test";
import { addDays, format } from "date-fns";
// import { ru } from "date-fns/locale"; // removed as unused
import * as fs from "fs";
import * as path from "path";

/**
 * Комплексный e2e-тест для процесса бронирования столика
 * Покрывает полный пользовательский сценарий от открытия приложения до подтверждения
 */

test.describe("Booking Flow E2E Tests", () => {
  let screenshotDir: string;
  let testRunId: string;

  test.beforeEach(async ({ page }) => {
    // Создание уникальной папки для каждого прогона теста
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    testRunId = `test-run-${timestamp}`;
    screenshotDir = path.join(process.cwd(), "test-screenshots", testRunId);

    // Создание директории для скриншотов
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    console.log(`📁 Скриншоты будут сохранены в: ${screenshotDir}`);
  });

  test("Complete booking flow with demo mode verification", async ({ page }) => {
    // Выбираем дату в будущем (в пределах ближайших 5 дней). Если месяц сменится, календарь будет перелистан автоматически ниже.
    const today = new Date();
    const targetDate = addDays(today, 5);

    const testData = {
      name: "Иван Тестов",
      phone: "+7 (999) 123-45-67",
      email: "ivan.testov@example.com",
      date: targetDate, // гарантированно не прошедшая дата
      time: "19:00",
      guests: "4",
      specialRequests: "Столик у окна, если возможно",
    };

    console.log("🚀 Начинаем e2e-тест бронирования столика...");

    // 1. Открытие приложения
    console.log("📂 Шаг 1: Открываем приложение");
    await page.goto("http://localhost:5173"); // Vite dev server по умолчанию

    // Ожидание загрузки страницы
    await page.waitForLoadState("networkidle");

    // Проверка, что приложение загрузилось
    const brandH1 = page.getByRole("heading", { level: 1 }).filter({ hasText: "Бар-да-бар" });
    console.log("👀 Найдено h1 с текстом «Бар-да-бар»: ", await brandH1.count());
    await expect(brandH1.first()).toBeVisible();

    // Скриншот главной страницы
    await takeScreenshot(page, "01-homepage-loaded");

    // 2. Переход в раздел «Бронирование»
    console.log("📋 Шаг 2: Переходим в раздел Бронирование");

    // Проверка наличия кнопки "Бронирование" (без строгого скоупа по header/nav для большей устойчивости)
    const navButtons = page.getByRole("button", { name: "Бронирование" });
    const count = await navButtons.count();
    console.log("👀 Кнопок «Бронирование» найдено:", count);

    if (count > 0) {
      await expect(navButtons.first()).toBeVisible();
      // Клик по кнопке "Бронирование"
      await navButtons.first().click();
    } else {
      // Fallback: используем CTA на главном экране
      const cta = page.getByRole("button", { name: "Забронировать столик" });
      await expect(
        cta,
        "Не найдено ни одной кнопки «Бронирование», кликаем CTA «Забронировать столик»",
      ).toBeVisible();
      await cta.click();
    }

    // Ожидание загрузки формы бронирования
    await page.waitForSelector("text=Бронирование столика");
    await expect(
      page.getByRole("heading", { name: "Бронирование столика", level: 4 }),
    ).toBeVisible();

    // Скриншот страницы бронирования
    await takeScreenshot(page, "02-booking-page-opened");

    // 3. Проверка элементов формы
    console.log("🔍 Шаг 3: Проверяем корректность отображения элементов формы");

    // Проверка всех обязательных полей
    await expect(page.locator("input#name")).toBeVisible();
    await expect(page.locator("input#phone")).toBeVisible();
    await expect(page.locator("input#email")).toBeVisible();
    await expect(page.locator("button", { hasText: "Выберите дату" })).toBeVisible();
    await expect(page.locator('[role="combobox"]', { hasText: "Выберите время" })).toBeVisible();
    await expect(page.locator('[role="combobox"]', { hasText: "Гости" })).toBeVisible();
    await expect(page.locator("textarea#specialRequests")).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    console.log("✅ Все элементы формы отображаются корректно");

    // Скриншот пустой формы
    await takeScreenshot(page, "03-empty-form-validated");

    // 4. Заполнение формы
    console.log("✏️ Шаг 4: Заполняем форму бронирования");

    // Заполнение имени
    await page.locator("input#name").fill(testData.name);

    // Заполнение телефона
    await page.locator("input#phone").fill(testData.phone);

    // Заполнение email
    await page.locator("input#email").fill(testData.email);

    // Выбор даты (улучшенный блок ниже)

    // Открываем календарь: гарантируем, что кнопка в поле зрения
    const openCalendarBtn = page.getByRole("button", { name: /выберите дату/i });
    await openCalendarBtn.scrollIntoViewIfNeeded();
    await openCalendarBtn.click();

    // Ждём появления календаря (react-day-picker)
    const calendarRoot = page.locator(".rdp");
    await expect(calendarRoot).toBeVisible();

    // Выбираем дату по тексту кнопки дня (число). Если нужный день недоступен в текущем месяце, перелистываем месяц вперёд.
    const targetDay = format(testData.date, "d");

    let selected = false;
    for (let i = 0; i < 12; i++) {
      const enabledDay = calendarRoot
        .locator('button:not([disabled]):not([aria-disabled="true"])')
        .filter({ hasText: new RegExp(`^${targetDay}$`) })
        .first();

      if (await enabledDay.count()) {
        await enabledDay.scrollIntoViewIfNeeded();
        await enabledDay.focus();
        await enabledDay.press("Enter");
        selected = true;
        break;
      }

      // Переходим к следующему месяцу
      const nextBtn = calendarRoot.getByRole("button", { name: /next|след/i });
      await expect(nextBtn, "Кнопка переключения на следующий месяц не найдена").toBeVisible();
      await nextBtn.click();
      // небольшая пауза для перерисовки календаря
      await page.waitForTimeout(100);
    }

    // Если конкретный день не найден или недоступен, выбираем первый доступный день как запасной вариант
    if (!selected) {
      const fallbackDay = calendarRoot
        .locator('button:not([disabled]):not([aria-disabled="true"])')
        .first();
      await expect(fallbackDay, "Не найден доступный день в календаре").toBeVisible();
      await fallbackDay.scrollIntoViewIfNeeded();
      await fallbackDay.focus();
      await fallbackDay.press("Enter");
      selected = true;
    }

    expect(selected, "Не удалось выбрать дату в календаре").toBeTruthy();

    // Выбор времени
    const timeCombo = page.locator('[role="combobox"]', { hasText: "Выберите время" });
    await timeCombo.scrollIntoViewIfNeeded();
    await timeCombo.click();

    const timeListbox = page.getByRole("listbox");
    await expect(timeListbox).toBeVisible();

    const timeOption = timeListbox.getByRole("option", { name: testData.time });
    await timeOption.scrollIntoViewIfNeeded();
    // Выбираем через клавиатуру, чтобы обойти проблемы с кликом
    await timeOption.focus();
    await timeOption.press("Enter");

    await expect(timeListbox).toBeHidden();

    // Выбор количества гостей
    const guestsCombo = page.locator('[role="combobox"]', { hasText: "Гости" });
    await guestsCombo.scrollIntoViewIfNeeded();
    await guestsCombo.click();

    const guestsListbox = page.getByRole("listbox");
    await expect(guestsListbox).toBeVisible();

    const guestsOption = guestsListbox.getByRole("option", { name: String(testData.guests) });
    await guestsOption.scrollIntoViewIfNeeded();
    await guestsOption.focus();
    await guestsOption.press("Enter");

    await expect(guestsListbox).toBeHidden();

    // Заполнение особых пожеланий
    await page.locator("textarea#specialRequests").fill(testData.specialRequests);

    console.log("✅ Форма заполнена");

    // Скриншот заполненной формы
    await takeScreenshot(page, "04-form-filled");

    // 5. Отправка формы
    console.log("📤 Шаг 5: Отправляем форму");

    // Проверка, что кнопка отправки активна
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();
    await expect(submitButton).toContainText("Забронировать столик");

    // Клик по кнопке отправки
    await submitButton.click();

    // Ожидание состояния загрузки
    await expect(page.locator("button", { hasText: "Отправляем..." })).toBeVisible();

    console.log("🔄 Форма отправлена, ожидаем ответ...");

    // 6. Проверка сообщения о демо-режиме
    console.log("🎭 Шаг 6: Проверяем сообщение о демо-режиме");

    // Ожидание появления сообщения об успехе
    await page.waitForSelector("text=Демо-режим", { timeout: 10000 });

    // Проверка заголовка и содержимого сообщения
    await expect(page.getByRole("heading", { name: "Демо-режим", level: 3 })).toBeVisible();
    await expect(page.locator("text=Система временно работает в демо-режиме")).toBeVisible();

    // Проверка наличия кнопки для создания нового бронирования
    await expect(page.locator("button", { hasText: "Создать новое бронирование" })).toBeVisible();

    console.log("✅ Сообщение о демо-режиме отображается корректно");

    // Скриншот сообщения о демо-режиме
    await takeScreenshot(page, "05-demo-mode-message");

    // 7. Сброс формы
    console.log("🔄 Шаг 7: Сбрасываем форму для нового бронирования");

    await page.locator("button", { hasText: "Создать новое бронирование" }).click();

    // Проверка, что форма очистилась
    await expect(
      page.getByRole("heading", { name: "Бронирование столика", level: 4 }),
    ).toBeVisible();
    await expect(page.locator("input#name")).toHaveValue("");
    await expect(page.locator("input#phone")).toHaveValue("");
    await expect(page.locator("input#email")).toHaveValue("");

    console.log("✅ Форма успешно сброшена");

    // Финальный скриншот сброшенной формы
    await takeScreenshot(page, "06-form-reset");

    console.log("🎉 E2E-тест бронирования успешно завершен!");
    console.log(`📁 Все скриншоты сохранены в: ${screenshotDir}`);
  });

  /**
   * Вспомогательная функция для создания скриншотов
   * @param page - Страница Playwright
   * @param name - Имя файла скриншота
   */
  async function takeScreenshot(page: Page, name: string) {
    const screenshotPath = path.join(screenshotDir, `${name}.png`);
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
      type: "png",
    });
    console.log(`📸 Скриншот сохранен: ${name}.png`);
  }

  test.afterEach(async () => {
    console.log(`📋 Тест завершен. ID прогона: ${testRunId}`);
  });
});
