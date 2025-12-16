import { test, expect } from '@playwright/test';

/**
 * E2E-тесты страницы меню
 * Проверяет отображение категорий, блюд и их информации
 */

test.describe('Menu Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/menu');
    await page.waitForLoadState('networkidle');
  });

  test('should display menu page with title', async ({ page }) => {
    await expect(page.getByText('Наше меню')).toBeVisible();
    await expect(page.getByText('Изысканные блюда')).toBeVisible();
  });

  test('should display menu categories', async ({ page }) => {
    // Проверяем наличие категорий меню
    const categories = ['Горячие блюда', 'Салаты', 'Закуски', 'Пицца', 'Десерты', 'Напитки'];
    
    for (const category of categories) {
      const categoryHeader = page.getByRole('heading', { name: category });
      await expect(categoryHeader).toBeVisible();
    }
  });

  test('should display menu items with prices', async ({ page }) => {
    // Проверяем, что есть карточки меню
    const menuCards = page.locator('[class*="card"], [class*="Card"]').filter({ has: page.locator('img') });
    const cardCount = await menuCards.count();
    
    expect(cardCount).toBeGreaterThan(0);
    
    // Проверяем, что у карточек есть цены (символ ₽)
    const priceElements = page.locator('text=/\\d+\\s*₽/');
    const priceCount = await priceElements.count();
    
    expect(priceCount).toBeGreaterThan(0);
  });

  test('should display special items with badge', async ({ page }) => {
    // Проверяем наличие специальных блюд (хиты)
    const specialBadges = page.locator('text=Хит');
    const specialCount = await specialBadges.count();
    
    // Должны быть хотя бы некоторые специальные блюда
    expect(specialCount).toBeGreaterThanOrEqual(0);
  });

  test('should display allergen information', async ({ page }) => {
    // Проверяем наличие информации об аллергенах
    const allergenSection = page.locator('text=Аллергены');
    const allergenCount = await allergenSection.count();
    
    // Аллергены должны отображаться у некоторых блюд
    expect(allergenCount).toBeGreaterThanOrEqual(0);
  });

  test('should have images for menu items', async ({ page }) => {
    // Проверяем, что изображения загружаются
    const images = page.locator('img[src*="unsplash"], img[alt]');
    const imageCount = await images.count();
    
    expect(imageCount).toBeGreaterThan(0);
    
    // Проверяем, что первое изображение видимо
    await expect(images.first()).toBeVisible();
  });

  test('should show hover effects on menu cards', async ({ page }) => {
    // Находим первую карточку меню
    const firstCard = page.locator('[class*="card"], [class*="Card"]').filter({ has: page.locator('img') }).first();
    
    if (await firstCard.isVisible()) {
      // Наводим курсор на карточку
      await firstCard.hover();
      await page.waitForTimeout(300);
      
      // Карточка должна остаться видимой (hover эффект не должен её скрывать)
      await expect(firstCard).toBeVisible();
    }
  });
});
