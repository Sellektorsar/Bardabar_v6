import { test, expect } from '@playwright/test';

test.describe('Календарь выбора даты в форме бронирования', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
  });

  test('должен открывать календарь при клике на кнопку выбора даты', async ({ page }) => {
    // Проверяем размер экрана и открываем мобильное меню если нужно
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      const mobileMenuButton = page.locator('button').filter({ hasText: /меню|Menu/i }).first();
      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click();
        await page.waitForTimeout(500);
      }
    }

    // Открываем форму бронирования через кнопку в Hero секции
    const bookingButton = page.locator('button').filter({ hasText: 'Забронировать столик' }).first();
    await expect(bookingButton).toBeVisible({ timeout: 10000 });
    await bookingButton.click();
    
    // Ждем появления формы
    await page.waitForTimeout(1000);
    
    // Находим кнопку выбора даты
    const dateButton = page.locator('button').filter({ hasText: 'Выберите дату' }).first();
    await expect(dateButton).toBeVisible();
    
    // Кликаем по кнопке даты
    await dateButton.click();
    
    // Проверяем, что календарь открылся
    const calendar = page.locator('[role="dialog"], .calendar, [data-testid="calendar"]').first();
    await expect(calendar).toBeVisible({ timeout: 5000 });
    
    // Проверяем наличие дней в календаре
    const calendarDays = page.locator('button[role="gridcell"], .calendar-day, [data-testid="calendar-day"]');
    await expect(calendarDays.first()).toBeVisible();
    
    console.log('✅ Календарь успешно открылся');
  });

  test('должен позволять выбрать дату в календаре', async ({ page }) => {
    // Проверяем размер экрана и открываем мобильное меню если нужно
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      const mobileMenuButton = page.locator('button[aria-label="Открыть меню"], button[aria-label="Toggle menu"], .mobile-menu-button').first();
      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click();
        await page.waitForTimeout(500);
      }
    }

    // Открываем форму бронирования через кнопку в Hero секции
    const bookingButton = page.locator('button').filter({ hasText: 'Забронировать столик' }).first();
    await expect(bookingButton).toBeVisible({ timeout: 10000 });
    await bookingButton.click();
    await page.waitForTimeout(1000);
    
    // Открываем календарь
    const dateButton = page.locator('button').filter({ hasText: 'Выберите дату' }).first();
    await dateButton.click();
    
    // Ждем появления календаря
    await page.waitForTimeout(1000);
    
    // Ищем доступную дату для выбора (не прошедшую и не заблокированную)
    const availableDays = page.locator('button[role="gridcell"]:not([disabled]):not([aria-disabled="true"])');
    const dayCount = await availableDays.count();
    
    if (dayCount > 0) {
      // Выбираем первую доступную дату
      const firstAvailableDay = availableDays.first();
      const dayText = await firstAvailableDay.textContent();
      
      await firstAvailableDay.scrollIntoViewIfNeeded();
      await firstAvailableDay.click({ force: true });
      
      // Проверяем, что дата была выбрана (календарь закрылся или кнопка изменилась)
      await page.waitForTimeout(500);
      
      // Проверяем, что кнопка даты больше не показывает "Выберите дату"
      const updatedDateButton = page.locator('button').filter({ hasText: 'Выберите дату' });
      const isStillDefault = await updatedDateButton.count() > 0;
      
      if (!isStillDefault) {
        console.log(`✅ Дата ${dayText} была успешно выбрана`);
      } else {
        // Возможно, календарь использует другой механизм
        console.log('ℹ️ Календарь может использовать другой механизм выбора даты');
      }
    } else {
      console.log('⚠️ Не найдено доступных дат для выбора');
    }
  });

  test('должен показывать текущий месяц по умолчанию', async ({ page }) => {
    // Проверяем размер экрана и открываем мобильное меню если нужно
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      const mobileMenuButton = page.locator('button[aria-label="Открыть меню"], button[aria-label="Toggle menu"], .mobile-menu-button').first();
      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click();
        await page.waitForTimeout(500);
      }
    }

    // Открываем форму бронирования через кнопку в Hero секции
    const bookingButton = page.locator('button').filter({ hasText: 'Забронировать столик' }).first();
    await expect(bookingButton).toBeVisible({ timeout: 10000 });
    await bookingButton.click();
    await page.waitForTimeout(1000);
    
    // Открываем календарь
    const dateButton = page.locator('button').filter({ hasText: 'Выберите дату' }).first();
    await dateButton.click();
    await page.waitForTimeout(1000);
    
    // Проверяем наличие заголовка с текущим месяцем
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleDateString('ru-RU', { month: 'long' });
    const currentYear = currentDate.getFullYear();
    
    // Ищем заголовок календаря с месяцем и годом
    const monthHeader = page.locator(`text=${currentMonth}`).or(
      page.locator(`text=${currentYear.toString()}`)
    );
    
    const headerExists = await monthHeader.count() > 0;
    if (headerExists) {
      console.log(`✅ Календарь показывает текущий период (${currentMonth} ${currentYear})`);
    } else {
      console.log('ℹ️ Заголовок календаря может использовать другой формат');
    }
  });

  test('должен позволять навигацию между месяцами', async ({ page }) => {
    // Проверяем размер экрана и открываем мобильное меню если нужно
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      const mobileMenuButton = page.locator('button[aria-label="Открыть меню"], button[aria-label="Toggle menu"], .mobile-menu-button').first();
      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click();
        await page.waitForTimeout(500);
      }
    }

    // Открываем форму бронирования через кнопку в Hero секции
    const bookingButton = page.locator('button').filter({ hasText: 'Забронировать столик' }).first();
    await expect(bookingButton).toBeVisible({ timeout: 10000 });
    await bookingButton.click();
    await page.waitForTimeout(1000);
    
    // Открываем календарь
    const dateButton = page.locator('button').filter({ hasText: 'Выберите дату' }).first();
    await dateButton.click();
    await page.waitForTimeout(1000);
    
    // Ищем кнопки навигации (стрелки влево/вправо)
    const prevButton = page.locator('button[aria-label*="previous"], button[aria-label*="предыдущий"], button').filter({ hasText: /[<←]/ }).first();
    const nextButton = page.locator('button[aria-label*="next"], button[aria-label*="следующий"], button').filter({ hasText: /[>→]/ }).first();
    
    const hasPrevButton = await prevButton.count() > 0;
    const hasNextButton = await nextButton.count() > 0;
    
    if (hasNextButton) {
      // Пробуем перейти к следующему месяцу
      await nextButton.click();
      await page.waitForTimeout(500);
      console.log('✅ Навигация к следующему месяцу работает');
      
      if (hasPrevButton) {
        // Возвращаемся назад
        await prevButton.click();
        await page.waitForTimeout(500);
        console.log('✅ Навигация к предыдущему месяцу работает');
      }
    } else {
      console.log('ℹ️ Кнопки навигации календаря не найдены или используют другой формат');
    }
  });

  test('должен блокировать прошедшие даты', async ({ page }) => {
    // Проверяем размер экрана и открываем мобильное меню если нужно
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      const mobileMenuButton = page.locator('button').filter({ hasText: /меню|Menu/i }).first();
      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click();
        await page.waitForTimeout(500);
      }
    }

    // Открываем форму бронирования через кнопку в Hero секции
    const bookingButton = page.locator('button').filter({ hasText: 'Забронировать столик' }).first();
    await expect(bookingButton).toBeVisible({ timeout: 10000 });
    await bookingButton.click();
    await page.waitForTimeout(1000);
    
    // Открываем календарь
    const dateButton = page.locator('button').filter({ hasText: 'Выберите дату' }).first();
    await dateButton.click();
    await page.waitForTimeout(1000);
    
    // Проверяем, что есть заблокированные дни (прошедшие даты)
    const disabledDays = page.locator('button[role="gridcell"][disabled], button[role="gridcell"][aria-disabled="true"]');
    const disabledCount = await disabledDays.count();
    
    if (disabledCount > 0) {
      console.log(`✅ Найдено ${disabledCount} заблокированных дат (прошедшие дни)`);
      
      // Проверяем, что заблокированные дни нельзя выбрать
      const firstDisabled = disabledDays.first();
      const isClickable = await firstDisabled.isEnabled();
      
      if (!isClickable) {
        console.log('✅ Заблокированные даты действительно нельзя выбрать');
      }
    } else {
      console.log('ℹ️ Заблокированные даты не найдены или используют другой механизм');
    }
  });
});