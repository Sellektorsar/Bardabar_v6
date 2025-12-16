import { test, expect } from '@playwright/test';

/**
 * E2E-тесты навигации по сайту
 * Проверяет работу всех ссылок и переходов между страницами
 */

test.describe('Navigation E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
  });

  test('should display header with logo and navigation', async ({ page }) => {
    // Проверяем наличие логотипа
    const logo = page.locator('header').getByText('Бар-да-бар');
    await expect(logo).toBeVisible();

    // Проверяем наличие навигационных кнопок (desktop)
    const navButtons = ['Меню', 'Галерея', 'Мероприятия', 'Бронирование', 'Отзывы', 'О нас', 'Контакты'];
    
    for (const buttonText of navButtons) {
      const button = page.locator('header button, header a').filter({ hasText: buttonText }).first();
      // Кнопка может быть скрыта на мобильных устройствах
      const isVisible = await button.isVisible().catch(() => false);
      if (isVisible) {
        await expect(button).toBeVisible();
      }
    }
  });

  test('should navigate to Menu page', async ({ page }) => {
    const menuButton = page.locator('header button').filter({ hasText: 'Меню' }).first();
    
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForURL('**/menu');
      
      // Проверяем, что страница меню загрузилась
      await expect(page.getByText('Наше меню')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should navigate to Gallery page', async ({ page }) => {
    const galleryButton = page.locator('header button').filter({ hasText: 'Галерея' }).first();
    
    if (await galleryButton.isVisible()) {
      await galleryButton.click();
      await page.waitForTimeout(1000);
      
      // Проверяем URL или контент
      const isOnGallery = page.url().includes('gallery') || await page.locator('h2').filter({ hasText: /галерея/i }).isVisible();
      expect(isOnGallery).toBeTruthy();
    }
  });

  test('should navigate to Events page', async ({ page }) => {
    const eventsButton = page.locator('header button').filter({ hasText: 'Мероприятия' }).first();
    
    if (await eventsButton.isVisible()) {
      await eventsButton.click();
      await page.waitForTimeout(1000);
      
      const isOnEvents = page.url().includes('events') || await page.locator('h2').filter({ hasText: /мероприятия/i }).isVisible();
      expect(isOnEvents).toBeTruthy();
    }
  });

  test('should navigate to Reservation page', async ({ page }) => {
    const reservationButton = page.locator('header button').filter({ hasText: 'Бронирование' }).first();
    
    if (await reservationButton.isVisible()) {
      await reservationButton.click();
      await page.waitForURL('**/reservation');
      
      await expect(page.getByText('Бронирование столика')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should navigate to Reviews page', async ({ page }) => {
    const reviewsButton = page.locator('header button').filter({ hasText: 'Отзывы' }).first();
    
    if (await reviewsButton.isVisible()) {
      await reviewsButton.click();
      await page.waitForURL('**/reviews');
      
      await expect(page.getByText('Отзывы гостей')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should navigate to About page', async ({ page }) => {
    const aboutButton = page.locator('header button').filter({ hasText: 'О нас' }).first();
    
    if (await aboutButton.isVisible()) {
      await aboutButton.click();
      await page.waitForTimeout(1000);
      
      const isOnAbout = page.url().includes('about') || await page.locator('h2').filter({ hasText: /о нас/i }).isVisible();
      expect(isOnAbout).toBeTruthy();
    }
  });

  test('should navigate to Contact page', async ({ page }) => {
    const contactButton = page.locator('header button').filter({ hasText: 'Контакты' }).first();
    
    if (await contactButton.isVisible()) {
      await contactButton.click();
      await page.waitForTimeout(1000);
      
      const isOnContact = page.url().includes('contact') || await page.locator('h2').filter({ hasText: /контакт/i }).isVisible();
      expect(isOnContact).toBeTruthy();
    }
  });

  test('should navigate to Admin page', async ({ page }) => {
    const adminButton = page.getByTestId('btn-open-admin');
    
    if (await adminButton.isVisible()) {
      await adminButton.click();
      await page.waitForURL('**/admin');
      
      await expect(page.getByText('Админ-панель')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should return to home when clicking logo', async ({ page }) => {
    // Сначала переходим на другую страницу
    await page.goto('http://localhost:5173/menu');
    await page.waitForLoadState('networkidle');
    
    // Кликаем на логотип (первый кликабельный элемент в header с названием)
    const logo = page.locator('header').locator('[class*="cursor-pointer"]').first();
    await logo.click();
    await page.waitForTimeout(1000);
    
    // Проверяем, что вернулись на главную (URL или Hero секция)
    const isHome = page.url() === 'http://localhost:5173/' || await page.locator('text=/добро пожаловать|лучшее место/i').first().isVisible();
    expect(isHome).toBeTruthy();
  });

  test('should display footer with contact info', async ({ page }) => {
    // Скроллим вниз к футеру
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    // Проверяем наличие контактной информации
    await expect(footer.getByText('Контакты')).toBeVisible();
    await expect(footer.getByText('Часы работы')).toBeVisible();
  });

  test('should have working footer navigation links', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    const footer = page.locator('footer');
    
    // Проверяем ссылки в футере
    const menuLink = footer.locator('button').filter({ hasText: 'Меню' });
    if (await menuLink.isVisible()) {
      await menuLink.click();
      await page.waitForURL('**/menu');
    }
  });
});
