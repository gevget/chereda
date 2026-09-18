# План реализации и критерии

P0: shell, темы, seed и связи; лента; проект с командой; профиль и заявка; поиск и PRO с URL-фильтрами; рейтинг и методика; «О Chereda» и `/demo`. Проверка четырёх investor-сценариев, desktop и mobile.

P1: коллекции, Viewer-профиль, уведомления, настройки, системные страницы, расширенные состояния и тесты.

Маршруты: `/`, `/feed`, `/search`, `/pro`, `/pro/[categorySlug]`, `/profiles/[profileSlug]`, `/projects/[projectSlug]`, `/ratings`, `/collections`, `/collections/[collectionSlug]`, `/me`, `/notifications`, `/settings`, `/about`, `/demo`, 404 и error.

Слои: `app`, `components`, `data`, `lib`, `types`, `public/media`, `tests`. Готовность: связные ссылки, отсутствие пустых действий, сохранение состояния, успешные lint/typecheck/test/build и ручная проверка критического пути.
