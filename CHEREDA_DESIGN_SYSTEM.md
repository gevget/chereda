# CHEREDA — UI KIT & DESIGN SYSTEM

**Версия:** 1.0  
**Дата:** 18.09.2026  
**Статус:** утверждённая дизайн-основа для investor demo  
**Формат продукта:** desktop-first web platform + обязательная responsive-версия  
**Назначение файла:** единый источник правил для дизайна и последующей сборки интерфейса в Codex.

---

## 0. Как использовать этот документ

Этот файл определяет визуальную систему Chereda:

- дизайн-принципы;
- типографику;
- палитру и темы;
- сетку и адаптивность;
- размеры, интервалы, радиусы и бордеры;
- выбранный набор иконок;
- базовые компоненты и их состояния;
- карточки, ленты и паттерны страниц;
- требования к изображениям и контенту;
- правила доступности;
- критерии визуальной готовности investor demo.

Если макет, случайное значение в коде или новая идея противоречат этому файлу, приоритет у этого файла. Осознанные изменения сначала вносятся сюда, затем в компоненты.

Этот документ не описывает:

- архитектуру базы данных;
- API и авторизацию;
- алгоритм рекомендаций и ранжирования;
- бизнес-логику тарифов;
- production-инфраструктуру.

Они будут описаны отдельным системным документом.

---

## 1. Основа концепции

Chereda — визуальный каталог и социальная платформа для event-индустрии. Интерфейс соединяет четыре модели:

1. Pinterest — визуальное исследование и сохранение идей.
2. Behance — кейсы, авторство и профессиональная репутация.
3. Каталог подрядчиков — поиск по категории, городу, стоимости и параметрам.
4. Социальная платформа — подписки, реакции, коллекции и совместные проекты.

### 1.1. Визуальная формула

```text
90% нейтральная интерфейсная система
+ 8% цвет изображений и аватаров
+ 2% функциональные акценты
= Chereda
```

Интерфейс не конкурирует с кейсами. Главный визуальный контент создают фотографии, видео, афиши, площадки и люди.

### 1.2. Характер дизайна

- профессиональный, но не корпоративно-холодный;
- современный, но не завязанный на краткосрочные тренды;
- визуально плотный, но структурированный;
- нейтральный вокруг контента;
- быстрый для сканирования;
- одинаково естественный для B2C и B2B;
- пригодный для больших каталогов и длинных сессий.

### 1.3. Главные принципы

#### Контент важнее оболочки

Цветные изображения доминируют. Навигация, фильтры и карточки остаются спокойными.

#### Плотность без визуального шума

Плотность создаётся сеткой и компактной типографикой, а не уменьшением кликабельных областей.

#### Один паттерн — одно значение

- pill означает фильтр, тег или статус;
- прямоугольная кнопка означает действие;
- текстовая ссылка означает навигацию;
- круглая кнопка означает одиночное icon-action;
- цветной badge означает особый статус.

#### Реальные состояния обязательны

Каждый интерактивный элемент получает default, hover, active/selected, focus-visible, disabled и loading.

#### Система должна пережить рост продукта

Новые категории и роли добавляются через существующие шаблоны, а не через новые стили.

---

## 2. Что взято из исходных макетов

Исходные макеты используют рабочую ширину 1908 px — фактически desktop viewport около 1920 px с учётом системной полосы прокрутки.

Зафиксированные параметры:

| Параметр | Значение |
|---|---:|
| Рабочая ширина макета | 1908 px |
| Поля desktop | 80 px |
| Ширина контента | 1748 px |
| Высота desktop-header | 60 px |
| Межколоночный gap | 16 px |
| Базовая сетка | 6 колонок по 278 px |
| Search hero | 340 px |
| Высота основных фильтров | 40 px |
| Базовые размеры текста | 12 / 14 / 16 / 24 / 36 px |
| Основной радиус карточек | около 20 px |
| Темы | light + dark |

### 2.1. Математика desktop-сетки

```text
1908 = 80 + (278 × 6) + (16 × 5) + 80
```

Производные раскладки внутри контейнера:

| Раскладка | Размер элемента | Формула |
|---|---:|---|
| 6 колонок | 278 px | 6 × 278 + 5 × 16 = 1748 |
| 4 колонки | 425 px | 4 × 425 + 3 × 16 = 1748 |
| 3 колонки | 572 px | 3 × 572 + 2 × 16 = 1748 |
| 2 колонки | 866 px | 2 × 866 + 1 × 16 = 1748 |
| 1 колонка | 1748 px | полный контейнер |

Не создавать случайные ширины карточек, если задачу можно решить одной из этих раскладок.

---

## 3. Логотип и написание

### 3.1. Название

Основное написание: **Chereda**.

Не использовать в интерфейсе:

- CHEREDA во всех местах одновременно;
- chereda со строчной буквы как основное имя;
- Череда как замену бренду без отдельного решения;
- декоративные символы внутри слова.

### 3.2. Текстовый wordmark

До появления отдельного SVG-логотипа используется текстовый wordmark:

```css
.brand-wordmark {
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1;
  font-weight: 750;
  letter-spacing: 0.22em;
  color: var(--text-primary);
}
```

Правила:

- высота визуального блока — 20 px;
- минимальная свободная зона — 16 px;
- не добавлять знак без отдельного бренд-решения;
- в тёмной теме wordmark становится светлым автоматически.

---

## 4. Типографика

### 4.1. Основной шрифт

**Roboto Flex Variable** — основной и единственный интерфейсный шрифт, подтверждённый исходными макетами.

Причины выбора:

- качественная кириллица и латиница;
- аккуратные цифры и цены;
- современная геометрия без излишней стерильности;
- хорошо работает и в 12 px, и в крупных заголовках;
- variable font уменьшает количество подключаемых файлов;
- свободно доступен через Google Fonts.

Fallback:

```css
font-family: "Roboto Flex", Inter, -apple-system, BlinkMacSystemFont,
  "Segoe UI", Arial, sans-serif;
```

Не смешивать Roboto Flex с Montserrat, Arial, Roboto или случайными локальными шрифтами.

### 4.2. Насыщенности

