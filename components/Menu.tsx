"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Search, X, Clock } from "lucide-react";
import { MenuCard } from "./cards/MenuCard";
import { useMenuStore } from "../src/stores/useMenuStore";
import { Input } from "./ui/input";

// Время приготовления для каждой категории (данные с bar-da-bar.ru)
const CATEGORY_COOKING_TIME: Record<string, string> = {
  "Холодные закуски": "10-15 минут",
  "Салаты": "10-15 минут",
  "Горячие закуски": "15-20 минут",
  "Первые блюда": "15-20 минут",
  "Горячие блюда": "40 минут",
  "Гарниры": "10 минут",
  "Соусы": "5-10 минут",
  "Хлеб и выпечка": "5-10 минут",
  "Паста": "20-25 минут",
  "Пицца": "15-20 минут",
  "Бургеры": "20-25 минут",
  "Закуски к пиву": "15-20 минут",
  "Суши": "20 минут",
  "Роллы": "20 минут",
  "Сеты роллов": "20 минут",
  "Десерты": "10-15 минут",
  "Детское меню": "20 минут",
  "Чайная карта": "10 минут",
  "Кофе": "10 минут",
  "Безалкогольные напитки": "10 минут",
  "Свежевыжатые соки": "10 минут",
  "Безалкогольные коктейли": "10 минут",
  "Алкогольные напитки": "10 минут",
  "Винная карта": "10 минут",
  "Алкогольные коктейли": "15 минут",
  "Пиво бутылочное": "10 минут",
};

// Порядок категорий для сортировки
const CATEGORY_ORDER = [
  "Холодные закуски",
  "Салаты", 
  "Горячие закуски",
  "Первые блюда",
  "Горячие блюда",
  "Гарниры",
  "Соусы",
  "Хлеб и выпечка",
  "Паста",
  "Пицца",
  "Бургеры",
  "Блинчики",
  "Закуски к пиву",
  "Суши",
  "Роллы",
  "Сеты роллов",
  "Десерты",
  "Детское меню",
  "Детское меню Напитки",
  "Чайная карта",
  "Кофе",
  "Безалкогольные напитки",
  "Свежевыжатые соки",
  "Безалкогольные коктейли",
  "Алкогольные напитки",
  "Винная карта",
  "Алкогольные коктейли",
  "Пиво бутылочное",
  "Пиво импортное",
  "Пиво крафтовое Бардабар",
];

