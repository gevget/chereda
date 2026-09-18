# Chereda — технический стек investor demo

- Next.js 16.3.5 App Router, React 19.3.0, TypeScript 5.9.3 strict.
- Tailwind CSS 4.3.3 и CSS variables из дизайн-системы.
- Phosphor Icons (`@phosphor-icons/react` 2.1.10), Roboto Flex Variable из локального npm-пакета `@fontsource-variable/roboto-flex` 5.3.0.
- Детерминированный typed seed без backend; Viewer-state в localStorage; фильтры, сортировка и вкладки в URL.
- Vitest 3.2.7 для инвариантов и логики; Playwright 1.63.0 для сценариев. ESLint 9.39.5 для статической проверки.
- pnpm. Точные установленные версии фиксируются в `pnpm-lock.yaml` после установки.

Команды: `pnpm dev`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:e2e`.

Приложение рассчитано на локальный запуск и Vercel. Публикация, серверная база и настоящая отправка заявок не входят в demo.