| Token | Weight | Применение |
|---|---:|---|
| `regular` | 400 | длинный текст, описания |
| `medium` | 500 | metadata, навигация, поля |
| `semibold` | 600 | кнопки, tabs, подписи карточек |
| `bold` | 700 | заголовки, названия профилей |
| `extra` | 750 | wordmark и редкие сильные акценты |

Вес 800+ не использовать в интерфейсе без отдельной причины.

### 4.3. Типографическая шкала

| Token | Size / line-height | Weight | Применение |
|---|---|---:|---|
| `display-lg` | 48 / 52 | 700 | редкий hero marketing |
| `display-md` | 36 / 42 | 700 | заголовок поиска, профиль |
| `heading-xl` | 28 / 34 | 700 | заголовок страницы |
| `heading-lg` | 24 / 30 | 700 | заголовок секции |
| `heading-md` | 20 / 26 | 700 | карточка detail, modal title |
| `heading-sm` | 16 / 22 | 700 | подзаголовок, card title |
| `body-lg` | 16 / 24 | 400 | основной текст |
| `body-md` | 14 / 20 | 400 | стандартный UI-текст |
| `body-sm` | 12 / 18 | 400 | metadata и подписи |
| `label-lg` | 16 / 20 | 600 | крупная кнопка |
| `label-md` | 14 / 18 | 600 | controls, tabs |
| `label-sm` | 12 / 16 | 600 | badges и compact actions |
| `caption` | 11 / 14 | 500 | техническая подпись |

### 4.4. Правила типографики

- Длина строки описания: 55–75 символов.
- Заголовки карточек: максимум 2 строки.
- Metadata в карточках: максимум 1 строка, далее ellipsis.
- Для цен, статистики и рейтингов включать `font-variant-numeric: tabular-nums`.
- Не уменьшать функциональный текст ниже 12 px.
- Не использовать uppercase для длинных фраз.
- Letter spacing по умолчанию: `0`.
- Для `caption`: `0.01em`.
- Для wordmark: `0.22em`.

---

## 5. Цветовая система

### 5.1. Общий принцип

Основная система монохромная. Цвет применяется только для:

- PRO и платного продвижения;
- верификации;
- статусов успеха, предупреждения и ошибки;
- selected-состояний;
- аккуратной персонализации категорий;
- реального медиа-контента.

### 5.2. Brand и функциональные цвета

| Token | HEX | Назначение |
|---|---|---|
| `brand-pro` | `#E63462` | PRO, premium, акцент платформы |
| `brand-pro-hover` | `#C92650` | hover PRO-action |
| `brand-pro-soft` | `#FCE8EE` | мягкий PRO background |
| `brand-gold` | `#ECA400` | исходный жёлтый акцент; warning/награда |
| `brand-green` | `#5A9367` | исходный зелёный акцент; success/доступность |
| `brand-blue` | `#0074FF` | исходный синий акцент; info/link/verification |
| `brand-ink` | `#3C1642` | исходная тёмно-фиолетовая бренд-поверхность |
| `verified` | `#0074FF` | подтверждённый профиль |
| `focus` | `#2563EB` | focus ring |
| `success` | `#168A55` | success |
| `success-soft` | `#E7F7EF` | success background |
| `warning` | `#D98600` | предупреждение |
| `warning-soft` | `#FFF4D6` | warning background |
| `danger` | `#D92D20` | ошибка, destructive action |
| `danger-soft` | `#FEECEB` | error background |

### 5.3. Light theme

| Token | HEX | Назначение |
|---|---|---|
| `bg-canvas` | `#FFFFFF` | фон страницы |
| `bg-surface` | `#FFFFFF` | карточка, modal |
| `bg-subtle` | `#F7F8F9` | вторичный фон |
| `bg-muted` | `#EDEEF0` | hero, placeholder, skeleton base |
| `bg-inverse` | `#181B1F` | тёмная кнопка/инверсия |
| `text-primary` | `#111315` | основной текст |
| `text-secondary` | `#5F6368` | metadata |
| `text-tertiary` | `#8A9097` | placeholder, hint |
| `text-disabled` | `#B6BBC1` | disabled |
| `text-inverse` | `#FFFFFF` | текст на тёмном |
| `border-subtle` | `#E5E7E9` | стандартный border |
| `border-strong` | `#CDD1D5` | активный/выраженный border |
| `overlay` | `rgba(17, 19, 21, 0.52)` | overlay modal |

### 5.4. Dark theme

Dark theme — не отдельный дизайн. Компоненты сохраняют размеры, структуру и иерархию.

| Token | HEX | Назначение |
|---|---|---|
| `bg-canvas` | `#181B1F` | фон страницы из исходного макета |
| `bg-surface` | `#20242A` | карточка |
| `bg-subtle` | `#242930` | вторичный фон |
| `bg-muted` | `#2B3139` | placeholders |
| `bg-inverse` | `#F6F7F8` | светлая инверсия |
| `text-primary` | `#F4F6F8` | основной текст |
| `text-secondary` | `#B5BBC3` | metadata |
| `text-tertiary` | `#858D97` | hint |
| `text-disabled` | `#626A74` | disabled |
| `text-inverse` | `#111315` | текст на светлом |
| `border-subtle` | `#323841` | стандартный border |
| `border-strong` | `#48515D` | выраженный border |
| `overlay` | `rgba(0, 0, 0, 0.68)` | overlay modal |

В dark theme цвет `brand-pro` допускается осветлить до `#F04B78` для контраста.

### 5.5. Запреты по цвету

- Не использовать градиенты в базовом интерфейсе.
- Не окрашивать каждую категорию своим ярким цветом.
- Не ставить цветной фон под длинный текст.
- Не использовать чистый `#000000` для больших поверхностей.
- Не применять красный как декоративный цвет: он сохраняется для danger.
- Не использовать более одного сильного акцента в одном компоненте.

---

## 6. Дизайн-токены

### 6.1. Spacing

Базовый модуль — 4 px.

