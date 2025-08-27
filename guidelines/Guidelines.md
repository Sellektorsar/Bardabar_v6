# Архитектура проекта (E2-04)

Краткая фиксация текущей структуры приложения и точек входа.

- Frontend: React 18 + Vite (TSX). Маршрутизация через состояние в корневом компоненте (react-router не используется, секции переключаются в App).
- Стили/UI: Tailwind CSS + набор компонентов shadcn/ui (папка `components/ui`), иконки lucide-react, уведомления sonner.
- Backend: Supabase Edge Functions (Hono), простое KV-хранилище поверх таблицы `kv_store_c85ae302`.

## Точки входа

- index.html → подключает `/src/main.tsx`, содержит метатеги и корневой контейнер `#root`.
- src/main.tsx → импорт глобальных стилей и монтирование `<App />` в DOM.
- App.tsx → корневой компонент, организует секции (Hero, Menu, Events, TableReservation, EventBooking, EventPayment, BookingManagement, AdminNotifications, Contact, About и др.), использует компоненты из `components/ui`.
- supabase/functions/server/index.tsx → вход для Edge Function (Hono + CORS + logger), REST-эндпоинты `/make-server-c85ae302/*` (резервы/мероприятия/уведомления/оплата/инициализация).
- supabase/functions/server/kv_store.tsx → тонкая обертка над Supabase для хранения JSON (key → value).

## Конфигурация/окружение

- utils/supabase/info.tsx — получает `VITE_SUPABASE_PROJECT_ID` и `VITE_SUPABASE_ANON_KEY` из env и используется для составления URL Edge Functions и заголовка Authorization.
- vite.config.ts — плагины Vite, алиасы путей (в т.ч. `@` → `./src`), optimizeDeps.
- styles/globals.css — глобальные стили (Tailwind).

## Схема (Mermaid)

```mermaid
flowchart TD
  A[index.html] --> B[src/main.tsx]
  B --> C[App.tsx]
  C --> C1[components/* секции/виджеты]
  C --> C2[components/ui/* (shadcn/ui)]
  C -.env.-> I[utils/supabase/info.tsx]
  C -->|fetch| S[Supabase Edge Function server/index.tsx (Hono)]
  S --> K[kv_store.tsx]
  K --> DB[(Supabase DB kv_store_c85ae302)]
```

## Примечания

- В проекте отсутствует react-router: переключение разделов реализовано локальным состоянием в App.tsx.
- Все сетевые вызовы к Edge Functions используют `https://{projectId}.functions.supabase.co/server/make-server-c85ae302/*` с Bearer `publicAnonKey`.
