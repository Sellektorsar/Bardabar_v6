import { test, expect } from '@playwright/test';

test.describe('Calendar Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/reservation');
    
    // Подождать загрузки страницы бронирования
    await page.waitForTimeout(1500);
  });

  test('should open calendar when date button is clicked', async ({ page }) => {
    // Найти кнопку выбора даты
    const dateButton = page.locator('button').filter({ hasText: 'Выберите дату' });
    await expect(dateButton).toBeVisible({ timeout: 5000 });

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
    await expect(dateButton).toBeVisible({ timeout: 5000 });
    await dateButton.click();

    // Дождаться появления календаря
    const calendar = page.locator('[role="grid"]');
    await expect(calendar).toBeVisible({ timeout: 5000 });

    // Найти и кликнуть на доступную дату (завтра или любую доступную)
    const availableDate = calendar.locator('button[role="gridcell"]:not([disabled])').first();
    await availableDate.click({ force: true });

    // Подождать закрытия календаря
    await page.waitForTimeout(500);
    
    // Проверить, что календарь закрылся
    await expect(calendar).not.toBeVisible({ timeout: 5000 });
  });

  test('should not allow selecting past dates', async ({ page }) => {
    // Открыть календарь
    const dateButton = page.locator('button').filter({ hasText: 'Выберите дату' });
    await expect(dateButton).toBeVisible({ timeout: 5000 });
    await dateButton.click();

    // Дождаться появления календаря
    const calendar = page.locator('[role="grid"]');
    await expect(calendar).toBeVisible({ timeout: 5000 });

    // Проверить, что есть отключенные даты (прошедшие)
    const disabledDates = calendar.locator('button[role="gridcell"][disabled]');
    const disabledCount = await disabledDates.count();
    
    // Должны быть прошедшие даты (отключенные)
    expect(disabledCount).toBeGreaterThan(0);
  });

  test('should complete full booking flow with calendar', async ({ page }) => {
    // Заполнить имя
    const nameInput = page.locator('input#name');
    await expect(nameInput).toBeVisible({ timeout: 5000 });
    await nameInput.fill('Тест Пользователь');
    
    // Заполнить телефон
    const phoneInput = page.locator('input#phone');
    await phoneInput.fill('+7 (999) 123-45-67');
    
    // Заполнить email
    const emailInput = page.locator('input#email');
    await emailInput.fill('test@example.com');
    
    // Выбрать дату
    const dateButton = page.locator('button').filter({ hasText: 'Выберите дату' });
    await dateButton.click();
    
    const calendar = page.locator('[role="grid"]');
    await expect(calendar).toBeVisible({ timeout: 5000 });
    
    // Выбрать первую доступную дату
    const availableDate = calendar.locator('button[role="gridcell"]:not([disabled])').first();
    await availableDate.click({ force: true });
    await page.waitForTimeout(500);
    
    // Выбрать время — первый Select (combobox)
    const timeSelect = page.locator('button[role="combobox"]').first();
    await timeSelect.click();
    await page.waitForTimeout(300);
    
    // Выбрать время из списка
    const timeOption = page.locator('[role="option"]').first();
    await timeOption.click();
    await page.waitForTimeout(300);
    
    // Выбрать количество гостей — второй Select (combobox)
    const guestsSelect = page.locator('button[role="combobox"]').nth(1);
    await guestsSelect.click();
    await page.waitForTimeout(300);
    
    const guestsOption = page.locator('[role="option"]').filter({ hasText: '2' }).first();
    await guestsOption.click();
    await page.waitForTimeout(300);
    
    // Проверить, что все поля заполнены и кнопка submit активна
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();
    await expect(submitButton).toContainText('Забронировать');
    
    // Тест успешен — форма полностью заполнена и готова к отправке
  });
});