| Token | px | Применение |
|---|---:|---|
| `space-0` | 0 | reset |
| `space-1` | 4 | icon/text micro-gap |
| `space-2` | 8 | compact gap |
| `space-3` | 12 | внутренний gap |
| `space-4` | 16 | основной gap сетки |
| `space-5` | 20 | padding medium |
| `space-6` | 24 | section inner padding |
| `space-7` | 28 | category rhythm из макета |
| `space-8` | 32 | block gap |
| `space-10` | 40 | section compact |
| `space-12` | 48 | section standard |
| `space-16` | 64 | section large |
| `space-20` | 80 | desktop page margin |
| `space-24` | 96 | hero spacing |

Не вводить значения 13, 15, 18, 22, 27, 31 px без доказуемой причины.

### 6.2. Радиусы

| Token | px | Применение |
|---|---:|---|
| `radius-xs` | 6 | tiny badge |
| `radius-sm` | 8 | tooltip, compact control |
| `radius-md` | 12 | input, select, button |
| `radius-lg` | 16 | image, popover |
| `radius-xl` | 20 | основной card shell |
| `radius-2xl` | 24 | modal / hero card |
| `radius-pill` | 999 | pill, avatar, chip |

Вложенный радиус всегда меньше внешнего минимум на величину внутреннего отступа.

### 6.3. Бордеры

| Token | Значение |
|---|---|
| `border-default` | `1px solid var(--border-subtle)` |
| `border-active` | `1px solid var(--text-primary)` |
| `border-pro` | `1px solid var(--brand-pro)` |
| `focus-ring` | `0 0 0 3px color-mix(in srgb, var(--focus) 25%, transparent)` |

Толщина 2 px используется только для focus/selected, а не для обычных карточек.

### 6.4. Тени

Chereda — border-first система. Постоянные тени на карточках запрещены.

| Token | Значение | Применение |
|---|---|---|
| `shadow-xs` | `0 1px 2px rgba(16,24,40,.06)` | sticky header |
| `shadow-sm` | `0 4px 12px rgba(16,24,40,.08)` | dropdown |
| `shadow-md` | `0 12px 32px rgba(16,24,40,.14)` | modal/popover |

### 6.5. Z-index

| Token | Value |
|---|---:|
| `base` | 0 |
| `sticky` | 20 |
| `dropdown` | 40 |
| `overlay` | 60 |
| `modal` | 80 |
| `toast` | 100 |

### 6.6. CSS token starter

```css
:root {
  --font-sans: "Roboto Flex", Inter, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Arial, sans-serif;

  --bg-canvas: #ffffff;
  --bg-surface: #ffffff;
  --bg-subtle: #f7f8f9;
  --bg-muted: #edeef0;
  --bg-inverse: #181b1f;

  --text-primary: #111315;
  --text-secondary: #5f6368;
  --text-tertiary: #8a9097;
  --text-disabled: #b6bbc1;
  --text-inverse: #ffffff;

  --border-subtle: #e5e7e9;
  --border-strong: #cdd1d5;

  --brand-pro: #e63462;
  --brand-pro-hover: #c92650;
  --brand-pro-soft: #fce8ee;
  --brand-gold: #eca400;
  --brand-green: #5a9367;
  --brand-blue: #0074ff;
  --brand-ink: #3c1642;
  --verified: #0074ff;
  --focus: #2563eb;
  --success: #168a55;
  --warning: #d98600;
  --danger: #d92d20;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-7: 28px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;

  --radius-xs: 6px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 24px;
  --radius-pill: 999px;

  --header-height: 60px;
  --control-sm: 32px;
  --control-md: 40px;
  --control-lg: 48px;
  --content-max: 1748px;
  --grid-gap: 16px;
}

[data-theme="dark"] {
  --bg-canvas: #181b1f;
  --bg-surface: #20242a;
  --bg-subtle: #242930;
  --bg-muted: #2b3139;
  --bg-inverse: #f6f7f8;
  --text-primary: #f4f6f8;
  --text-secondary: #b5bbc3;
  --text-tertiary: #858d97;
  --text-disabled: #626a74;
  --text-inverse: #111315;
  --border-subtle: #323841;
  --border-strong: #48515d;
  --brand-pro: #f04b78;
}
```

---

## 7. Сетка и responsive

### 7.1. Desktop XL

```css
.page-container {
  width: min(calc(100% - 160px), 1748px);
  margin-inline: auto;
}
```

Для viewport меньше 1908 px боковые поля уменьшаются по breakpoint-правилам.

### 7.2. Breakpoints

| Name | Viewport | Поля | Основная раскладка |
|---|---:|---:|---|
| `mobile` | 360–767 | 16 px | 1 card / 2-column media masonry |
| `tablet` | 768–1023 | 24 px | 2 cards |
| `desktop-sm` | 1024–1279 | 32 px | 3 cards |
| `desktop-md` | 1280–1599 | 48 px | 4 cards |
| `desktop-lg` | 1600–1919 | 64 px | 5–6 cards |
| `desktop-xl` | 1920+ | 80 px, max 1748 | 6 cards |

### 7.3. Responsive-правила

- Контент не масштабируется пропорционально всему экрану.
- Текстовые стили не уменьшаются ниже заданных значений.
- Карточки перестраиваются по колонкам.
- Горизонтальные rail-блоки становятся swipe-каруселью.
- Desktop mega-category grid на mobile открывается через categories sheet.
- Фильтры на mobile открываются в full-height bottom sheet.
- Применённые фильтры показываются горизонтальными chips над результатами.
- Desktop-header на mobile заменяется компактным top bar + bottom navigation.
- Минимальная ширина интерактивной области — 44 px.

### 7.4. Mobile navigation

Bottom navigation, высота 64 px + safe-area:

1. Лента.
2. Поиск.
3. PRO.
4. Коллекции.
5. Профиль.

Кнопки «Добавить» нет: текущая роль Viewer ничего не публикует. `Рейтинг` находится внутри PRO или меню профиля, чтобы не перегружать нижнюю навигацию.

---

## 8. Иконки

### 8.1. Выбранный пакет

**Phosphor Icons** — единый icon pack проекта.

Официальные пакеты:

- React: `@phosphor-icons/react`
- Raw SVG/catalog: `@phosphor-icons/core`
- Сайт: <https://phosphoricons.com/>
- Лицензия: MIT.

Почему Phosphor:

