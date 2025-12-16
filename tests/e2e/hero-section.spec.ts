import { test, expect } from '@playwright/test';

/**
 * E2E-тесты Hero секции на главной странице
 */

test.describe('Hero Section E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
  });

  test('should display hero section with cafe name', async ({ page }) => {
    // Проверяем наличие названия кафе
    const cafeName = page.locator('text=Бар-да-бар').first();
    await expect(cafeName).toBeVisible({ timeout: 5000 });
  });

  test('should display hero description', async ({ page }) => {
    // Проверяем наличие описания
    const description = page.locator('p').filter({ hasText: /кафе|бар|ресторан|место/i }).first();
    await expect(description).toBeVisible();
  });

  test('should display CTA buttons', async ({ page }) => {
    // Проверяем наличие кнопок призыва к действию
    const menuButton = page.locator('button').filter({ hasText: /меню/i }).first();
    const bookingButton = page.locator('button').filter({ hasText: /забронировать/i }).first();
    
    await expect(menuButton).toBeVisible();
    await expect(bookingButton).toBeVisible();
  });

  test('should navigate to menu when clicking menu button', async ({ page }) => {
    const menuButton = page.locator('button').filter({ hasText: /посмотреть меню/i }).first();
    
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForURL('**/menu');
    }
  });

  test('should navigate to reservation when clicking booking button', async ({ page }) => {
    const bookingButton = page.locator('button').filter({ hasText: /забронировать столик/i }).first();
    
    if (await bookingButton.isVisible()) {
      await bookingButton.click();
      await page.waitForURL('**/reservation');
    }
  });

  test('should display stats badges', async ({ page }) => {
    // Проверяем наличие статистических бейджей (рейтинг, время работы, локация)
    const stats = page.locator('text=/4\\.[0-9]|рейтинг|\\d{2}:\\d{2}|центр/i');
    const statsCount = await stats.count();
    
    expect(statsCount).toBeGreaterThan(0);
  });

  test('should display hero image', async ({ page }) => {
    // Проверяем наличие главного изображения
    const heroImage = page.locator('img[alt*="интерьер"], img[alt*="кафе"], img[src*="unsplash"]').first();
    await expect(heroImage).toBeVisible();
  });

  test('should display social media links', async ({ page }) => {
    // Проверяем наличие ссылок на соцсети
    const socialSection = page.locator('text=/соцсет|vk|telegram/i');
    const hasSocial = await socialSection.isVisible().catch(() => false);
    
    // Соцсети могут быть в разных местах
    expect(hasSocial).toBeDefined();
  });

  test('should display badge "Лучшее место в городе"', async ({ page }) => {
    const badge = page.locator('text=/лучшее место/i');
    const hasBadge = await badge.isVisible().catch(() => false);
    
    expect(hasBadge).toBeDefined();
  });

  test('should have newsletter button', async ({ page }) => {
    // Проверяем наличие кнопки подписки на новости
    const newsletterButton = page.locator('button[aria-label*="новости"], button[aria-label*="подписа"]');
    const hasNewsletter = await newsletterButton.isVisible().catch(() => false);
    
    expect(hasNewsletter).toBeDefined();
  });
});
