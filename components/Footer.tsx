"use client";

import { Clock, Mail, MapPin, Phone } from "lucide-react";

interface SiteSettings {
  cafeName: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
}

// Custom VK icon component
const VKIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.785 16.241s.288-.032.436-.193c.136-.148.131-.425.131-.425s-.019-1.297.582-1.488c.593-.188 1.353 1.254 2.158 1.807.611.419 1.075.327 1.075.327l2.158-.03s1.13-.07.594-.958c-.044-.072-.31-.653-1.597-1.847-1.347-1.25-1.167-.996.456-3.051.988-1.25 1.382-2.013 1.259-2.34-.117-.312-.84-.23-.84-.23l-2.432.015s-.18-.025-.313.055c-.131.079-.215.263-.215.263s-.387.103-.759 2.42c-.789 1.807-1.105 1.904-1.235 1.792-.301-.261-.226-1.05-.226-1.61 0-1.751.265-2.48-.517-2.669-.259-.063-.45-.104-1.114-.111-.85-.009-1.569.003-1.976.202-.271.133-.48.428-.353.445.157.021.513.096.701.354.243.333.234.108.234 1.689 0 .356-.064 1.74-.41 1.996-.237.175-.56-.182-1.256-1.818-.356-.913-.625-1.923-.625-1.923s-.052-.207-.145-.318c-.113-.135-.271-.178-.271-.178l-2.316.015s-.347.01-.475.16c-.113.133-.009.409-.009.409s1.816 4.249 3.869 6.38c1.88 1.95 4.014 1.823 4.014 1.823h.968z" />
  </svg>
);

// Custom Telegram icon component
const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.302 1.4-1.123 1.645-2.03 1.026l-2.608-1.956-1.257 1.237c-.139.139-.256.256-.526.256l.188-2.759 4.766-4.308c.207-.184-.045-.287-.32-.103l-5.904 3.716-2.549-.827c-.555-.184-.566-.555.115-.822l9.956-3.838c.462-.154.867.106.713.83z" />
  </svg>
);

interface FooterProps {
  settings: SiteSettings;
  onNavClick: (sectionId: string) => void;
}

export function Footer({ settings, onNavClick }: FooterProps) {
  const handleOpenMap = () => {
    const address = encodeURIComponent(settings.address);
    window.open(`https://yandex.ru/maps/?text=${address}`, "_blank");
  };

  return (
    <footer className="loft-texture relative overflow-hidden border-t border-amber-500/20 bg-card py-16 text-foreground">
      {/* Warm ambient glow */}
      <div className="absolute left-0 top-0 h-64 w-64 animate-float rounded-full bg-amber-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-64 w-64 animate-float rounded-full bg-red-600/10 blur-3xl" style={{ animationDelay: "2s" }} />
      
      <div className="container relative mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="group flex items-center space-x-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-red-600 shadow-lg shadow-amber-500/25 transition-transform group-hover:scale-110">
                <span className="text-xl font-bold text-white">Б</span>
              </div>
              <span className="gradient-text-animated text-2xl font-bold">{settings.cafeName}</span>
            </div>
            <p className="text-muted-foreground">{settings.description}</p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="group rounded-full bg-secondary p-3 transition-all hover:scale-110 hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/25"
                aria-label="Мы в ВКонтакте"
              >
                <VKIcon className="h-5 w-5 transition-transform group-hover:scale-110" aria-hidden="true" />
              </a>
              <a
                href="#"
                className="group rounded-full bg-secondary p-3 transition-all hover:scale-110 hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/25"
                aria-label="Мы в Telegram"
              >
                <TelegramIcon className="h-5 w-5 transition-transform group-hover:scale-110" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Быстрые ссылки</h3>
            <ul className="space-y-2">
              {[
                { id: "menu", label: "Меню" },
                { id: "events", label: "Мероприятия" },
                { id: "reservation", label: "Бронирование" },
                { id: "about", label: "О нас" },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavClick(item.id)}
                    className="text-muted-foreground transition-colors hover:text-amber-400"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-4 w-4 text-amber-400" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4 text-amber-400" />
                <span>{settings.email}</span>
              </li>
              <li
                className="flex cursor-pointer items-start gap-3 text-muted-foreground transition-colors hover:text-amber-400"
                onClick={handleOpenMap}
              >
                <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-amber-400" />
                <span>{settings.address}</span>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Часы работы</h3>
            <div className="flex items-start gap-3 text-muted-foreground">
              <Clock className="mt-1 h-4 w-4 flex-shrink-0 text-amber-400" />
              <div className="whitespace-pre-line">{settings.workingHours.replace(/, /g, "\n")}</div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-amber-500/20 pt-8 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} {settings.cafeName}. Все права защищены.</p>
          <p className="mt-2 text-sm text-muted-foreground/70">
            Сделано с <span className="animate-pulse text-red-500">❤</span> для наших гостей
          </p>
        </div>
      </div>
    </footer>
  );
}