- большой каталог, подходящий для десятков event-категорий;
- единая геометрия;
- несколько весов;
- outline, fill и duotone в одной семье;
- React, SSR и raw SVG;
- удобно показывать selected-state заменой `regular` на `fill`.

### 8.2. Размеры

| Контекст | Размер | Weight |
|---|---:|---|
| inline metadata | 16 px | regular |
| input/select | 18 px | regular |
| стандартная кнопка | 20 px | regular |
| header action | 20 px | regular |
| mobile bottom nav | 24 px | regular/fill |
| empty state | 40–48 px | duotone |

### 8.3. Правила веса

- `regular` — default.
- `bold` — только для маленьких активных иконок, где regular теряется.
- `fill` — selected/saved/liked.
- `duotone` — empty states, onboarding, иллюстративные подсказки.
- `thin` и `light` в основном интерфейсе не использовать.

### 8.4. Базовая карта иконок

| Действие/сущность | Phosphor icon |
|---|---|
| Поиск | `MagnifyingGlass` |
| Фильтры | `FunnelSimple` |
| Сортировка | `ArrowsDownUp` |
| Геолокация | `NavigationArrow` / `MapPin` |
| Уведомления | `Bell` |
| Тема | `Sun` / `Moon` |
| Профиль | `UserCircle` |
| Кейсы | `Briefcase` |
| Коллекции | `BookmarksSimple` |
| Сохранить | `BookmarkSimple` |
| Лайк/реакция | `Heart` |
| Просмотры | `Eye` |
| Комментарии | `ChatCircle` |
| Поделиться | `ShareNetwork` |
| Скачать | `DownloadSimple` |
| Рейтинг | `Trophy` |
| Верификация | `SealCheck` |
| Цена | `CurrencyRub` |
| Календарь | `CalendarBlank` |
| Фото | `ImageSquare` |
| Видео | `PlayCircle` |
| Площадка | `Buildings` |
| Артист | `MicrophoneStage` |
| Агентство | `UsersThree` |
| Техническое обеспечение | `SlidersHorizontal` |
| Транспорт | `Van` |
| Еда | `ForkKnife` |
| Декор | `Sparkle` |
| Безопасность | `ShieldCheck` |
| Редактировать | `PencilSimple` |
| Ещё | `DotsThree` |
| Закрыть | `X` |
| Назад | `ArrowLeft` |

### 8.5. Запреты

- Не смешивать Phosphor с Lucide, Material Symbols и emoji.
- Не вставлять иконку рядом с каждым пунктом текста.
- Не использовать разные веса в одной группе без семантической причины.
- Не использовать emoji как системную иконку.

---

## 9. Базовые элементы

### 9.1. Button

Размеры:

| Size | Height | Padding X | Gap | Text |
|---|---:|---:|---:|---|
| `sm` | 32 | 12 | 6 | label-sm |
| `md` | 40 | 16 | 8 | label-md |
| `lg` | 48 | 20 | 8 | label-lg |

Варианты:

- `primary` — тёмный фон, светлый текст;
- `secondary` — белый/поверхность, 1 px border;
- `ghost` — прозрачный фон;
- `pro` — `brand-pro`;
- `danger` — danger;
- `icon-only` — квадрат с равной высотой и шириной.

Состояния:

| State | Поведение |
|---|---|
| default | базовые токены |
| hover | фон темнее на 6–8%, border сильнее |
| pressed | `transform: translateY(1px)` без уменьшения |
| focus-visible | focus ring 3 px |
| disabled | opacity 0.45, cursor not-allowed |
| loading | текст сохраняет ширину, spinner 16/18 px |

Не использовать disabled только как изменение цвета текста — должна меняться вся кнопка.

### 9.2. Icon button

- размеры: 32 / 40 / 48 px;
- радиус: pill;
- icon: 18 / 20 / 22 px;
- tooltip обязателен для desktop;
- `aria-label` обязателен всегда;
- unread badge: 6–8 px, `brand-pro`.

### 9.3. Input / Search input

| Параметр | Значение |
|---|---|
| Стандартная высота | 40 px |
| Большая высота | 48 px |
| Горизонтальный padding | 16 px |
| Icon gap | 8 px |
| Radius | 12 px |
| Border | 1 px |
| Placeholder | `text-tertiary` |

Search input:

- `MagnifyingGlass` справа или слева, но единообразно внутри одного flow;
- clear-button появляется только при непустом значении;
- suggestions dropdown начинается через 8 px;
- на desktop ширина search field в фильтр-баре — 572 px;
- `Esc` закрывает suggestions;
- Enter запускает поиск.

### 9.4. Select

- высота 40 px;
- padding: 16 px слева, 12 px справа;
- `CaretDown` 16 px;
- label внутри select не прыгает;
- выбранное количество показывается badge рядом с текстом;
- длинное значение обрезается ellipsis;
- dropdown: radius 16, padding 8, shadow-sm.

### 9.5. Checkbox и radio

- visual size 18 px;
- click area минимум 44 × 44 px;
- gap с label 10 px;
- selected checkbox: тёмный фон или `brand-pro` только внутри PRO-flow;
- mixed state поддерживается для групп категорий.

### 9.6. Tabs

Header tabs:

- высота hit area 60 px;
- текст 16/20 semibold;
- active определяется цветом и нижним indicator 2 px;
- PRO active допускает `brand-pro`.

Sub-tabs:

- высота 36 px;
- текст 14/18 semibold;
- gap 24 px;
- active: text-primary + indicator 2 px;
- не использовать capsule background для основных навигационных tabs.

### 9.7. Chip / Tag

Размеры:

| Type | Height | Padding X | Radius |
|---|---:|---:|---:|
| compact | 24 | 10 | pill |
| default | 28 | 12 | pill |
| filter | 32 | 14 | pill |

Варианты:

- neutral;
- selected;
- removable;
- category;
- status;
- PRO.

Правила:

- один chip — одна мысль;
- hashtag допустим только в тематических тегах;
- removable chip содержит `X` 14 px;
- tags rail прокручивается горизонтально без переноса на mobile;
- выбранные фильтры не смешиваются с рекомендациями запросов.

### 9.8. Badge

