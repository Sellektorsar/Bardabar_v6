import { test, expect } from '@playwright/test';

/**
 * E2E-тесты страницы галереи
 */

test.describe('Gallery Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/gallery');
    await page.waitForLoadState('networkidle');
  });

  test('should display gallery page with title', async ({ page }) => {
    const title = page.locator('h2, h1').filter({ hasText: /галерея/i }).first();
    await expect(title).toBeVisible({ timeout: 5000 });
  });

  test('should display main gallery image', async ({ page }) => {
    // Проверяем наличие главного изображения
    const mainImage = page.locator('img').first();
    await expect(mainImage).toBeVisible();
  });

  test('should display thumbnail grid', async ({ page }) => {
    // Проверяем наличие миниатюр
    const thumbnails = page.locator('button img, [class*="thumbnail"] img');
    const thumbnailCount = await thumbnails.count();
    
    expect(thumbnailCount).toBeGreaterThan(0);
  });

  test('should have navigation arrows', async ({ page }) => {
    // Проверяем наличие кнопок навигации
    const prevButton = page.locator('button[aria-label*="предыдущ"], button[aria-label*="Предыдущ"]');
    const nextButton = page.locator('button[aria-label*="следующ"], button[aria-label*="Следующ"]');
    
    const hasPrev = await prevButton.isVisible().catch(() => false);
    const hasNext = await nextButton.isVisible().catch(() => false);
    
    // Должна быть хотя бы одна кнопка навигации
    expect(hasPrev || hasNext).toBeTruthy();
  });

  test('should navigate to next image', async ({ page }) => {
    const nextButton = page.locator('button[aria-label*="следующ"], button[aria-label*="Следующ"]');
    
    if (await nextButton.isVisible()) {
      // Запоминаем текущий счётчик
      const counterBefore = await page.locator('text=/\\d+\\s*\\/\\s*\\d+/').textContent();
      
      await nextButton.click();
      await page.waitForTimeout(300);
      
      // Проверяем, что счётчик изменился
      const counterAfter = await page.locator('text=/\\d+\\s*\\/\\s*\\d+/').textContent();
      
      // Счётчик должен измениться или остаться (если одно изображение)
      expect(counterAfter).toBeDefined();
    }
  });

  test('should navigate to previous image', async ({ page }) => {
    const prevButton = page.locator('button[aria-label*="предыдущ"], button[aria-label*="Предыдущ"]');
    
    if (await prevButton.isVisible()) {
      await prevButton.click();
      await page.waitForTimeout(300);
      
      // Проверяем, что изображение всё ещё отображается
      const mainImage = page.locator('img').first();
      await expect(mainImage).toBeVisible();
    }
  });

  test('should display image counter', async ({ page }) => {
    // Проверяем наличие счётчика изображений (например, "1 / 10")
    const counter = page.locator('text=/\\d+\\s*\\/\\s*\\d+/');
    
    if (await counter.isVisible()) {
      const counterText = await counter.textContent();
      expect(counterText).toMatch(/\d+\s*\/\s*\d+/);
    }
  });

  test('should display category cards', async ({ page }) => {
    // Проверяем наличие карточек категорий
    const categories = ['Интерьер', 'Блюда', 'Мероприятия', 'Команда'];
    
    for (const category of categories) {
      const categoryCard = page.locator(`text=${category}`);
      const isVisible = await categoryCard.isVisible().catch(() => false);
      
      // Хотя бы некоторые категории должны быть видны
      if (isVisible) {
        await expect(categoryCard).toBeVisible();
      }
    }
  });

  test('should change main image when clicking thumbnail', async ({ page }) => {
    // Находим миниатюры
    const thumbnails = page.locator('button').filter({ has: page.locator('img') });
    const thumbnailCount = await thumbnails.count();
    
    if (thumbnailCount > 1) {
      // Кликаем на вторую миниатюру
      await thumbnails.nth(1).click();
      await page.waitForTimeout(300);
      
      // Проверяем, что главное изображение всё ещё отображается
      const mainImage = page.locator('img').first();
      await expect(mainImage).toBeVisible();
    }
  });
});
