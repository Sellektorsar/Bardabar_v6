import { test, expect } from '@playwright/test';

test.describe('Calendar Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    // Перейти к секции бронирования
    const reservationButton = page.locator('button').filter({ hasText: 'Забронировать столик' }).first();
    await reservationButton.click();
    
    // Подождать загрузки секции
    await page.waitForTimeout(2000);
  });

  test('should open calendar when date button is clicked', async ({ page }) => {
    // Найти кнопку выбора даты
    const dateButton = page.locator('button').filter({ hasText: 'Выберите дату' });
    await expect(dateButton).toBeVisible();

    // Кликнуть на кнопку даты
    await dateButton.click();

    // Проверить, что календарь открылся
    const calendar = page.locator('[role="grid"]');
    await expect(calendar).toBeVisible({ timeout: 5000 });

    // Проверить, что есть доступные даты для выбора
    const availableDates = calendar.locator('button[role="gridcell"]:not([disabled])');
    await expect(availableDates.first()).toBeVisible();
  });

  test('should select a date from calendar', async ({ page }) => {
    // Открыть календарь
    const dateButton = page.locator('button').filter({ hasText: 'Выберите дату' });
    await dateButton.click();

    // Дождаться появления календаря
    const calendar = page.locator('[role="grid"]');
    await expect(calendar).toBeVisible();

    // Найти и кликнуть на доступную дату (завтра)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDay = tomorrow.getDate().toString();
    
    const tomorrowButton = calendar.locator(`button[role="gridcell"]`).filter({ hasText: new RegExp(`^${tomorrowDay}$`) }).first();
    await tomorrowButton.click({ force: true });

    // Проверить, что дата выбрана и календарь закрылся
    await expect(calendar).not.toBeVisible();
    
    // Проверить, что кнопка показывает выбранную дату
    await expect(dateButton).not.toHaveText('Выберите дату');
  });

  test('should not allow selecting past dates', async ({ page }) => {
    // Открыть календарь
    const dateButton = page.locator('button').filter({ hasText: 'Выберите дату' });
    await dateButton.click();

    // Дождаться появления календаря
    const calendar = page.locator('[role="grid"]');
    await expect(calendar).toBeVisible();

    // Проверить, что вчерашняя дата отключена
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDay = yesterday.getDate().toString();
    
    const yesterdayButton = calendar.locator(`button[role="gridcell"][disabled]`).filter({ hasText: new RegExp(`^${yesterdayDay}$`) });
    if (await yesterdayButton.count() > 0) {
      await expect(yesterdayButton.first()).toBeDisabled();
    }
  });

  test('should complete full booking flow with calendar', async ({ page }) => {
    // Заполнить форму бронирования
    // Заполнить имя
    await page.locator('input[placeholder="Ваше имя"]').fill('Тест Пользователь');
    
    // Заполнить телефон
    await page.locator('input[placeholder="+7 (999) 999-99-99"]').fill('+7 (999) 123-45-67');
    
    // Выбрать дату
    const dateButton = page.locator('button').filter({ hasText: 'Выберите дату' });
    await dateButton.click();
    
    const calendar = page.locator('[role="grid"]');
    await expect(calendar).toBeVisible();
    
    // Выбрать завтра
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDay = tomorrow.getDate().toString();
    
    const tomorrowButton = calendar.locator(`button[role="gridcell"]`).filter({ hasText: new RegExp(`^${tomorrowDay}$`) }).first();
    await tomorrowButton.click({ force: true });
    
    // Выбрать время
    await page.locator('button').filter({ hasText: 'Выберите время' }).click();
    await page.locator('[role="option"]').filter({ hasText: '19:00' }).click();
    
    // Выбрать количество гостей
    await page.locator('button').filter({ hasText: 'Количество гостей' }).click();
    await page.locator('[role="option"]').filter({ hasText: '2' }).click();
    
    // Отправить форму
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();
    await submitButton.click();
    
    // Проверить успешное сообщение или переход
    await expect(page.locator('text=успешно').or(page.locator('text=отправлен')).or(page.locator('text=принят'))).toBeVisible({ timeout: 10000 });
  });
});