Badge не является кнопкой.

Типы:

- `verified` — синяя `SealCheck`, 14–16 px;
- `pro` — розовый badge;
- `ad` — нейтральный «Реклама»;
- `new` — нейтральный/зелёный;
- numeric count — 18–22 px pill;
- role — нейтральный outlined badge.

### 9.9. Avatar

Размеры: 24 / 32 / 40 / 48 / 64 / 96 px.

- круглый для человека;
- rounded-square radius 12 для компании/площадки;
- verification badge располагается справа сверху;
- online status не использовать, пока нет realtime-логики;
- fallback: инициалы на нейтральном или детерминированном мягком фоне.

### 9.10. Tooltip

- задержка появления 450 ms;
- radius 8;
- max-width 240 px;
- background inverse;
- text 12/16 medium;
- не использовать tooltip для критической информации.

### 9.11. Skeleton

- использует `bg-muted`;
- shimmer 1.4 s, низкий контраст;
- геометрия повторяет реальный компонент;
- нельзя заменять всю страницу одним большим серым блоком.

### 9.12. Toast

- desktop: справа сверху, отступ 24 px под header;
- mobile: над bottom navigation;
- max-width 420 px;
- auto-dismiss 5 s, кроме ошибок с нужным действием;
- типы: success, info, warning, error.

### 9.13. Modal и Sheet

Modal:

- ширина 480 / 640 / 880 px;
- radius 24;
- padding 24–32 px;
- close icon справа сверху;
- focus trap обязателен.

Bottom sheet:

- mobile filters, share, quick actions;
- radius 24 px сверху;
- drag handle 40 × 4 px;
- safe-area padding обязателен.

---

## 10. Header

### 10.1. Desktop header

| Параметр | Значение |
|---|---|
| Высота | 60 px |
| Position | sticky top 0 |
| Фон | 92–96% opaque canvas + backdrop blur 12 px |
| Border bottom | 1 px subtle |
| Контейнер | 1748 px, margin 80 px на 1908 |

Структура:

- слева: Chereda;
- центр: Лента / Поиск / PRO / Рейтинг;
- справа: геолокация / тема / уведомления / профиль;
- active nav — цвет + indicator;
- логотип ведёт на главную ленту.

### 10.2. Header utilities

- location pill: высота 32 px, иконка 16 px;
- theme toggle: icon button 32 px;
- notification: icon button 32 px + badge;
- user avatar: 32 px;
- gap между utilities: 8 px.

### 10.3. Mobile top bar

- высота 56 px;
- слева wordmark или back button;
- справа максимум два actions;
- поиск при необходимости раскрывается отдельной строкой;
- основная навигация переносится вниз.

---

## 11. Карточки и медиа

### 11.1. Общий card shell

- background: `bg-surface`;
- border: 1 px `border-subtle`;
- radius: 20 px;
- overflow: hidden только для медиа-области; menu не должен обрезаться;
- постоянная тень отсутствует;
- hover: border strong + лёгкий подъём `translateY(-2px)`;
- duration: 160 ms.

### 11.2. Case media tile — лента

Используется в masonry-feed.

Состав:

- изображение или video poster;
- необязательный автор overlay;
- save action в правом верхнем углу;
- video badge с длительностью;
- количество медиа `1/10`, если пользователь открыл кейс;
- alt-текст обязателен.

Aspect ratios:

- portrait: 4:5;
- standard: 1:1;
- landscape: 4:3;
- cinema: 16:9;
- extreme ratios запрещены в общей ленте.

В masonry допускается смешение 4:5, 1:1 и 4:3. Одинаковые ratio не должны образовывать механическую таблицу.

### 11.3. PRO compact card — 278 px

Ширина desktop XL: 278 px.

Состав:

1. Header 64–72 px.
2. Avatar 48 px.
3. Название — 2 строки максимум.
4. Город — 1 строка.
5. Price level / role badges.
6. Mosaic preview 3 × 3 или 2 × 3.
7. Stats row.

Padding: 12 px.  
Internal gap: 8–12 px.  
Min-height без изображений: 132 px.  
Полная высота с 3 × 3 mosaic: около 340 px.

### 11.4. PRO popular card — 425 px

Используется в горизонтальном popular rail.

Состав:

- header: avatar + title + verified + more;
- metadata row;
- 4 preview images;
- `+N` overlay на последнем изображении;
- optional ad badge;
- stats не более 5 показателей.

Высота: 220–240 px.  
Media row: 104–112 px.  
Card padding: 12 px.

### 11.5. PRO medium card — 572 px

Используется для двухстрочного описания или более крупного preview.

- layout: header сверху, media 4 items снизу;
- title до 2 строк;
- optional CTA появляется только на hover/focus;
- не показывать более 5 stats.

### 11.6. PRO wide card — 866 px

Используется для editorial-подборок, promoted profile и рекомендованной команды.

- 40% информация / 60% media;
- допускается краткое описание до 3 строк;
- CTA: «Открыть профиль» или «Предложить сотрудничество»;
- не использовать wide card для каждого результата.

### 11.7. Статистика карточки

Порядок метрик:

1. Кейсы.
2. Просмотры или подписчики — зависит от контекста.
3. Отзывы.
4. Рейтинг.
5. Сохранения — только автору или в аналитике.

Иконки 16 px, текст 12 px, gap внутри пары 4 px, между парами 12–16 px.

Не показывать метрику без подписи или устойчивой иконографической семантики.

### 11.8. Case card attribution

Каждый кейс может иметь несколько участников.

Отображение:

- основной автор;
- `+N участников`;
- при раскрытии — роль каждого: организатор, площадка, фотограф, декоратор и т.д.;
- verified author отмечается отдельно;
- один кейс не копируется в отдельные дубли для каждого автора.

---

## 12. Изображения и контент

### 12.1. Качество

- Загружать WebP/AVIF, fallback JPEG.
- Preview width: 480 / 720 / 1080 / 1440.
- Не растягивать изображение выше исходного разрешения.
- `object-fit: cover` для preview.
- `object-fit: contain` для афиш, логотипов и документов.
- focal point хранится отдельно, если появится crop editor.

### 12.2. Цветовая роль изображений

