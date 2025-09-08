// Скрипт для диагностики проблем с календарем
// Запустите этот код в консоли браузера на странице бронирования

console.log('=== ДИАГНОСТИКА КАЛЕНДАРЯ БРОНИРОВАНИЯ ===');

// 1. Проверка наличия основных элементов
console.log('\n1. Проверка элементов:');
const dateButton = document.querySelector('#date');
const popover = document.querySelector('[data-slot="popover"]');
const popoverTrigger = document.querySelector('[data-slot="popover-trigger"]');
const popoverContent = document.querySelector('[data-slot="popover-content"]');

console.log('Date button:', dateButton);
console.log('Popover root:', popover);
console.log('Popover trigger:', popoverTrigger);
console.log('Popover content:', popoverContent);

// 2. Проверка стилей кнопки даты
if (dateButton) {
    console.log('\n2. Стили кнопки даты:');
    const styles = window.getComputedStyle(dateButton);
    console.log('Display:', styles.display);
    console.log('Visibility:', styles.visibility);
    console.log('Pointer events:', styles.pointerEvents);
    console.log('Z-index:', styles.zIndex);
    console.log('Position:', styles.position);
    
    // 3. Проверка событий
    console.log('\n3. Тест клика по кнопке:');
    dateButton.addEventListener('click', function(e) {
        console.log('Клик по кнопке даты зарегистрирован!', e);
    });
    
    // Программный клик для тестирования
    console.log('Выполняю программный клик...');
    dateButton.click();
    
    setTimeout(() => {
        const popoverContentAfterClick = document.querySelector('[data-slot="popover-content"]');
        console.log('Popover content после клика:', popoverContentAfterClick);
        
        if (popoverContentAfterClick) {
            const contentStyles = window.getComputedStyle(popoverContentAfterClick);
            console.log('Стили popover content:');
            console.log('Display:', contentStyles.display);
            console.log('Visibility:', contentStyles.visibility);
            console.log('Opacity:', contentStyles.opacity);
            console.log('Z-index:', contentStyles.zIndex);
            console.log('Transform:', contentStyles.transform);
        }
    }, 100);
} else {
    console.error('Кнопка даты не найдена!');
}

// 4. Проверка ошибок React
console.log('\n4. Проверка ошибок:');
window.addEventListener('error', function(e) {
    console.error('JavaScript ошибка:', e.error);
});

// 5. Проверка Radix UI
console.log('\n5. Проверка Radix UI:');
console.log('Radix Popover в window:', window.RadixPopover || 'Не найден');

// 6. Поиск всех элементов с data-state
console.log('\n6. Элементы с data-state:');
const elementsWithState = document.querySelectorAll('[data-state]');
elementsWithState.forEach((el, index) => {
    console.log(`Element ${index}:`, el, 'State:', el.getAttribute('data-state'));
});

console.log('\n=== ДИАГНОСТИКА ЗАВЕРШЕНА ===');
console.log('Если календарь не работает, проверьте:');
console.log('1. Нет ли JavaScript ошибок в консоли');
console.log('2. Правильно ли загружены стили');
console.log('3. Не блокируется ли popover другими элементами');
console.log('4. Корректно ли работает Radix UI Popover');