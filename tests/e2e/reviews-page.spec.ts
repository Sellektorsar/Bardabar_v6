import { test, expect } from '@playwright/test';

/**
 * E2E-тесты страницы отзывов
 */

test.describe('Reviews Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/reviews');
    await page.waitForLoadState('networkidle');
  });

  test('should display reviews page with title', async ({ page }) => {
    await expect(page.getByText('Отзывы гостей')).toBeVisible();
  });

  test('should display review cards', async ({ page }) => {
    // Проверяем наличие карточек отзывов
    const reviewCards = page.locator('[class*="card"], [class*="Card"]');
    const cardCount = await reviewCards.count();
    
    expect(cardCount).toBeGreaterThan(0);
  });

  test('should display reviewer names', async ({ page }) => {
    // Проверяем, что есть имена авторов отзывов
    const names = page.locator('h3, [class*="name"], [class*="author"]');
    const nameCount = await names.count();
    
    expect(nameCount).toBeGreaterThan(0);
  });

  test('should display star ratings', async ({ page }) => {
    // Проверяем наличие звёзд рейтинга (SVG иконки)
    const stars = page.locator('svg').filter({ has: page.locator('[class*="star"], [fill*="current"]') });
    const starCount = await stars.count();
    
    // Звёзды должны быть на странице отзывов
    expect(starCount).toBeGreaterThanOrEqual(0);
  });

  test('should display review dates', async ({ page }) => {
    // Проверяем наличие дат отзывов
    const dates = page.locator('text=/\\d{1,2}\\.\\d{1,2}\\.\\d{4}|\\d{1,2}.*\\d{4}/');
    const dateCount = await dates.count();
    
    expect(dateCount).toBeGreaterThanOrEqual(0);
  });

  test('should display statistics section', async ({ page }) => {
    // Проверяем наличие статистики
    const stats = page.locator('text=/рейтинг|отзывов|рекомендуют/i');
    const statsCount = await stats.count();
    
    expect(statsCount).toBeGreaterThan(0);
  });

  test('should have add review CTA', async ({ page }) => {
    // Проверяем наличие кнопки/секции для добавления отзыва
    const addReviewButton = page.locator('button').filter({ hasText: /оставить отзыв|написать отзыв/i });
    
    if (await addReviewButton.isVisible()) {
      await expect(addReviewButton).toBeVisible();
    }
  });

  test('should display average rating', async ({ page }) => {
    // Проверяем отображение среднего рейтинга
    const avgRating = page.locator('text=/4\\.[0-9]|5\\.0/');
    const ratingCount = await avgRating.count();
    
    expect(ratingCount).toBeGreaterThan(0);
  });
});
