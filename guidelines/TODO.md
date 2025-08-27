# TODO — Бардабар (проектные задачи)

Дата: 2025-08-21
Ответственный: Команда проекта «Бардабар»
Источник: Roadmap.md (v1.0)

— Легенда —

- Идентификатор: [E{этап}-{номер}] или [TX] для служебных задач
- Приоритет: High / Medium / Low
- Статус: Pending / In Progress / Done / Blocked

— Этап 1 — Анализ и подготовка проекта —
<a id="E1-01"></a>

1. [ ] [E1-01] Сбор исходных материалов (Figma, бренд-гайд, тексты, фото/видео, логотипы, домен, доступы к Supabase/почтовому сервису/платежам) — Priority: High — Status: Pending
2. [x] [E1-02] Аудит макета и сопоставление с существующими компонентами (Hero, About, Menu, Events, Contact, Header, TableBooking/Reservation/Management, AdminPanel/Notifications, EventBooking/Payment) — Priority: High — Status: Done
3. [x] [E1-03] Составить карту навигации и URL-маршрутизацию (IA + роуты) — Priority: High — Status: Done
4. [x] [E1-04] Подготовить краткую техническую записку: стек, решения по хостингу (SPA на Nginx + CDN), CI/CD — Priority: Medium — Status: Done
5. [ ] [E1-05] Составить реестр рисков и план смягчения — Priority: Medium — Status: Pending

— Этап 2 — Локальная разработка и тестирование — 6. [x] [E2-01] Подготовить локальное окружение: Node LTS, PNPM/NPM, Git; проверить Tailwind/PostCSS; настроить ESLint/Prettier — Priority: High — Status: Done 7. [x] [E2-02] Создать .env.example и описать необходимые переменные (Supabase URL/Key и др.) — Priority: High — Status: Done 8. [x] [E2-03] Подключить переменные окружения в utils/supabase/info.tsx; не хранить секреты в репозитории — Priority: High — Status: Done 9. [x] [E2-04] Сверить и зафиксировать актуальную структуру/архитектуру компонентов проекта — Priority: Medium — Status: Done 10. [x] [E2-05] Реализовать функционал «Меню»: категории, изображения, цены, аллергены; источник данных (Supabase/локально) — Priority: High — Status: Done 11. [ ] [E2-06] Реализовать бронирование столов: форма, валидация, слоты, подтверждения, письма/уведомления — Priority: High — Status: In Progress 12. [x] [E2-07] Реализовать раздел «Мероприятия»: список, детали, бронирование, оплата (тестовый режим провайдера) — Priority: High — Status: Done 13. [ ] [E2-08] Реализовать «Контакты/карта»: форма + интеграция с почтовым сервисом — Priority: Medium — Status: Pending 14. [ ] [E2-09] Реализовать админ-панель: управление бронированиями/мероприятиями, уведомления — Priority: Medium — Status: In Progress 15. [ ] [E2-10] Написать unit/компонентные тесты (React Testing Library) для критических компонентов/форм — Priority: Medium — Status: Pending 16. [x] [E2-11] Настроить Playwright E2E: smoke-сценарии (бронирование стола, мероприятия, базовая навигация) — Priority: High — Status: Done 17. [ ] [E2-12] Проверка доступности (axe): контраст, alt-тексты, клавиатурная навигация; фиксы — Priority: Medium — Status: Pending 18. [ ] [E2-13] Прогон Lighthouse (моб/десктоп), сформировать план оптимизаций Core Web Vitals — Priority: Medium — Status: Pending 19. [ ] [E2-14] Оптимизация изображений (responsive, webp/avif) и шрифтов (display-swap), code-splitting — Priority: Medium — Status: Pending 20. [ ] [E2-15] Настроить сбор ошибок/логов (Sentry/LogRocket по желанию), Supabase logs — Priority: Low — Status: Pending