Изображения дают продукту эмоциональность. UI вокруг них не получает случайные цветные фоны.

### 12.3. Overlay

Для текста на фото применять локальный gradient overlay:

```css
background: linear-gradient(
  to top,
  rgba(0, 0, 0, 0.58),
  rgba(0, 0, 0, 0) 55%
);
```

Не затемнять всё изображение, если текст находится только внизу.

### 12.4. Placeholder policy

Слова «Фотография», «Название», повторяющиеся цифры и изображения в исходных макетах — только разметочные placeholders.

В investor demo запрещены:

- Lorem ipsum;
- «Название компании 1»;
- десять одинаковых фотографий;
- одинаковая статистика на всех карточках;
- пустые аватары без fallback;
- категории «Нужен ещё один пункт».

Нужен реалистичный seed-контент с разными городами, специализациями, именами, ценовыми сегментами и количеством кейсов.

---

## 13. Паттерны страниц

### 13.1. Лента

Структура:

1. Header.
2. Sub-tabs: Для вас / Популярное / Новое.
3. Quick topics rail.
4. Заголовок персонального блока.
5. Masonry media feed.
6. Infinite loading marker.

Desktop XL:

- 6 columns;
- gap 16 px;
- первый контент отступает от header на 32 px;
- заголовок секции использует 24 px;
- hover actions не должны постоянно висеть на всех карточках.

Guest state:

- default tab: Популярное;
- «Для вас» объясняет необходимость выбора интересов;
- сохранение вызывает мягкий auth-gate после клика, а не заранее.

### 13.2. Поиск — пустой запрос

Структура:

1. Header.
2. Search hero 340 px.
3. Search filter bar.
4. Suggested queries.
5. Тематический rail.
6. Рекомендуемая media-сетка.

Search hero:

- background `bg-muted`;
- крупный editorial visual слева;
- заголовок 36/42;
- подзаголовок 14/20;
- credit изображения в правом нижнем углу;
- не использовать hero после того, как пользователь запустил поиск.

Desktop search bar grid:

```text
Search 572 | Category 278 | Location 278 | Style 278 | Sort 278
gap = 16
```

### 13.3. Поиск — введён запрос

После запроса hero исчезает.

Структура:

1. Header.
2. Filter bar с отступом 20 px.
3. Applied filters row.
4. Result count + view controls.
5. Masonry results.

Поведение:

- input сохраняет запрос;
- количество выбранных параметров показывается badge;
- chips можно удалять по одному;
- «Очистить всё» появляется после двух и более фильтров;
- URL должен визуально соответствовать текущим фильтрам в будущей системной логике;
- при пустом результате показываются варианты ослабления запроса.

### 13.4. PRO-каталог

Структура:

1. Header.
2. Category mega-grid: 6 columns desktop.
3. Popular profiles rail.
4. Category sections.
5. View density control: компактно / стандартно / крупно.
6. Pagination или infinite loading.

Категории:

- первый пункт «Все»;
- категории группируются семантически;
- выбранная категория получает pill/background или underline, но не оба сразу;
- повторяющиеся и дублирующие категории объединяются до отображения.

Плотность:

- compact: 6 cards;
- standard: 4 cards;
- large: 3 или 2 cards;
- переключение не меняет данные и порядок результатов.

### 13.5. Профиль PRO

Структура:

1. Cover 240–320 px.
2. Avatar/logo 96 px.
3. Name + verification + PRO status.
4. Category, city, price segment.
5. Primary CTA: «Предложить сотрудничество».
6. Secondary CTA: «Подписаться» / «Сохранить».
7. Tabs: Кейсы / Услуги / О профиле / Отзывы.
8. Stats.
9. Portfolio grid.
10. Recommendations.

Правила:

- cover не содержит критический текст;
- CTA виден без прокрутки на desktop;
- контакты показываются через отдельное действие;
- social links оформляются иконками Phosphor/официальными brand-icons только в специальной группе;
- price segment не заменяет подробные услуги.

### 13.6. Профиль B2C

Структура:

- avatar + name;
- интересы;
- коллекции;
- сохранённые кейсы;
- подписки;
- настройки персонализации;
- город и радиус рекомендаций.

Не показывать профессиональные метрики, если пользователь не активировал PRO-профиль.

### 13.7. Кейс

Структура desktop:

- media gallery слева 65–70%;
- sticky information column справа 30–35%;
- название;
- описание;
- дата и город;
- участники с ролями;
- реакции, сохранение, поделиться;
- похожие кейсы;
- рекомендованные исполнители.

Media gallery:

- до 10 фото/видео;
- первое медиа — cover;
- каждое медиа имеет собственный alt;
- видео не запускается автоматически со звуком;
- gallery сохраняет исходные пропорции в detail-view.

### 13.8. Создание кейса

Step flow:

1. Медиа.
2. Основная информация.
3. Участники и роли.
4. Теги и стиль.
5. Preview.
6. Публикация.

Использовать stepper только для действительно последовательных шагов. Draft autosave отображается статусом рядом с заголовком.

### 13.9. Коллекции

- card коллекции: cover collage + название + count;
- private/public status;
- создание новой коллекции внутри save-flow;
- переименование без отдельной страницы;
- drag-and-drop не обязателен для первой демо-версии.

### 13.10. Рейтинг

Структура:

- заголовок и краткое объяснение методики;
- период;
- категории;
- город;
- leaderboard;
- карточка участника;
- tooltip с составом оценки.

Нельзя показывать «99 999 баллов» без расшифровки. В demo обязательно объяснить факторы рейтинга визуально, даже если данные моковые.

### 13.11. Рекомендации

Рекомендация должна объяснять себя.

Примеры explanation chips:

- «Похожий визуальный стиль»;
- «Часто работает с выбранной площадкой»;
- «Высокий рейтинг в вашем городе»;
- «Подходит под указанный бюджет».

Не писать «Рекомендует нейросеть» без объяснения причины.

### 13.12. Авторизация и onboarding

Auth:

- modal или отдельная компактная страница;
- email/телефон + социальные способы позже;
- не перегружать преимуществами до первого действия.

B2C onboarding:

1. Город.
2. Интересы.
3. Типы событий.
4. Бюджетный диапазон — optional.

PRO onboarding:

1. Тип профиля.
2. Категория и подкатегория.
3. География работы.
4. Контакты.
5. Первый кейс.
6. Верификация — optional/later.

---

## 14. Фильтры

### 14.1. Архитектура

Фильтры делятся на три слоя.

#### Общие

- поиск;
- категория;
- расположение;
- стоимость;
- стиль;
- рейтинг;
- отзывы;
- наличие фото/видео;
- верификация;
- доступность/дата — если применимо.

#### Категорийные

Примеры:

- площадки: вместимость, тип, аренда, кейтеринг, оснащение;
- артисты: жанр, состав, длительность, гонорар;
- ведущие: формат, язык, опыт, гонорар;
- транспорт: тип, вместимость, минимальные часы;
- техника: тип оборудования, монтаж, доставка;
- агентства: специализация, масштаб проектов, портфолио.

#### Качественные

- проверенный партнёр;
- быстро отвечает;
- открытая цена;
- высокий рейтинг;
- есть совместные кейсы.

### 14.2. Правила UI

- Не показывать все фильтры сразу.
- В bar находятся 4–5 самых важных.
- Остальные открываются в filter panel.
- Категорийные фильтры появляются только после выбора категории.
- Число активных фильтров отображается badge.
- Результат обновляется сразу или по кнопке «Показать N», но не смешивать оба сценария.
- Для mobile использовать кнопку «Показать N результатов» в sticky footer sheet.

### 14.3. Стоимость

- range slider + числовые поля;
- единица измерения меняется по категории: за час, за человека, за проект, от;
- верхняя граница «200 000 000 ₽» не показывается как универсальная пользователю;
- неизвестная цена — отдельный фильтр «Цена указана»;
- currency formatting: `120 000 ₽`, без `руб.`.

---

## 15. Состояния системы

Для каждой страницы проектируются:

1. Default.
2. Loading.
3. Empty.
4. Error.
5. Partial data.
6. Guest/auth-gate.
7. Success after action.

### 15.1. Empty state

Содержит:

- Phosphor duotone icon 48 px;
- ясный заголовок;
- одно объяснение;
- одно основное действие;
- optional secondary action.

### 15.2. Error state

- объясняет, что произошло;
- предлагает повторить;
- не обвиняет пользователя;
- сохраняет введённые данные;
- destructive errors не закрываются автоматически.

### 15.3. No results

Порядок помощи:

1. Показать активные фильтры.
2. Предложить убрать самый ограничивающий.
3. Показать соседние города/категории.
4. Дать очистить всё.

---

## 16. Motion

Motion функциональный и короткий.

| Token | Duration | Применение |
|---|---:|---|
| `fast` | 120 ms | hover, icon |
| `base` | 160 ms | card, button |
| `medium` | 220 ms | dropdown, sheet |
| `slow` | 320 ms | modal/page reveal |

Easing:

```css
--ease-out: cubic-bezier(.2, .8, .2, 1);
--ease-in-out: cubic-bezier(.4, 0, .2, 1);
```

Правила:

- не анимировать layout более 320 ms;
- не применять spring ко всем компонентам;
- skeleton и progress учитывают `prefers-reduced-motion`;
- изображения fade-in 160 ms после декодирования;
- masonry items не должны хаотично перепрыгивать после загрузки.

---

## 17. Accessibility

Минимальный уровень — WCAG 2.2 AA.

- Контраст обычного текста минимум 4.5:1.
- Крупного текста минимум 3:1.
- Focus-visible обязателен.
- Touch target минимум 44 × 44 px.
- Все изображения имеют осмысленный alt или пустой alt для декоративных.
- Icon-only buttons имеют `aria-label`.
- Ошибка поля связана с input через `aria-describedby`.
- Dropdown и modal полностью управляются клавиатурой.
- Цвет не является единственным признаком состояния.
- Tabs используют корректные роли.
- Infinite feed предоставляет доступную альтернативу загрузки/перехода.
- Автовоспроизведение видео со звуком запрещено.

---

## 18. Контент-стиль интерфейса

### 18.1. Тон

- коротко;
- конкретно;
- профессионально;
- без бюрократии;
- без инфантильного стартап-сленга.

### 18.2. Кнопки

Хорошо:

- Найти подрядчика
- Сохранить в коллекцию
- Предложить сотрудничество
- Добавить участника
- Опубликовать кейс

Плохо:

- Далее, если можно назвать действие;
- Отправить для любого сценария;
- Кликните сюда;
- Магия AI;
- Получить лучший результат.

### 18.3. Системные числа

- `1 750 подписчиков`;
- `54,5 тыс. просмотров` в компактной карточке;
- `54 500 просмотров` в аналитике;
- `от 120 000 ₽`;
- `4,8 · 126 отзывов`.

---

## 19. Design inventory для investor demo

Чтобы демо воспринималось как законченный продукт, нужны следующие экраны.

### 19.1. Публичный B2C flow

- Лента гостя.
- Персональная лента.
- Популярное.
- Поиск до запроса.
- Поиск с запросом и фильтрами.
- Результаты поиска.
- Просмотр кейса.
- Сохранение в коллекцию.
- B2C-профиль.

### 19.2. Каталог и выбор исполнителя

- PRO-каталог.
- Категория.
- Карточка профиля.
- Полный PRO-профиль.
- Услуги и цены.
- Отзывы.
- Предложение сотрудничества.
- Рекомендованная команда.

### 19.3. B2B flow

- PRO-onboarding.
- Создание/редактирование профиля.
- Создание кейса.
- Добавление участников и ролей.
- Preview публикации.
- Собственный профиль.
- Мини-аналитика кейса.

### 19.4. Репутация

- Общий рейтинг.
- Рейтинг категории.
- Расшифровка баллов.
- Верифицированный профиль.
- Achievements block без геймификационного цирка.

### 19.5. Служебные состояния

- Loading.
- Empty.
- Error.
- No results.
- Auth modal.
- Notifications.
- Settings.
- Light/dark themes.
- Mobile navigation.

---

## 20. Компонентная карта

Рекомендуемые названия будущих компонентов:

```text
AppShell
DesktopHeader
MobileHeader
MobileBottomNav
BrandWordmark
ThemeToggle
LocationSelector
NotificationButton
UserMenu

PageContainer
SectionHeader
HorizontalRail
MasonryGrid
ResponsiveGrid

Button
IconButton
Input
SearchInput
Textarea
Select
MultiSelect
Checkbox
RadioGroup
Switch
Tabs
Chip
Badge
Avatar
Tooltip
Popover
DropdownMenu
Modal
BottomSheet
Toast
Skeleton
EmptyState
ErrorState

MediaTile
CaseCard
ProCardCompact
ProCardPopular
ProCardMedium
ProCardWide
ProfileHeader
ProfileStats
PriceSegment
RatingSummary
ReviewCard
ParticipantList
ParticipantRole
RecommendationReason

SearchHero
SearchFilterBar
AppliedFilters
FilterPanel
CategoryMegaGrid
SortSelect
ViewDensityControl

CollectionCard
SaveToCollectionDialog
CaseGallery
CaseSidebar
CaseComposer
Stepper
Uploader
```

Каждый компонент должен иметь:

- typed props;
- визуальные варианты;
- размеры;
- состояния;
- dark theme;
- responsive behavior;
- keyboard/focus behavior;
- skeleton, если он получает данные;
- Storybook-like demo route или локальную showcase-страницу.

---

## 21. Правила сборки в Codex

Этот раздел задаёт только визуально-компонентные ограничения, не стек.

### 21.1. Source of truth

- Цвета только через semantic tokens.
- Spacing только через scale/tokens.
- Радиусы только через tokens.
- Иконки только через единый wrapper над Phosphor.
- Typography только через классы/variants.
- Card layouts только через определённые grid patterns.

### 21.2. Нельзя

- hardcode цвета в отдельных страницах;
- вставлять inline SVG вместо icon component без причины;
- создавать новую кнопку ради одного экрана;
- задавать `font-size: 13px` или случайные размеры;
- использовать box-shadow на каждой карточке;
- делать desktop через масштабированную mobile-версию;
- дублировать markup для light/dark;
- оставлять placeholders в investor build;
- собирать interface из абсолютного позиционирования;
- привязывать layout к высоте конкретного скриншота.

### 21.3. Можно

- CSS Grid для каталогов;
- CSS Columns или masonry-подход без нарушения порядка чтения;
- container queries для card variants;
- aspect-ratio для media;
- clamp для внешних полей и display typography;
- data-attributes для states/variants;
- CSS variables для themes.

### 21.4. Визуальная проверка

Каждая ключевая страница проверяется минимум на:

- 390 × 844;
- 768 × 1024;
- 1024 × 768;
- 1440 × 900;
- 1920 × 1080.

Не считать страницу готовой, если она проверена только на одном desktop-размере.

---

## 22. Definition of Done — дизайн

Экран готов, если:

- использует утверждённую сетку;
- не содержит случайных размеров;
- работает в light и dark;
- имеет loading/empty/error;
- адаптирован для mobile;
- все actions имеют hover/focus/disabled;
- карточки заполнены реалистичным контентом;
- интерактивные зоны не меньше 44 px;
- изображения не искажены;
- текст не обрезается без предусмотренного ellipsis;
- selected-state различим без опоры только на цвет;
- нет смешения icon packs;
- отсутствуют Lorem ipsum и технические placeholders;
- визуально понятен следующий шаг пользователя.

---

## 23. Критические решения для дальнейшей разработки

Эти пункты считаются утверждёнными для первой демо-версии:

1. Базовая ширина — 1920/1908, контент 1748 px.
2. Desktop grid — 6 колонок по 278 px, gap 16 px.
3. Page margins — максимум 80 px.
4. Header — 60 px.
5. Основной шрифт — Roboto Flex Variable.
6. Иконки — Phosphor Icons.
7. Основная палитра — нейтральная black/white/gray.
8. PRO accent — `#E63462`.
9. Verification — `#0074FF`.
10. Основной card radius — 20 px.
11. Controls — 40 px, mobile hit area минимум 44 px.
12. Карточки без постоянной тени.
13. Контент ленты — masonry.
14. Каталог — переключаемая плотность 6/4/3/2.
15. После поискового запроса hero исчезает.
16. Mobile filters — bottom sheet.
17. Light/dark используют одну компонентную структуру.
18. Investor demo заполняется реалистичными данными.
19. Рекомендации всегда получают понятное объяснение.
20. Компоненты и токены создаются раньше отдельных страниц.

---

## 24. Порядок дизайн-сборки

### Этап 1. Foundations

- tokens;
- themes;
- typography;
- icons;
- layout containers;
- responsive grid.

### Этап 2. Primitives

- buttons;
- form controls;
- chips/badges;
- overlays;
- feedback states.

### Этап 3. Content components

- media tile;
- case cards;
- PRO cards;
- profile blocks;
- gallery;
- reviews;
- recommendation explanations.

### Этап 4. Main pages

- app shell;
- feed;
- search;
- PRO;
- case;
- profiles;
- collections;
- ratings.

### Этап 5. Demo polish

- realistic seed content;
- transitions;
- skeletons;
- empty/error states;
- responsive QA;
- investor demo route.

---

## 25. Внешние зависимости

- [Roboto Flex — Google Fonts](https://fonts.google.com/specimen/Roboto+Flex)
- [Phosphor Icons](https://phosphoricons.com/)
- [Phosphor Core / SVG assets](https://github.com/phosphor-icons/core)
- [Phosphor React](https://github.com/phosphor-icons/react)

---

## 26. Итоговая формула интерфейса

```text
Белое или графитовое полотно
+ строгая 6-колоночная сетка
+ тонкие нейтральные бордеры
+ крупные живые event-изображения
+ компактная Roboto Flex-типографика
+ Phosphor regular/fill
+ розовый PRO-акцент в малой дозе
+ понятные объяснимые рекомендации
= Chereda
```

Главная проверка любого нового решения:

> Оно помогает быстрее найти, оценить или связаться с нужным профессионалом — либо просто добавляет интерфейсу шум?

Если второе — решение не используется.
