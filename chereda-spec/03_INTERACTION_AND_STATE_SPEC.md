# Chereda — интеракции, состояния и темы

## 1. Базовая модель

Каждый интерактивный элемент должен иметь:

`default → hover → pressed → focus-visible → selected/toggled → disabled → loading`

Hover улучшает понимание, но не хранит единственный доступ к данным. На touch все важные сведения доступны по tap, отдельной кнопке или внутри detail page.

## 2. Motion

| Token | Значение | Применение |
|---|---:|---|
| `motion-fast` | 120 ms | цвет, border, icon |
| `motion-base` | 180 ms | popover, tooltip, card hover |
| `motion-slow` | 240 ms | modal/sheet, theme crossfade |
| easing | `cubic-bezier(.2,.8,.2,1)` | стандарт |

- Hover card: `translateY(-2px)` максимум.
- Pressed: `translateY(0)` или `scale(.99)` только для изолированной кнопки.
- Не анимировать layout высотой больших списков.
- `prefers-reduced-motion: reduce` отключает transform и сокращает transition до почти мгновенного.

## 3. Кнопки

| Тип | Hover | Click | Loading |
|---|---|---|---|
| Primary | фон на hover-token | основное действие | spinner + label сохраняет ширину |
| Secondary | stronger border/bg-subtle | вторичное действие | spinner, disabled |
| Ghost | bg-subtle | локальное действие | spinner icon |
| PRO | `brand-pro-hover` | PRO-действие | spinner, без пульсации |
| Danger | darker danger | destructive confirm | spinner |
| Icon-only | круглый subtle bg | одиночное действие | spinner той же геометрии |

Правила:

- Disabled элемент не показывает tooltip с действием; tooltip объясняет причину недоступности.
- Loading блокирует повторный submit.
- Success не заменяет label навсегда: короткий icon morph + toast.
- Icon-only button всегда имеет `aria-label` и desktop tooltip.

## 4. Ссылки и карточки

### Text link

- Hover: underline или усиление цвета.
- Focus: общий focus ring.
- External: иконка `ArrowSquareOut` и предупреждение в доступном имени.

### Clickable card

- Вся основная поверхность кликабельна.
- Вложенные действия bookmark/heart/menu не запускают переход карточки.
- Hover: border-strong, фон без тяжёлой тени, media scale максимум `1.015` с clip.
- Focus-within соответствует hover.
- Cursor pointer только там, где действительно есть переход.

## 5. Плашки, chips и badges

### 5.1. Категория или тег

- Если label виден полностью, tooltip не нужен.
- Если label обрезан, hover/focus через 400 ms показывает полное значение.
- Click применяет фильтр или ведёт в поиск.
- Selected: stronger border + check icon; удаление доступно через `X` с отдельным accessible label.

### 5.2. Applied filter chip

- Click по телу открывает соответствующую секцию фильтра.
- Click по `X` снимает только этот фильтр.
- Hover по `X`: danger не использовать; нейтральное усиление.
- Keyboard: Tab к chip, Delete/Backspace снимает фильтр, Enter открывает настройку.

### 5.3. Verified badge

Вид: синяя `SealCheck` + «Проверен» там, где хватает места; icon-only в compact cards.

Tooltip/popover:

> Профиль подтвердил основные данные. Это не гарантия качества услуги.

### 5.4. PRO badge

Вид: `#E63462`, короткая метка `PRO`.

Tooltip:

> Расширенный профиль с открытыми параметрами и приоритетным оформлением.

Не писать, что PRO автоматически выше в независимом рейтинге.

### 5.5. Rating/score badge

- Rating badge hover: средняя оценка и количество отзывов.
- Score hover: краткий breakdown top-3 factors.
- Click score: полный breakdown popover/dialog.

### 5.6. Price chip

Tooltip поясняет единицу: «за проект», «за час», «за человека» или «цена уточняется». Не скрывать единицу только в tooltip.

### 5.7. Location chip

Tooltip показывает основной город и условия выезда. Click открывает поиск по этой географии, кроме статичной metadata в modal.

### 5.8. Project role chip

Hover/focus показывает contribution:

> Укладка невесты и сопровождение образа в день съёмки.

Click открывает профиль участника, а не фильтр по роли.

## 6. Tooltip

- Появление: 400 ms мышь, сразу по keyboard focus.
- Исчезновение: 100 ms после ухода; pointer может перейти в интерактивный popover, но не в простой tooltip.
- Максимальная ширина 280 px.
- Короткий текст, без важных кнопок.
- Не использовать tooltip для mobile-only информации.
- Tooltip не перекрывает trigger и держится внутри viewport.
- `Escape` закрывает.

Если нужны действия, ссылки или больше двух строк объяснения, использовать popover.

## 7. Popover, dropdown и меню

- Открывается click/Enter/Space.
- Первый пункт получает focus только для menu/dialog pattern; информационный popover сохраняет focus на trigger.
- Click outside и Escape закрывают.
- Повторный click trigger закрывает.
- Активное значение отмечено check icon.
- Menu не содержит длинных форм и вложенности более одного уровня.

## 8. Modal и bottom sheet

### Desktop modal

- Ширина 480–720 px по задаче.
- Focus trap.
- Закрытие X, Escape и overlay, кроме незавершённого destructive submit.
- Возврат focus на trigger.
- Body scroll locked.

### Mobile sheet

- Full-height для фильтров; content-height для простого меню.
- Drag handle декоративный, закрытие не зависит только от swipe.
- Header и footer actions sticky.
- Safe-area учтена.

### Несохранённые данные

Contact form с введённым текстом при закрытии спрашивает подтверждение. Простые настройки фильтров закрываются без confirm, пока Apply не нажат.

## 9. Save flow

1. Bookmark click.
2. Dialog/sheet с коллекциями.
3. Выбор одной или нескольких коллекций.
4. Optimistic visual state.
5. Success toast «Сохранено в “...”» + «Открыть» + Undo.
6. При error состояние откатывается и toast предлагает Retry.

Повторный click на filled bookmark открывает управление сохранением, а не молча удаляет из всех коллекций.

## 10. Contact flow

1. Trigger «Связаться».
2. Modal показывает profile, project/service context.
3. Поля: имя, preferred channel, короткое сообщение.
4. Для demo prefill допустим, но выглядит редактируемым.
5. Submit: 600–900 ms deterministic loading.
6. Success screen: «Demo-заявка сохранена локально».
7. Создаётся notification/event в локальном state.

Не открывать реальный WhatsApp/Telegram и не показывать реальный телефон без отдельного разрешения.

## 11. Share flow

- Если поддерживается Web Share API — native share.
- Иначе dialog: copy link, demo social actions.
- Copy link → label «Скопировано» на 1.5 s + toast только один раз.
- URL содержит canonical route и допустимые параметры media/from.

## 12. Уведомления

### 12.1. Toast

Desktop: правый верхний угол под header, ширина 360–420 px. Mobile: сверху под safe-area; не перекрывает bottom nav.

| Тип | Цвет/иконка | Время | Пример |
|---|---|---:|---|
| success | `#5A9367`, `CheckCircle` | 4 s | Сохранено в коллекцию |
| info | `#0074FF`, `Info` | 5 s | Город изменён |
| warning | `#ECA400`, `Warning` | 6 s | Часть фильтров сброшена |
| error | danger, `WarningCircle` | persistent | Не удалось сохранить |

- Не окрашивать весь toast ярким цветом: цвет — icon/left accent.
- Максимум три одновременно; новые становятся в очередь.
- Action button доступна с клавиатуры.
- Error не исчезает автоматически.
- Success от одного действия не дублировать toast + modal + banner.

### 12.2. Notification center

- Bell имеет badge count до `9`; дальше `9+`.
- Dropdown desktop показывает 5 последних + «Все уведомления».
- Mobile bell ведёт на page.
- Read/unread различается не только цветом: dot + font weight.
- Item click сохраняет deep link.

### 12.3. Inline banner

Используется для page-level состояния: offline, demo mode, устаревшие данные. Не использовать вместо field error.

## 13. Light/dark/system

### 13.1. Переключение