— Этап 3 — Подготовка к развертыванию на VPS — 21. [ ] [E3-01] Выбрать и подготовить VPS (≈2 vCPU/2–4 GB RAM), регион ближе к аудитории — Priority: Medium — Status: Pending 22. [ ] [E3-02] Настроить домен (bardabar.ru/.com) в Cloudflare: DNS-записи, проксирование — Priority: High — Status: Pending 23. [ ] [E3-03] Определить стратегию SSL (Let's Encrypt или Cloudflare Universal SSL) — Priority: Medium — Status: Pending 24. [ ] [E3-04] Зафиксировать стратегию деплоя: SPA статика на Nginx + CDN — Priority: High — Status: Pending 25. [ ] [E3-05] Подготовить конфиг Nginx (server block, gzip/brotli, кэширование, SPA fallback) — Priority: High — Status: Pending
<a id="E3-06"></a> 26. [ ] [E3-06] Настроить CI/CD (GitHub Actions): lint/test/build → deploy (ssh/rsync); добавить Secrets — Priority: High — Status: In Progress

    — Требуемые настройки для GitHub Actions (репозиторий):
    - Actions Variables:
      - DEPLOY_ENABLED=true (для включения деплоя из ветки main)
    - Secrets:
      - DEPLOY_SSH_KEY — приватный SSH-ключ деплой-пользователя
      - DEPLOY_USER — имя пользователя на VPS
      - DEPLOY_HOST — IP/домен VPS
      - DEPLOY_PATH — путь деплоя, например /var/www/bardabar/current
    - Опционально для сборки/тестов (если нужны внешние сервисы в CI):
      - VITE_SUPABASE_URL
      - VITE_SUPABASE_ANON_KEY
    Примечания:
    - Файл workflow: .github/workflows/ci.yml (см. шаги build/test/deploy)
    - Секреты не должны попадать в логи; используем GitHub Secrets/Variables

— Этап 4 — Развертывание и публичный запуск — 27. [ ] [E4-01] Подготовить VPS: обновления, firewall (UFW), пользователь без root, ssh-ключи — Priority: High — Status: Pending 28. [ ] [E4-02] Установить Nginx и certbot (если не используется Cloudflare SSL) — Priority: Medium — Status: Pending 29. [ ] [E4-03] Собрать фронтенд (npm/pnpm build) и развернуть статику в /var/www/bardabar/current — Priority: High — Status: Pending 30. [ ] [E4-04] Настроить Nginx: gzip/brotli, кэширование статики, заголовки, SPA fallback на index.html — Priority: High — Status: Pending 31. [ ] [E4-05] Выпустить и подключить SSL, настроить автообновление сертификатов — Priority: High — Status: Pending 32. [ ] [E4-06] Проверить интеграции: Supabase (URL/Keys), почтовые уведомления, платежи (тестовый режим) — Priority: High — Status: Pending 33. [ ] [E4-07] Прогнать E2E smoke-тесты на прод-среде (безопасно и ограниченно) — Priority: Medium — Status: Pending 34. [ ] [E4-08] Включить индексирование (robots/meta), отправить sitemap в поисковые системы — Priority: Medium — Status: Pending 35. [ ] [E4-09] Публичный анонс: соцсети/карты/каталоги, карточки Google/Яндекс — Priority: Low — Status: Pending

— Этап 5 — Пострелизная поддержка — 36. [ ] [E5-01] Настроить мониторинг аптайма и алерты; отслеживание ошибок — Priority: Medium — Status: Pending 37. [ ] [E5-02] Подключить GA4/Яндекс.Метрику: события конверсий/бронирований, цели — Priority: Medium — Status: Pending 38. [ ] [E5-03] Настроить сбор обратной связи (форма/чат), регулярные опросы — Priority: Low — Status: Pending 39. [ ] [E5-04] Сформировать бэклог улучшений на 3–6 месяцев (UX, контент, акции) — Priority: Low — Status: Pending 40. [ ] [E5-05] Описать процедуры релизов, регресса и отката; ввести релизный цикл — Priority: Low — Status: Pending

— Спринт 1 (предложение) — 1–2 недели
Цель: Подготовить фундамент и базовые пользовательские сценарии в dev-среде
Объем:

- E1-01, E1-02, E1-03
- E2-01, E2-02, E2-03, E2-11
  Критерии готовности (DoD):
- Документы и доступы собраны; карта роутинга согласована
- Локальная сборка проходит, линт/тесты выполняются
- E2E smoke-тесты запускаются локально

— Спринт 2 (предложение) — 2 недели
Цель: Реализовать ключевые сценарии MVP
Объем:

- E2-05, E2-06, E2-07, E2-08
  Критерии готовности:
- Функциональные сценарии работают, базовые валидации и уведомления

— Спринт 3 (предложение) — 1 неделя
Цель: Подготовка к деплою
Объем:

- E3-01, E3-02, E3-03, E3-04, E3-05, E3-06
  Критерии готовности:
- CI/CD собирает и доставляет билд на тестовый сервер, DNS готов

— Спринт 4 (предложение) — 1 неделя
Цель: Прод и запуск
Объем:

- E4-01, E4-02, E4-03, E4-04, E4-05, E4-06, E4-07, E4-08, E4-09
  Критерии готовности:
- HTTPS сайт доступен по домену, чек-лист готовности закрыт

Примечания:

- Все секреты храним вне репозитория (GitHub Secrets, .env.local)
- Обязательные ревью PR для критических изменений
- Используем Conventional Commits и автоматический changelog
