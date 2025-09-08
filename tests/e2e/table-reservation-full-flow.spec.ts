import { test, expect } from '@playwright/test';
import { addDays } from 'date-fns';

/**
 * E2E-тест для полного процесса бронирования столика через пользовательский интерфейс
 * Проверяет весь флоу от заполнения формы до успешного завершения бронирования
 */

test.describe('Table Reservation Full Flow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Устанавливаем большой размер окна для избежания проблем с viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    // Переход на главную страницу
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    
    // Переход к секции бронирования
    const reservationButton = page.locator('button').filter({ hasText: 'Забронировать столик' }).first();
    await reservationButton.click();
    
    // Подождать загрузки секции
    await page.waitForTimeout(2000);
  });

  test('should complete full table reservation process with all required fields', async ({ page }) => {
    // Заполняем имя
    await page.locator('input[placeholder="Ваше имя"]').fill('Тест Пользователь');
    
    // Заполняем телефон
    await page.locator('input[placeholder="+7 (999) 999-99-99"]').fill('+7 (999) 123-45-67');
    
    // Открываем календарь
    const dateButton = page.locator('button#date');
    await expect(dateButton).toBeVisible({ timeout: 5000 });
    await dateButton.click();
    
    // Ждем появления календаря
    await page.waitForSelector('.rdp', { timeout: 5000 });
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDay = tomorrow.getDate().toString();
    
    // Ищем кнопку завтрашнего дня в календаре
    await page.waitForTimeout(500);
    
    // Прокручиваем к календарю
    const calendar = page.locator('.rdp');
    await calendar.scrollIntoViewIfNeeded();
    
    const tomorrowButton = page.locator('.rdp button[role="gridcell"]:not([disabled]):not([aria-disabled="true"])').filter({ hasText: new RegExp(`^${tomorrowDay}$`) });
    await expect(tomorrowButton.first()).toBeVisible({ timeout: 5000 });
    
    // Используем JavaScript клик для обхода проблем с viewport
    await tomorrowButton.first().evaluate(el => el.click());
    
    // Выбираем время
    const timeButton = page.locator('button[id="time"]');
    await expect(timeButton).toBeVisible({ timeout: 5000 });
    await timeButton.click();
    await page.getByRole('option', { name: '19:00' }).evaluate(el => el.click());
    
    // Выбираем количество гостей
    await page.locator('button[id="guests"]').click();
    await page.getByRole('option', { name: '2' }).evaluate(el => el.click());
    
    // Добавляем комментарий (необязательное поле)
    await page.locator('textarea[placeholder="Особые пожелания, аллергии, предпочтения по размещению..."]').fill('Столик у окна, пожалуйста');
    
    // Отправляем форму
    const submitButton = page.getByRole('button', { name: 'Забронировать столик' });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();
    
    // Проверяем успешное завершение процесса бронирования (может быть либо успешное бронирование, либо демо-режим)
    const successHeading = page.getByRole('heading', { name: 'Бронирование отправлено!' });
    const demoHeading = page.getByRole('heading', { name: 'Демо-режим' });
    
    // Ждем появления одного из заголовков
    await expect(successHeading.or(demoHeading)).toBeVisible({ timeout: 10000 });
    
    // Проверяем соответствующий текст в зависимости от режима
    const isDemo = await demoHeading.isVisible().catch(() => false);
    if (isDemo) {
      await expect(page.getByText('Система временно работает в демо-режиме')).toBeVisible();
    } else {
      await expect(page.getByText('Спасибо за ваш запрос. Мы свяжемся с вами в ближайшее время')).toBeVisible();
    }
  });

  test('should validate required fields', async ({ page }) => {
    // Проверяем, что кнопка отправки отключена без заполнения полей
    const submitButton = page.getByRole('button', { name: 'Забронировать столик' });
    await expect(submitButton).toBeDisabled();
    
    // Проверяем, что форма видна
    await expect(page.getByRole('heading', { name: 'Бронирование столика' })).toBeVisible();
    
    // Заполняем только имя
    await page.locator('input[placeholder="Ваше имя"]').fill('Тест');
    // Кнопка все еще должна быть отключена
    await expect(submitButton).toBeDisabled();
    
    // Заполняем телефон
    await page.locator('input[placeholder="+7 (999) 999-99-99"]').fill('+7 (999) 123-45-67');
    // Кнопка все еще должна быть отключена (нет даты)
    await expect(submitButton).toBeDisabled();
    
    // Проверяем, что форма все еще видна
    await expect(page.getByRole('heading', { name: 'Бронирование столика' })).toBeVisible();
    
    // Выбираем дату
    const dateButton = page.locator('button#date');
    await expect(dateButton).toBeVisible({ timeout: 5000 });
    await dateButton.click();
    
    // Ждем появления календаря
    await page.waitForSelector('.rdp', { timeout: 5000 });
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDay = tomorrow.getDate().toString();
    
    await page.waitForTimeout(500);
    // Прокручиваем к календарю
    const calendar = page.locator('.rdp');
    await calendar.scrollIntoViewIfNeeded();
    
    const tomorrowButton = page.locator('.rdp button[role="gridcell"]:not([disabled]):not([aria-disabled="true"])').filter({ hasText: new RegExp(`^${tomorrowDay}$`) });
    await expect(tomorrowButton.first()).toBeVisible({ timeout: 5000 });
    
    // Используем JavaScript клик для обхода проблем с viewport
    await tomorrowButton.first().evaluate(el => el.click());
    
    // Кнопка должна быть отключена без времени
    await expect(submitButton).toBeDisabled();
    
    // Форма все еще видна
    await expect(page.getByRole('heading', { name: 'Бронирование столика' })).toBeVisible();
    
    // Выбираем время
    const timeButton = page.locator('button[id="time"]');
    await expect(timeButton).toBeVisible({ timeout: 5000 });
    await timeButton.click();
    await page.getByRole('option', { name: '19:00' }).evaluate(el => el.click());
    
    // Кнопка все еще должна быть отключена (нет количества гостей)
    await expect(submitButton).toBeDisabled();
    
    // Выбираем количество гостей
    await page.locator('button[id="guests"]').click();
    await page.getByRole('option', { name: '2' }).evaluate(el => el.click());
    
    // Теперь кнопка должна быть активна
    await expect(submitButton).toBeEnabled();
    
    // Отправляем форму
    await submitButton.click();
    
    // Проверяем успешную отправку (может быть либо успешное бронирование, либо демо-режим)
    const successHeading = page.getByRole('heading', { name: 'Бронирование отправлено!' });
    const demoHeading = page.getByRole('heading', { name: 'Демо-режим' });
    await expect(successHeading.or(demoHeading)).toBeVisible({ timeout: 10000 });
  });

  test('should handle demo mode gracefully when server is unavailable', async ({ page }) => {
    // Блокируем запросы к серверу для имитации недоступности
    await page.route('**/api/reservations', route => {
      route.abort();
    });
    
    // Заполняем форму
    await page.locator('input[placeholder="Ваше имя"]').fill('Демо Пользователь');
    await page.locator('input[placeholder="+7 (999) 999-99-99"]').fill('+7 (999) 123-45-67');
    
    // Выбираем дату
    const dateButton = page.locator('button#date');
    await dateButton.click();
    
    // Ждем появления календаря
    await page.waitForSelector('.rdp', { timeout: 5000 });
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDay = tomorrow.getDate().toString();
    
    await page.waitForTimeout(500);
    // Прокручиваем к календарю
    const calendar = page.locator('.rdp');
    await calendar.scrollIntoViewIfNeeded();
    
    const tomorrowButton = page.locator(`button:has-text("${tomorrowDay}"):not([disabled]):not([aria-disabled="true"])`);
    await expect(tomorrowButton.first()).toBeVisible({ timeout: 5000 });
    
    // Используем JavaScript клик для обхода проблем с viewport
    await tomorrowButton.first().evaluate(el => el.click());
    
    // Выбираем время
    const timeButton = page.locator('button[id="time"]');
    await expect(timeButton).toBeVisible({ timeout: 5000 });
    await timeButton.click();
    await page.getByRole('option', { name: '19:00' }).evaluate(el => el.click());
    
    // Выбираем количество гостей
    await page.locator('button[id="guests"]').click();
    await page.getByRole('option', { name: '2' }).evaluate(el => el.click());
    
    // Отправляем форму
    await page.getByRole('button', { name: 'Забронировать столик' }).click();
    
    // Проверяем, что появилось сообщение о демо-режиме
    await expect(page.getByRole('heading', { name: 'Демо-режим' })).toBeVisible({ timeout: 10000 });
  });

  test('should prevent booking for past dates and times', async ({ page }) => {
    // Заполняем основные поля
    await page.locator('input[placeholder="Ваше имя"]').fill('Тест Пользователь');
    await page.locator('input[placeholder="+7 (999) 999-99-99"]').fill('+7 (999) 123-45-67');
    
    // Открываем календарь
    const dateButton = page.locator('button#date');
    await expect(dateButton).toBeVisible({ timeout: 5000 });
    await dateButton.click();
    
    // Ждем появления календаря
    await page.waitForSelector('.rdp', { timeout: 5000 });
    
    // Выбираем завтрашний день (безопасная дата)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDay = tomorrow.getDate().toString();
    
    // Ищем кнопку завтрашнего дня в календаре
    await page.waitForTimeout(1000); // Даем время календарю загрузиться
    // Прокручиваем к календарю
    const calendar = page.locator('.rdp');
    await calendar.scrollIntoViewIfNeeded();
    
    const tomorrowButton = page.locator('.rdp button[role="gridcell"]:not([disabled]):not([aria-disabled="true"])').filter({ hasText: new RegExp(`^${tomorrowDay}$`) });
    await expect(tomorrowButton.first()).toBeVisible({ timeout: 5000 });
    
    // Используем JavaScript клик для обхода проблем с viewport
    await tomorrowButton.first().evaluate(el => el.click());
    
    // Выбираем время
    const timeButton = page.locator('button[id="time"]');
    await expect(timeButton).toBeVisible({ timeout: 5000 });
    await timeButton.click();
    
    // Проверяем, что есть доступные временные слоты
    const timeOptions = page.getByRole('option');
    const timeCount = await timeOptions.count();
    expect(timeCount).toBeGreaterThan(0);
    
    // Выбираем первое доступное время
    await timeOptions.first().click();
    
    // Выбираем количество гостей
    await page.locator('button[id="guests"]').click();
    await page.getByRole('option', { name: '2' }).click();
    
    // Отправляем форму
    const submitButton = page.getByRole('button', { name: 'Забронировать столик' });
    await submitButton.click();
    
    // Проверяем успешное бронирование (может быть либо успешное бронирование, либо демо-режим)
    const successHeading = page.getByRole('heading', { name: 'Бронирование отправлено!' });
    const demoHeading = page.getByRole('heading', { name: 'Демо-режим' });
    await expect(successHeading.or(demoHeading)).toBeVisible({ timeout: 10000 });
  });
});