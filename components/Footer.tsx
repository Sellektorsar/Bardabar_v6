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
    <footer className="border-t border-orange-200 bg-gradient-to-br from-gray-900 to-gray-800 py-16 text-white dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500">
                <span className="text-lg font-bold text-white">Б</span>
              </div>
              <span className="text-2xl font-bold">{settings.cafeName}</span>
            </div>
            <p className="text-gray-400">{settings.description}</p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="rounded-full bg-gray-700 p-2 transition-colors hover:bg-orange-500"
                aria-label="Мы в ВКонтакте"
              >
                <VKIcon className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="#"
                className="rounded-full bg-gray-700 p-2 transition-colors hover:bg-orange-500"
                aria-label="Мы в Telegram"
              >
                <TelegramIcon className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Быстрые ссылки</h3>
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
                    className="text-gray-400 transition-colors hover:text-orange-400"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="h-4 w-4 text-orange-500" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="h-4 w-4 text-orange-500" />
                <span>{settings.email}</span>
              </li>
              <li
                className="flex cursor-pointer items-start gap-3 text-gray-400 transition-colors hover:text-orange-400"
                onClick={handleOpenMap}
              >
                <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-orange-500" />
                <span>{settings.address}</span>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Часы работы</h3>
            <div className="flex items-start gap-3 text-gray-400">
              <Clock className="mt-1 h-4 w-4 flex-shrink-0 text-orange-500" />
              <div className="whitespace-pre-line">{settings.workingHours.replace(/, /g, "\n")}</div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} {settings.cafeName}. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