- Header icon открывает popover `Системная / Светлая / Тёмная` либо циклически меняет режим с tooltip; настройки всегда дают три явных варианта.
- Ручной выбор сохраняется локально.
- `system` реагирует на изменение ОС.
- Перед первой отрисовкой применяется сохранённый/system theme, чтобы не было белой вспышки.
- Атрибут root: `data-theme="light|dark"`; preference хранится отдельно как `system|light|dark`.

### 13.2. Визуальное поведение

- Transition 180–240 ms только для color/background/border; первое применение без transition.
- Изображения не инвертируются и не затемняются глобальным filter.
- Логотип, skeleton, charts и overlays используют tokens.
- Dark surface не становится чисто чёрной.
- Focus ring и verified сохраняют контраст.

### 13.3. Пятицветная палитра

| Исходный цвет | Token | Роль |
|---|---|---|
| `#E63462` | `brand-pro` | бренд/PRO/premium |
| `#ECA400` | `accent-warning` | warning, позиция/награда при необходимости |
| `#5A9367` | `accent-success` | success/доступность |
| `#0074FF` | `accent-info` | link/info/verified |
| `#3C1642` | `brand-ink` | тёмная бренд-поверхность, специальные hero/footer |

Цвета не назначаются категориям. Красный danger остаётся отдельным системным цветом.

## 14. Inputs и validation

- Label не заменяется placeholder-ом.
- Error появляется после blur или submit, не во время первого ввода.
- Error text связан с полем через `aria-describedby`.
- Clear button доступна при непустом поиске.
- Search suggestions управляются стрелками, Enter выбирает, Escape закрывает.
- Range показывает min/max в полях и допускает клавиатурный ввод.
- Числа форматируются пробелами: `120 000 ₽`.

## 15. Tabs, accordion и carousel

### Tabs

- Click/Enter активирует, URL обновляется где определено.
- Left/Right перемещают focus; activation manual на тяжёлых tabs.
- Active state: текст + indicator, не только цвет.

### Accordion

- Вся строка trigger кликабельна.
- Chevron поворачивается.
- `aria-expanded` обязателен.
- Состояние не пишется в URL, кроме специально оговорённого deep link.

### Carousel/rail

- Стрелки появляются при overflow.
- Disabled arrow видима как недоступная.
- Wheel/trackpad и swipe работают.
- Нельзя делать единственный важный контент недостижимым без клавиатурной навигации.

## 16. Loading, empty, error

### Loading

- До 150 ms skeleton можно не показывать, чтобы избежать flicker.
- Skeleton повторяет геометрию, но не имитирует точный текст.
- Кнопка submit использует spinner.
- Route progress допустим в верхней границе.

### Empty

Содержит причину, одно primary action и при необходимости 3–6 рекомендаций. Не обвиняет пользователя.

### Error

Содержит понятный текст, retry и безопасный выход. Технические детали не показываются обычному Viewer.

### No results

Показывает активные filters, предлагает снять наиболее ограничивающие и никогда не подменяет ноль случайной выдачей без объяснения.

## 17. Keyboard и accessibility

- Минимальная hit area 44×44 px на touch.
- Focus order совпадает с визуальным.
- Skip link к основному контенту.
- `Escape` закрывает верхний overlay.
- Media viewer: arrows, Escape, focus trap.
- Tooltip не является единственным accessible name.
- Цвет не является единственным маркером состояния.
- Live regions: polite для success/info, assertive для blocking error.
- После фильтрации focus остаётся на изменённом control; results count объявляется live region.

## 18. Hover-матрица ключевых элементов

| Элемент | Что появляется/меняется |
|---|---|
| Project card | border, лёгкий media zoom, save/reaction controls |
| Profile card | border, 2 project thumbnails, quick facts |
| Participant card | contribution + price/location preview |
| Truncated chip | полный label tooltip |
| Verified | объяснение проверки |
| PRO | объяснение статуса |
| Rating score | top factors; click — полный breakdown |
| Location | город и условия выезда |
| Price | единица и что включено кратко |
| Icon-only action | название действия |
| Disabled control | причина недоступности |
| Gallery media | zoom cursor + caption/action overlay |

