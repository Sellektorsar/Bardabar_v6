import React, { useState } from 'react';
import { Calendar } from './components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover';
import { Button } from './components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

// Простой тестовый компонент для проверки календаря
export function TestCalendar() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  console.log('TestCalendar render, date:', date, 'isOpen:', isOpen);

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Тест календаря</h2>
      
      <div className="space-y-4">
        {/* Простая версия без Popover */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Календарь без Popover:</h3>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today;
            }}
            className="rounded-md border"
          />
        </div>

        {/* Версия с Popover */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Календарь с Popover:</h3>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                onClick={() => {
                  console.log('Button clicked, current isOpen:', isOpen);
                  setIsOpen(!isOpen);
                }}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'dd MMM yyyy', { locale: ru }) : 'Выберите дату'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  console.log('Date selected:', selectedDate);
                  setDate(selectedDate);
                  setIsOpen(false);
                }}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today;
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Информация для отладки */}
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h4 className="font-semibold">Отладочная информация:</h4>
          <p>Выбранная дата: {date ? date.toISOString() : 'Не выбрана'}</p>
          <p>Popover открыт: {isOpen ? 'Да' : 'Нет'}</p>
          <button 
            onClick={() => console.log('Current state:', { date, isOpen })}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
          >
            Вывести состояние в консоль
          </button>
        </div>
      </div>
    </div>
  );
}

// Для использования в App.tsx добавьте:
// import { TestCalendar } from './test-calendar-component';
// И замените содержимое renderSection на <TestCalendar /> для тестирования