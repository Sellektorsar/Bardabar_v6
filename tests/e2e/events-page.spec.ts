import { test, expect } from '@playwright/test';

/**
 * E2E-тесты публичной страницы мероприятий
 */

test.describe('Events Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/events');
    await page.waitForLoadState('networkidle');
  });

  test('should display events page with title', async ({ page }) => {
    const title = page.locator('h2, h1').filter({ hasText: /мероприятия/i }).first();
    await expect(title).toBeVisible({ timeout: 5000 });
  });

  test('should display event cards', async ({ page }) => {
    // Проверяем наличие карточек мероприятий
    const eventCards = page.locator('[class*="card"], [class*="Card"]').filter({ has: page.locator('img') });
    const cardCount = await eventCards.count();
    
    expect(cardCount).toBeGreaterThan(0);
  });

  test('should display event details', async ({ page }) => {
    // Проверяем, что у мероприятий есть даты
    const dateElements = page.locator('text=/\\d{1,2}.*\\d{4}|января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря/i');
    const dateCount = await dateElements.count();
    
    expect(dateCount).toBeGreaterThan(0);
  });

  test('should display event prices', async ({ page }) => {
    // Проверяем наличие цен или "Бесплатно"
    const priceElements = page.locator('text=/\\d+\\s*₽|бесплатно/i');
    const priceCount = await priceElements.count();
    
    expect(priceCount).toBeGreaterThan(0);
  });

  test('should have booking buttons for events', async ({ page }) => {
    // Проверяем наличие кнопок бронирования
    const bookingButtons = page.locator('button').filter({ hasText: /забронировать|записаться|купить/i });
    const buttonCount = await bookingButtons.count();
    
    expect(buttonCount).toBeGreaterThan(0);
  });

  test('should open event booking modal', async ({ page }) => {
    // Находим первую кнопку бронирования
    const bookingButton = page.locator('button').filter({ hasText: /забронировать/i }).first();
    
    if (await bookingButton.isVisible()) {
      await bookingButton.click();
      await page.waitForTimeout(500);
      
      // Проверяем, что открылся модал или форма бронирования
      const modal = page.locator('[role="dialog"], [class*="modal"], [class*="Modal"]');
      const isModalVisible = await modal.isVisible().catch(() => false);
      
      // Либо модал открылся, либо мы перешли на страницу бронирования
      expect(isModalVisible || page.url().includes('booking')).toBeTruthy();
    }
  });

  test('should display event types/categories', async ({ page }) => {
    // Проверяем наличие типов мероприятий
    const eventTypes = page.locator('text=/музыка|мастер-класс|праздник|кулинария/i');
    const typeCount = await eventTypes.count();
    
    expect(typeCount).toBeGreaterThan(0);
  });

  test('should display CTA section for custom events', async ({ page }) => {
    // Проверяем наличие секции для заказа своего мероприятия
    await expect(page.getByText(/провести.*мероприятие|свое мероприятие/i)).toBeVisible();
  });
});