export function Menu() {
  const { items, isLoading, loadItems } = useMenuStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const navRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Фильтрация по поиску
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  // Группировка по категориям
  const categories = useMemo(() => {
    return filteredItems.reduce(
      (acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      },
      {} as Record<string, typeof items>
    );
  }, [filteredItems]);

  // Сортировка категорий
  const sortedCategories = useMemo(() => {
    return Object.entries(categories).sort(([a], [b]) => {
      const indexA = CATEGORY_ORDER.indexOf(a);
      const indexB = CATEGORY_ORDER.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [categories]);

  // Установка первой категории как активной
  useEffect(() => {
    if (sortedCategories.length > 0 && !activeCategory) {
      setActiveCategory(sortedCategories[0][0]);
    }
  }, [sortedCategories, activeCategory]);

  // Отслеживание скролла для подсветки активной категории
  useEffect(() => {
    const handleScroll = () => {
      const navHeight = navRef.current?.offsetHeight || 0;
      const scrollPosition = window.scrollY + navHeight + 100;

      for (const [categoryName] of sortedCategories) {
        const element = categoryRefs.current[categoryName];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveCategory(categoryName);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sortedCategories]);

  // Скролл к категории
  const scrollToCategory = useCallback((categoryName: string) => {
    const element = categoryRefs.current[categoryName];
    const navHeight = navRef.current?.offsetHeight || 0;
    
    if (element) {
      const offsetTop = element.offsetTop - navHeight - 20;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
      setActiveCategory(categoryName);
    }
  }, []);

  // Скролл табов к активной категории
  useEffect(() => {
    if (activeCategory && tabsContainerRef.current) {
      const activeTab = tabsContainerRef.current.querySelector(`[data-category="${activeCategory}"]`);
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [activeCategory]);

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-16">
      {/* Заголовок */}
      <div className="mb-8 text-center">
        <h2 className="gradient-text-animated mb-4 text-4xl font-bold">Наше меню</h2>
        <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
          Изысканные блюда, приготовленные с любовью из свежих продуктов
        </p>
      </div>

      {/* Sticky навигация */}
      <div
        ref={navRef}
        className="sticky top-0 z-40 -mx-4 bg-background/95 px-4 py-4 backdrop-blur-md border-b border-border/50 transition-all duration-300"
      >
        {/* Поиск */}
        <div className="relative mb-4 max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Поиск по меню..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 bg-card border-border/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Табы категорий */}
        <div
          ref={tabsContainerRef}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-500/30 scrollbar-track-transparent scroll-smooth"
        >
          {sortedCategories.map(([categoryName], index) => (
            <button
              key={categoryName}
              data-category={categoryName}
              onClick={() => scrollToCategory(categoryName)}
              style={{ 
                animationDelay: `${index * 30}ms`,
                transform: activeCategory === categoryName ? 'scale(1.02)' : 'scale(1)'
              }}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium flex-shrink-0 animate-fade-in-up
                transition-all duration-300 ease-out
                ${activeCategory === categoryName
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30 ring-2 ring-amber-400/20"
                  : "bg-card text-muted-foreground hover:bg-card/80 hover:text-foreground hover:shadow-md border border-border/50 hover:border-amber-500/30"
                }`}
            >
              {categoryName}
              <span className={`ml-1.5 text-xs transition-opacity duration-300 ${
                activeCategory === categoryName ? "opacity-90" : "opacity-60"
              }`}>
                ({categories[categoryName]?.length || 0})
              </span>
            </button>
          ))}
        </div>

        {/* Результаты поиска */}
        {searchQuery && (
          <div className="mt-2 text-sm text-muted-foreground text-center animate-fade-in">
            Найдено: <span className="font-semibold text-amber-500">{filteredItems.length}</span> {getItemsWord(filteredItems.length)}
          </div>
        )}
      </div>

      {/* Контент меню */}
      <div className="space-y-12 pt-8">
        {sortedCategories.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <p className="text-xl text-muted-foreground">Ничего не найдено</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 text-amber-500 hover:text-amber-400 transition-all duration-300 hover:scale-105"
            >
              Сбросить поиск
            </button>
          </div>
        ) : (
          sortedCategories.map(([categoryName, categoryItems]) => (
            <div
              key={categoryName}
              ref={(el) => (categoryRefs.current[categoryName] = el)}
              className="space-y-6 scroll-mt-40"
            >
              <div className="flex items-center justify-between border-b-2 border-amber-500/30 pb-2">
                <h3 className="text-2xl font-bold text-foreground transition-colors duration-300 hover:text-amber-500">
                  {categoryName}
                </h3>
                {CATEGORY_COOKING_TIME[categoryName] && (
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-amber-500" />
                    {CATEGORY_COOKING_TIME[categoryName]}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categoryItems.map((item) => (
                  <MenuCard
                    key={item.id}
                    name={item.name}
                    description={item.description}
                    price={item.price.includes("₽") ? item.price : `${item.price} ₽`}
                    weight={item.weight}
                    image={item.image}
                    allergens={item.allergens || []}
                    isSpecial={item.isSpecial}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

// Склонение слова "позиция"
function getItemsWord(count: number): string {
  const lastTwo = count % 100;
  const lastOne = count % 10;
  
  if (lastTwo >= 11 && lastTwo <= 19) return "позиций";
  if (lastOne === 1) return "позиция";
  if (lastOne >= 2 && lastOne <= 4) return "позиции";
  return "позиций";
}
