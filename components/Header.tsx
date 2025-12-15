"use client";

import { Menu as MenuIcon, Moon, Settings, Sun, X } from "lucide-react";
import { useState } from "react";

import { navItems } from "../src/data/navigation";
import { Button } from "./ui/button";

interface HeaderProps {
  activeSection: string;
  onNavClick: (section: string) => void;
  cafeName?: string;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export function Header({
  activeSection,
  onNavClick,
  cafeName = "Бар-да-бар",
  isDarkMode = false,
  onToggleDarkMode,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    onNavClick(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-orange-200/50 bg-white/90 shadow-md backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div
            className="flex cursor-pointer items-center space-x-2"
            onClick={() => handleNavClick("home")}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500">
              <span className="text-lg font-bold text-white">Б</span>
            </div>
            <h1 className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-2xl font-bold text-transparent">
              {cafeName}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-6 lg:flex">
            {navItems.slice(0, -1).map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative rounded-lg px-3 py-2 transition-all duration-300 ${
                  activeSection === item.id
                    ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30"
                    : "text-muted-foreground hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-900/20"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-100 transform bg-gradient-to-r from-orange-500 to-red-500 transition-transform duration-300" />
                )}
              </button>
            ))}

            <div className="flex items-center space-x-2">
              {onToggleDarkMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleDarkMode}
                  className="text-muted-foreground"
                  aria-label={isDarkMode ? "Включить светлую тему" : "Включить тёмную тему"}
                >
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                data-testid="btn-open-admin"
                onClick={() => handleNavClick("admin")}
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                <Settings className="mr-2 h-4 w-4" />
                Админ
              </Button>
            </div>
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center space-x-2 lg:hidden">
            {onToggleDarkMode && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleDarkMode}
                className="text-muted-foreground"
                aria-label={isDarkMode ? "Включить светлую тему" : "Включить тёмную тему"}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="border-orange-300 text-orange-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mt-4 rounded-lg border border-orange-100 bg-white p-4 shadow-lg lg:hidden dark:border-gray-700 dark:bg-gray-900">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  data-testid={item.id === "admin" ? "btn-open-admin-mobile" : undefined}
                  className={`rounded-lg px-4 py-3 text-left transition-all duration-300 ${
                    activeSection === item.id
                      ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30"
                      : "text-muted-foreground hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-900/20"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
