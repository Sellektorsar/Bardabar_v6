const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Переходим на страницу
  await page.goto('http://localhost:5173');
  
  // Ждем загрузки страницы
  await page.waitForTimeout(2000);

  try {
    // Проверяем размер экрана и открываем мобильное меню если нужно
    const viewport = page.viewportSize();
    console.log(`Размер экрана: ${viewport.width}x${viewport.height}`);
    
    if (viewport.width < 1024) {
      console.log('Мобильный экран - ищем кнопку мобильного меню...');
      const mobileMenuButton = await page.locator('button').filter({ hasText: /menu/i }).or(page.locator('[data-testid="mobile-menu"]')).first();
      const mobileMenuCount = await mobileMenuButton.count();
      console.log(`Найдено кнопок мобильного меню: ${mobileMenuCount}`);
      
      if (mobileMenuCount > 0) {
        console.log('Открываем мобильное меню...');
        await mobileMenuButton.click();
        await page.waitForTimeout(1000);
      }
    }
    
    // Ищем все кнопки с текстом "Бронирование"
    console.log('Ищем все кнопки с текстом "Бронирование"...');
    const allReservationButtons = await page.locator('button, a').filter({ hasText: 'Бронирование' }).all();
    console.log(`Найдено кнопок с текстом "Бронирование": ${allReservationButtons.length}`);
    
    let clicked = false;
    for (let i = 0; i < allReservationButtons.length; i++) {
      const button = allReservationButtons[i];
      const isVisible = await button.isVisible();
      const text = await button.textContent();
      console.log(`Кнопка ${i + 1}: "${text}", видима: ${isVisible}`);
      
      if (isVisible && !clicked) {
        try {
          console.log(`Кликаем по видимой кнопке ${i + 1}...`);
          await button.click();
          await page.waitForTimeout(2000);
          clicked = true;
          console.log('Успешно кликнули!');
        } catch (error) {
          console.log(`Ошибка при клике по кнопке ${i + 1}: ${error.message}`);
        }
      }
    }
    
    if (!clicked) {
      console.log('Не удалось кликнуть ни по одной кнопке "Бронирование". Попробуем другой подход...');
      
      // Попробуем найти кнопку "Забронировать столик"
      console.log('Ищем кнопку "Забронировать столик"...');
      const bookTableButton = await page.locator('button, a').filter({ hasText: /забронировать.*столик/i }).first();
      const bookTableCount = await bookTableButton.count();
      console.log(`Найдено кнопок "Забронировать столик": ${bookTableCount}`);
      
      if (bookTableCount > 0) {
        const isVisible = await bookTableButton.isVisible();
        console.log(`Кнопка "Забронировать столик" видима: ${isVisible}`);
        
        if (isVisible) {
          try {
            console.log('Кликаем по кнопке "Забронировать столик"...');
            await bookTableButton.click();
            await page.waitForTimeout(2000);
            clicked = true;
            console.log('Успешно кликнули!');
          } catch (error) {
            console.log(`Ошибка при клике: ${error.message}`);
          }
        }
      }
    }
    
    if (!clicked) {
      console.log('Не удалось найти рабочую кнопку бронирования. Показываем все видимые кнопки...');
      const allVisibleButtons = await page.locator('button:visible, a:visible').all();
      console.log(`Всего видимых кнопок/ссылок: ${allVisibleButtons.length}`);
      for (let i = 0; i < Math.min(allVisibleButtons.length, 10); i++) {
        const text = await allVisibleButtons[i].textContent();
        console.log(`Видимая кнопка/ссылка ${i + 1}: "${text?.trim()}"`);
      }
    }

  // Теперь ищем элементы формы бронирования
  console.log('Looking for booking form elements...');
  const dateInputs = await page.locator('input[type="date"], input[placeholder*="дата"], input[placeholder*="Дата"]').all();
  console.log('Date inputs found:', dateInputs.length);
  
  // Ищем кнопки с календарем
  const calendarButtons = await page.locator('button').filter({ hasText: /дата|календарь|выбрать/i }).all();
  console.log('Calendar buttons found:', calendarButtons.length);
  
  for (let i = 0; i < calendarButtons.length; i++) {
    const buttonText = await calendarButtons[i].textContent();
    console.log(`Calendar button ${i}: "${buttonText}"`);
  }
  
  // Ищем форму бронирования или модальное окно
  console.log('Ищем форму бронирования...');
  await page.waitForTimeout(2000); // Даем время на загрузку
  
  const formSelectors = [
    'form',
    '[class*="reservation"]',
    '[class*="booking"]',
    '[class*="modal"]',
    '[class*="dialog"]',
    '[role="dialog"]',
    '.popover',
    '[class*="form"]'
  ];
  
  let formFound = false;
  let workingSelector = null;
  for (const selector of formSelectors) {
    const elements = await page.locator(selector).all();
    console.log(`Селектор ${selector}: найдено ${elements.length}`);
    
    for (let i = 0; i < elements.length; i++) {
      const isVisible = await elements[i].isVisible();
      if (isVisible) {
        const innerHTML = await elements[i].innerHTML();
        // Проверяем, содержит ли элемент поля для бронирования
        if (innerHTML.includes('input') || innerHTML.includes('select') || innerHTML.includes('button')) {
          console.log(`${selector}[${i}]: видимо: ${isVisible}, содержит поля ввода`);
          formFound = true;
          workingSelector = `${selector}:nth-child(${i + 1})`;
          break;
        }
      }
    }
    if (formFound) break;
  }
  
  if (!formFound) {
    console.log('Форма бронирования не найдена. Показываем все видимые элементы...');
    
    // Показываем все видимые элементы на странице
    const allVisible = await page.locator('*').all();
    let visibleCount = 0;
    for (const element of allVisible) {
      const isVisible = await element.isVisible();
      if (isVisible) {
        visibleCount++;
        if (visibleCount <= 20) { // Показываем только первые 20
          const tagName = await element.evaluate(el => el.tagName.toLowerCase());
          const className = await element.getAttribute('class') || '';
          const textContent = (await element.textContent() || '').trim().substring(0, 50);
          console.log(`${tagName}.${className}: "${textContent}"`);
        }
      }
    }
    console.log(`Всего видимых элементов: ${visibleCount}`);
    return;
  }
  
  console.log(`Найдена форма с селектором: ${workingSelector}`);
  
  // Анализируем найденную форму
  const formHTML = await page.locator(workingSelector).first().innerHTML();
  console.log('\nHTML структура найденной формы:');
  console.log(formHTML.substring(0, 1000) + (formHTML.length > 1000 ? '...' : ''));
  
  // Ищем поля ввода в форме
  const inputs = await page.locator(`${workingSelector} input`).all();
  console.log(`\nПоля ввода в форме: ${inputs.length}`);
  
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const type = await input.getAttribute('type') || 'text';
    const placeholder = await input.getAttribute('placeholder') || '';
    const name = await input.getAttribute('name') || '';
    const isVisible = await input.isVisible();
    console.log(`Input ${i + 1}: type=${type}, name="${name}", placeholder="${placeholder}", видим: ${isVisible}`);
  }
  
  // Ищем кнопки в форме
  const buttons = await page.locator(`${workingSelector} button`).all();
  console.log(`\nКнопки в форме: ${buttons.length}`);
  
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    const text = (await button.textContent() || '').trim();
    const isVisible = await button.isVisible();
    console.log(`Button ${i + 1}: "${text}", видима: ${isVisible}`);
  }
  
} catch (error) {
  console.error('Ошибка:', error.message);
} finally {
  await browser.close();
}
})();