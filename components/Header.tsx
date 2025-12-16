"use client";

import { Menu as MenuIcon, Settings, X } from "lucide-react";
import { useState } from "react";

import { navItems } from "../src/data/navigation";
import { Button } from "./ui/button";

interface HeaderProps {
  activeSection: string;
  onNavClick: (section: string) => void;
  cafeName?: string;
}

export function Header({
  activeSection,
  onNavClick,
  cafeName = "Бар-да-бар",
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    onNavClick(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-amber-500/20 bg-card/95 shadow-lg shadow-amber-500/5 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div
            className="flex cursor-pointer items-center space-x-2"
            onClick={() => handleNavClick("home")}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-red-600 shadow-lg shadow-amber-500/25">
              <span className="text-lg font-bold text-white">Б</span>
            </div>
            <h1 className="gradient-text-animated text-2xl font-bold">
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
                    ? "bg-amber-500/10 text-amber-400"
                    : "text-muted-foreground hover:bg-amber-500/5 hover:text-amber-400"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-100 transform bg-gradient-to-r from-amber-500 to-red-600 transition-transform duration-300" />
                )}
              </button>
            ))}

            <Button
              variant="outline"
              size="sm"
              data-testid="btn-open-admin"
              onClick={() => handleNavClick("admin")}
              className="btn-outline-loft"
            >
              <Settings className="mr-2 h-4 w-4" />
              Админ
            </Button>
          </nav>

          {/* Mobile Navigation Toggle */}
          <Button
            variant="outline"
            size="sm"
            className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="loft-card mt-4 rounded-lg p-4 lg:hidden">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  data-testid={item.id === "admin" ? "btn-open-admin-mobile" : undefined}
                  className={`rounded-lg px-4 py-3 text-left transition-all duration-300 ${
                    activeSection === item.id
                      ? "bg-amber-500/10 text-amber-400"
                      : "text-muted-foreground hover:bg-amber-500/5 hover:text-amber-400"
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
