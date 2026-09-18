# Chereda — приёмка investor demo и QA

## 1. Цель

Investor demo считается готовым не тогда, когда страницы нарисованы, а когда человек без объяснений проходит ключевую историю продукта, видит связность данных и не встречает неработающих действий.

## 2. P0 investor story

### Сценарий A: из визуала в команду

1. Открыть `/feed?tab=for-you`.
2. Найти карточку «Белый сад».
3. Открыть проект.
4. Переключить 3 media.
5. Прокрутить к «Команда проекта».
6. Навести на role chip «Укладка» и прочитать contribution.
7. Открыть профиль Елены Соколовой.
8. Увидеть цену, Москву, выезд, проекты и рейтинг.
9. Открыть услугу «Укладка + проба».
10. Нажать «Связаться» и сохранить demo-заявку.

Ожидаемый результат: пользователь понимает, что одна картинка раскрывается в проект со всей командой, включая подготовку.

### Сценарий B: профессиональный поиск

1. Открыть `/pro`.
2. Выбрать «Площадки».
3. Применить Москва, 80–150 гостей, бюджет до 500 000 ₽, сторонний кейтеринг.
4. Отсортировать по рейтингу.
5. Открыть Лофт «Берег».
6. Перейти по позиции в рейтинге.
7. Открыть score breakdown.

Ожидаемый результат: видны глубокие фильтры, объяснимое доверие и связь каталога с профилем.

### Сценарий C: персонализация и сохранение

1. Сохранить проект в новую коллекцию.
2. Открыть коллекцию из toast.
3. Вернуться назад — scroll ленты восстановлен.
4. Сменить город на Санкт-Петербург.
5. Увидеть изменённые local markers и рекомендации.
6. Переключить dark theme и обновить страницу.

Ожидаемый результат: состояние устойчиво, продукт ощущается живым.

### Сценарий D: объяснение проекта Chereda

1. Открыть `/about`.
2. За 30 секунд понять проблему и механизм.
3. Открыть интерактивный пример проекта.
4. Перейти в PRO через CTA.

Ожидаемый результат: страница объясняет ценность без устного pitch и ложных обещаний.

## 3. Route acceptance matrix

| Route | P | Populated | Loading | Empty | Error | Mobile | Dark |
|---|---:|---:|---:|---:|---:|---:|---:|
| `/feed` | 0 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/search` | 0 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/pro` | 0 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/pro/[category]` | 0 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/profiles/[slug]` | 0 | ✓ | ✓ | partial tabs | ✓ | ✓ | ✓ |
| `/projects/[slug]` | 0 | ✓ | ✓ | invalid slug | ✓ | ✓ | ✓ |
| `/ratings` | 0 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/collections` | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/collections/[slug]` | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/notifications` | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/settings` | 1 | ✓ | n/a | n/a | storage error | ✓ | ✓ |
| `/about` | 0 | ✓ | media skeleton | n/a | media fallback | ✓ | ✓ |
| `/demo` | 0 | ✓ | n/a | n/a | reset error | ✓ | ✓ |
| `/404` | 1 | ✓ | n/a | n/a | n/a | ✓ | ✓ |

## 4. Visual QA

### Desktop viewports

- 1920×1080: эталонная сетка 6×278 px в контейнере 1748 px.
- 1440×900: адаптивные поля, без горизонтального scroll.
- 1280×800: sidebar и content не конфликтуют.

### Mobile/tablet

- 390×844: основной mobile reference.
- 360×800: нет обрезанных labels/actions.
- 768×1024: tablet layout осмысленный, не растянутый mobile.
- 1024×768: filters и cards не переполняются.

### Проверки

- Roboto Flex загружен или корректный fallback без layout collapse.
- Нет текста меньше 12 px для UI.
- Hit areas не меньше 44 px на touch.
- Нет случайных цветов, градиентов и тяжёлых card shadows.
- Все элементы используют токены.
- Изображения имеют стабильный aspect ratio и не прыгают при загрузке.
- Light/dark сохраняют контраст и иерархию.

## 5. Interaction QA

- Каждая видимая кнопка нажимается или объяснимо disabled.
- Card nested actions не вызывают card navigation.
- Hover previews не блокируют переход и закрываются предсказуемо.
- Tooltip появляется на hover и focus, закрывается Escape.
- Popover не выходит за viewport.
- Modal trap/restore focus работает.
- Mobile sheet учитывает safe-area и keyboard.
- Toast не перекрывает navigation; Undo работает.
- Theme не мигает неправильным режимом при reload.
- Back восстанавливает scroll и filters.
- Refresh сохраняет route state.
- Copy/share работает в fallback режиме.

## 6. Filter QA

Для каждой категории проверить:

- доступен правильный набор filters;
- URL сериализуется и читается после refresh;
- browser back возвращает предыдущее состояние;
- reset category-specific не удаляет Viewer city;
- count соответствует выдаче;
- no-results честный;
- price unknown не считается нулём;
- travel profile появляется в другом городе с верной меткой;
- range min не превышает max;
- mobile Apply и desktop instant update дают одинаковый результат.

Обязательные категории для ручной проверки: venues, artists, photo-video, beauty, catering, transport.

## 7. Data integrity QA

Автоматически проверять:

- уникальность ID/slug;
- существование всех relation IDs;
- минимум media/credits у hero-projects;
- минимум projects/services у hero-profiles;
- совпадение project credits и profile project list;
- сумму rating breakdown;
- уникальный rank в срезе;
- существование notification deep links;
- существование files из media manifest;
- отсутствие повторного source URL/hash;
- наличие alt у content media;
- допустимые price unit/currency;
- корректный city slug;
- запрет orphan hero entities.

## 8. Content QA

- Нет Lorem ipsum и служебных заглушек.
- Нет одинаковых имён/описаний/статистики из-за copy-paste.
- Все лица и компании явно demo и не имитируют реальных известных участников.
- Нет реальных телефонов и активных социальных handles.
- Тексты не обещают production-функции.
- У проекта виден коллективный характер.
- Beauty/preparation roles присутствуют минимум в трёх hero-projects.
- География и цена присутствуют в карточках и detail pages.
- Рекомендация имеет reason.

## 9. Media QA

- Каждый asset есть в manifest.
- Source/license URLs заполнены.
- Нет watermark и заметных брендов.
- Нет вводящего в заблуждение подписывания людей и мест.
- Не смешаны несовместимые лица/сезоны в одном hero-project.
- Hero/media variants оптимизированы.
- Broken image имеет fallback без layout shift.
- Video не стартует со звуком.

## 10. Accessibility QA

- Полный P0 flow проходим только клавиатурой.
- Один `h1` на страницу; headings без скачков.
- Landmarks и skip link.
- Icon buttons имеют accessible names.
- Inputs имеют labels/errors/descriptions.
- Tabs/menu/dialog соответствуют ARIA pattern.
- Focus видим в light/dark.
- Contrast WCAG AA для текста и controls.
- 200% zoom не теряет действия.
- Reduced motion учитывается.
- Live updates объявляются без спама.

## 11. Performance budget demo

Точные инструменты закрепит `TECH_STACK.md`, но цели:

- initial route не загружает все 220 media;
- below-fold lazy;
- route chunks разделены;
- изображения responsive и оптимизированы;
- не более одного variable font family;
- interaction после первой загрузки не ждёт внешнего API;
- skeleton не вызывает layout shift;
- длинные lists virtualize/paginate при необходимости.

## 12. Cross-state matrix

Для project, profile, PRO results и ratings проверить комбинации:

| Dimension | Values |
|---|---|
| Theme | light / dark / system |
| Viewport | desktop / tablet / mobile |
| Data | loading / populated / empty / error |
| Viewer | default / saved / reacted / contacted |
| Location | local / travel / remote / absent |
| Price | fixed / from / range / on request |
| Trust | verified / unverified |

Не требуется ручной прогон всех комбинаций; pairwise coverage достаточен, P0 happy paths — полностью.

## 13. Demo hub acceptance

`/demo` должен:

- сбрасывать seed/state одной кнопкой;
- открывать каждый P0-сценарий в подготовленном состоянии;
- переключать theme;
- показывать loading/empty/error без изменения данных вручную;
- уметь вернуть default;
- не появляться в обычной навигации;
- не требовать network после загрузки assets.

## 14. Stop-ship defects

Demo нельзя показывать инвестору, если:

- Project и Case существуют как дубли;
- участник проекта не открывается;
- rating score необъясним или breakdown не сходится;
- city/price не видны в ключевом профиле;
- hover содержит критическую информацию без mobile-эквивалента;
- есть dead button в P0 flow;
- refresh ломает deep link;
- dark theme даёт нечитаемый текст;
- stock image подписан как реальная работа конкретного человека;
- фильтр показывает результат, не соответствующий выбранным условиям;
- demo зависит от нестабильного внешнего API;
- console содержит необработанные errors в happy path.

## 15. Handoff checklist для Codex

В отчёте после реализации указать:

1. какие routes и scenarios готовы;
2. какие файлы изменены;
3. какие проверки запущены и результат;
4. какие viewports/themes проверены;
5. какие demo-ограничения остались;
6. есть ли отклонения от source-of-truth;
7. как запустить и сбросить demo.

Фраза «готово» без результатов проверок не считается приёмкой.
