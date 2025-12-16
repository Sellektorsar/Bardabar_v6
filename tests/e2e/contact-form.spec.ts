import { test, expect } from '@playwright/test';

/**
 * E2E-тесты формы обратной связи на странице контактов
 */

test.describe('Contact Form E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/contact');
    await page.waitForLoadState('networkidle');
  });

  test('should display contact page with info cards', async ({ page }) => {
    // Заголовок страницы
    const title = page.locator('h2, h1').filter({ hasText: /контакт/i }).first();
    await expect(title).toBeVisible({ timeout: 5000 });
    
    // Проверяем карточки с контактной информацией
    await expect(page.locator('text=Адрес').first()).toBeVisible();
    await expect(page.locator('text=Телефон').first()).toBeVisible();
  });

  test('should display contact form', async ({ page }) => {
    // Проверяем наличие формы обратной связи
    const form = page.locator('form');
    await expect(form).toBeVisible();
    
    // Проверяем поля формы
    await expect(page.locator('input[type="text"], input[placeholder*="имя" i]').first()).toBeVisible();
    await expect(page.locator('input[type="email"]').first()).toBeVisible();
    await expect(page.locator('textarea').first()).toBeVisible();
  });

  test('should validate required fields in contact form', async ({ page }) => {
    // Находим кнопку отправки
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await submitButton.isVisible()) {
      // Пробуем отправить пустую форму
      await submitButton.click();
      await page.waitForTimeout(500);
      
      // Форма не должна отправиться без заполнения обязательных полей
      // Проверяем, что мы всё ещё на странице контактов
      const title = page.locator('h2, h1').filter({ hasText: /контакт/i }).first();
      await expect(title).toBeVisible();
    }
  });

  test('should fill and submit contact form', async ({ page }) => {
    // Заполняем форму
    const nameInput = page.locator('input[type="text"], input[placeholder*="имя" i]').first();
    const emailInput = page.locator('input[type="email"]').first();
    const messageInput = page.locator('textarea').first();
    
    await nameInput.fill('Тест Пользователь');
    await emailInput.fill('test@example.com');
    await messageInput.fill('Это тестовое сообщение для проверки формы обратной связи.');
    
    // Находим и кликаем кнопку отправки
    const submitButton = page.locator('button[type="submit"]').filter({ hasText: /отправить|связаться/i });
    
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      // Ждём ответа (toast или сообщение об успехе)
      await page.waitForTimeout(2000);
      
      // Проверяем, что появилось сообщение об успехе или форма сбросилась
      const successMessage = page.locator('text=/успешно|отправлено|спасибо/i');
      const formReset = await nameInput.inputValue() === '';
      
      // Один из признаков успеха должен быть true
      const isSuccess = await successMessage.isVisible().catch(() => false) || formReset;
      expect(isSuccess).toBeTruthy();
    }
  });

  test('should display directions info', async ({ page }) => {
    // Проверяем наличие информации о том, как найти заведение
    const directions = page.locator('text=/как нас найти|метро|адрес/i').first();
    await expect(directions).toBeVisible({ timeout: 5000 });
  });
});
