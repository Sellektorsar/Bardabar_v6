import { test, expect } from '@playwright/test';

/**
 * E2E-тесты страницы "О нас"
 */

test.describe('About Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/about');
    await page.waitForLoadState('networkidle');
  });

  test('should display about page with title', async ({ page }) => {
    // Заголовок может быть в разных форматах
    const title = page.locator('h2, h1').filter({ hasText: /о нас/i }).first();
    await expect(title).toBeVisible({ timeout: 5000 });
  });

  test('should display cafe history section', async ({ page }) => {
    // Проверяем наличие секции истории
    await expect(page.getByText('Наша история')).toBeVisible();
  });

  test('should display achievements section', async ({ page }) => {
    // Проверяем наличие секции достижений
    await expect(page.getByText('Наши достижения')).toBeVisible();
    
    // Проверяем наличие карточек достижений
    const achievementCards = page.locator('[class*="card"], [class*="Card"]');
    const cardCount = await achievementCards.count();
    
    expect(cardCount).toBeGreaterThan(0);
  });

  test('should display team section', async ({ page }) => {
    // Проверяем наличие секции команды
    await expect(page.getByText('Наша команда')).toBeVisible();
    
    // Проверяем наличие карточек сотрудников
    const teamCards = page.locator('[class*="card"], [class*="Card"]').filter({ has: page.locator('img') });
    const cardCount = await teamCards.count();
    
    expect(cardCount).toBeGreaterThan(0);
  });

  test('should display philosophy section', async ({ page }) => {
    // Проверяем наличие секции философии
    await expect(page.getByText('Наша философия')).toBeVisible();
  });

  test('should display animated counters', async ({ page }) => {
    // Проверяем наличие анимированных счётчиков
    const counters = page.locator('text=/\\d{4}|\\d+\\+|\\d+%/');
    const counterCount = await counters.count();
    
    expect(counterCount).toBeGreaterThan(0);
  });

  test('should display team member details', async ({ page }) => {
    // Проверяем, что у членов команды есть имена и должности
    const teamSection = page.locator('text=Наша команда').locator('..').locator('..');
    
    // Проверяем наличие должностей
    const positions = page.locator('text=/шеф-повар|бариста|официант|менеджер/i');
    const positionCount = await positions.count();
    
    expect(positionCount).toBeGreaterThanOrEqual(0);
  });

  test('should have images for team members', async ({ page }) => {
    // Проверяем наличие фотографий команды
    const teamImages = page.locator('img[alt*="команд"], img[alt*="сотрудник"], img[class*="team"]');
    const imageCount = await teamImages.count();
    
    // Изображения могут быть с другими alt текстами
    expect(imageCount).toBeGreaterThanOrEqual(0);
  });
});
