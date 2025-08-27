"use client";

import { Menu as MenuIcon, Settings } from "lucide-react";
import { useState } from "react";

import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
}

export function Header({
  activeSection,
  setActiveSection,
  isAdminMode,
  setIsAdminMode,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Главная" },
    { id: "menu", label: "Меню" },
    { id: "events", label: "Мероприятия" },
    { id: "reservation", label: "Бронирование" },
    { id: "about", label: "О нас" },
    { id: "contact", label: "Контакты" },
  ];

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
  };

  const handleAdminClick = () => {
    setIsAdminMode(!isAdminMode);
    if (!isAdminMode) setActiveSection("admin");
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-background/95 sticky top-0 z-50 border-b border-border shadow-lg backdrop-blur-sm">
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
              Бар-да-бар
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative rounded-lg px-4 py-2 transition-all duration-300 ${
                  activeSection === item.id
                    ? "bg-orange-100 text-orange-600"
                    : "text-muted-foreground hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-100 transform bg-gradient-to-r from-orange-500 to-red-500 transition-transform duration-300" />
                )}
              </button>
            ))}
            <Button
              variant="outline"
              size="sm"
              data-testid="btn-open-admin"
              onClick={handleAdminClick}
              className="border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              <Settings className="mr-2 h-4 w-4" />
              Админ
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="border-orange-300 text-orange-600">
                  <MenuIcon className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="mt-8 flex flex-col space-y-4">
                  <div className="mb-6 flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500">
                      <span className="font-bold text-white">Б</span>
                    </div>
                    <h2 className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-xl font-bold text-transparent">
                      Бар-да-бар
                    </h2>
                  </div>

                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full rounded-lg px-4 py-3 text-left transition-all duration-300 ${
                        activeSection === item.id
                          ? "bg-orange-100 text-orange-600"
                          : "text-muted-foreground hover:bg-orange-50 hover:text-orange-600"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}

                  <Button
                    variant="outline"
                    data-testid="btn-open-admin-mobile"
                    onClick={handleAdminClick}
                    className="mt-4 w-full border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Админ-панель
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
