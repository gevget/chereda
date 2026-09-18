# Chereda — поведение страниц

## 1. Общие правила страницы

Каждая контентная страница содержит:

- app shell из sitemap;
- один `h1`;
- breadcrumbs там, где вход не очевиден;
- явное primary action или ясную задачу просмотра;
- skeleton при ожидании;
- empty/error state;
- сохранение существенного состояния после refresh;
- корректный возврат назад со scroll restoration.

Desktop использует контентный контейнер и сетку UI kit. На mobile фильтры, вторичная информация и действия переходят в sheet/sticky action bar, но не исчезают.

## 2. Глобальная навигация

### Desktop

| Элемент | Click | Active state |
|---|---|---|
| Chereda | `/feed` | нет |
| Лента | `/feed` | маршрут `/feed` |
| Поиск | `/search` | `/search` |
| PRO | `/pro` | `/pro/*`, розовый indicator допустим |
| Рейтинг | `/ratings` | `/ratings` |
| Город | city popover | selected city label |
| Тема | цикл light/dark/system | текущая иконка + tooltip |
| Bell | `/notifications` | unread dot |
| Avatar | viewer menu | menu open |

### Mobile

Пять пунктов: Лента, Поиск, PRO, Коллекции, Профиль. Рейтинг доступен из PRO и viewer menu. Viewer не видит кнопку «Добавить».

## 3. Лента `/feed`

### Задача

Показать визуальные проекты так, чтобы один клик раскрывал команду, а не только изображение.

### Структура

1. Tabs «Для вас / Популярное / Новое».
2. Горизонтальный rail тем.
3. Masonry feed.
4. Inline-block рекомендуемых профилей после 12–18 media.
5. Следующая порция или footer marker.

### Media card

- Нажатие на изображение или название → `/projects/[slug]?media=[index]&from=feed`.
- Нажатие на avatar/name → `/profiles/[slug]`.
- Bookmark → save flow без перехода.
- Heart → локально меняет реакцию и count.
- Tag → `/search?q=[tag]`.
- Автор карточки — ведущий credit проекта, подпись «и ещё N участников» открывает проект на секции команды.

### Ограничения

- Максимум два media одного проекта в одной видимой области.
- Повтор одного media запрещён.
- Карточка не показывает фиктивное одиночное авторство, если проект коллективный.

## 4. Поиск `/search`

### Discovery state

До ввода запроса показываются поисковая строка, популярные направления, категории, стили, города и curated projects.

### Results state

После submit или применения фильтра:

- query и фильтры отражены в URL;
- видны count, applied chips, sort и tabs «Проекты / Профили / Всё»;
- desktop sidebar остаётся sticky;
- mobile filter button показывает count активных фильтров;
- reset удаляет только поисковые параметры, не глобальный город Viewer;
- изменение фильтра сбрасывает page/cursor, но не query;
- отсутствие результатов показывает причину и действия «Сбросить часть фильтров» / «Посмотреть похожее».

## 5. PRO `/pro` и `/pro/[categorySlug]`

### `/pro`

Показывает 12 нормализованных верхних категорий, быстрые задачи и объяснение отличия PRO-поиска. Это не paywall.

### Категорийная страница

Desktop:

1. breadcrumbs;
2. category title и count;
3. subcategory rail/list;
4. sidebar 280–320 px;
5. toolbar: sort, density, results count;
6. карточки профилей/площадок;
7. pagination/load more.

Mobile:

- subcategories — horizontal chips;
- все фильтры — full-height sheet;
- applied chips — под заголовком;
- sticky button «Показать N вариантов» внутри sheet.

### Карточка результата

Показывает: cover/avatar, name, type/category, city/travel marker, rating + reviews, verified, 1–3 styles, основную цену, 1–2 reasons и действия «Открыть» / bookmark.

Клик по карточке → профиль. Клик по проектному preview внутри карточки → проект. Контакт не вызывается случайным кликом по карточке.

## 6. Рейтинг `/ratings`

### Вход

Нажатие «Рейтинг» в desktop header открывает `/ratings` с глобальным городом Viewer и последней выбранной категорией. В PRO на mobile пункт «Рейтинг» открывает тот же route.

### Структура

1. `h1` «Рейтинг профессионалов».
2. Короткое объяснение и кнопка «Как считается рейтинг».
3. Category, city, period.
4. Top 3 cards.
5. Leaderboard.
6. Методика и дата пересчёта.

### Top 3

- место, avatar/cover, name, category, city;
- score, average rating, reviews;
- verified badge;
- CTA «Открыть профиль»;
- первое место визуально выделено бордером/масштабом, не золотым градиентом.

### Leaderboard row

| Зона | Поведение |
|---|---|
| Позиция | tooltip объясняет период |
| Динамика | `+N`, `−N` или `—`; tooltip «за выбранный период» |
| Профиль | клик ведёт в профиль |
| Score | клик открывает breakdown popover |
| Rating/reviews | клик прокручивает профиль к reviews через URL tab |
| Verified | tooltip с объяснением проверки |
| Row | hover подсвечивает; Enter открывает профиль |

### Score breakdown

Popover/dialog содержит вклад факторов в баллах, подпись «demo-методика», дату пересчёта и ссылку «Подробнее о методике». Сумма факторов равна score.

### Фильтрация

- Category/city/period пишутся в URL.
- Изменение фильтра обновляет top 3 и table одновременно.
- На loading старый контент не исчезает мгновенно: он приглушается и заменяется skeleton после 150 ms.
- Empty state предлагает соседний город или снятие категории.

## 7. Профессиональный профиль `/profiles/[profileSlug]`

### Пять вопросов страницы

1. Кто это?
2. Что делает и в каком стиле?
3. Где работает и выезжает ли?
4. Сколько стоит?
5. Почему ему можно доверять и как связаться?

### Верхний блок

1. Cover 3:1 / 16:5.
2. Avatar/logo, name, type/category.
3. Verified и PRO badges при наличии.
4. City + travel marker.
5. Rating/reviews и rank link.
6. Короткое описание.
7. Styles/tags.
8. Price summary.
9. Primary «Связаться».
10. Secondary «Сохранить», «Поделиться».

Rank link ведёт на `/ratings?category=[category]&city=[city]` и визуально подсвечивает строку профиля.

### Tabs

#### Проекты

- default tab;
- 6–12 project cards;
- role label на каждой карточке;
- клик → соответствующий project;
- hover по role chip показывает contribution.

#### Услуги

- service cards с названием, описанием, price type/unit, duration, location/travel;
- «Уточнить» открывает contact modal с выбранной услугой;
- price details раскрываются accordion-ом.

#### О профиле

- подробное bio;
- специализация, опыт, языки;
- города и правила выезда;
- состав команды для team/company;
- контакты показываются через contact action;
- social links имеют предупреждение о внешнем переходе.

#### Отзывы

- aggregate rating и распределение;
- filters «Все / С проектом / С текстом»;
- review item при наличии projectId ведёт в проект;
- demo не позволяет Viewer публиковать отзыв.

### Дополнительные блоки

- «Часто работают вместе» — профили с reason.
- «Похожие по стилю».
- «Проекты рядом».
- «Позиция в рейтинге».

### Sticky contact

После ухода hero-actions из viewport desktop показывает компактную sticky bar: avatar, name, price, city, «Связаться». На mobile — нижняя action bar над navigation.

### Состояния

- сохранён / не сохранён;
- подписан / не подписан;
- verified/unverified;
- price known/on request;
- local/travel/remote;
- services present/empty;
- reviews present/empty.

## 8. Проект `/projects/[projectSlug]`

### Единая сущность

Не создавать отдельные модели и страницы `Case` и `Project`. Слово «Кейс» может встречаться только как поясняющий синоним в тексте.

### Структура desktop

Основная колонка + sticky sidebar:

1. breadcrumbs;
2. project title, event type, city, date;
3. cover/gallery;
4. описание и задача;
5. tags/styles;
6. «Команда проекта»;
7. результаты/масштаб;
8. reactions, views, save/share;
9. related projects/profiles.

Sidebar: краткая сводка, ведущий credit, location, бюджетный сегмент, команда по категориям, save/share.

### Gallery

- 8–14 media в hero-project;
- thumbnail click или card click открывает media viewer и пишет `media` в URL;
- arrows/keyboard меняют media;
- Escape закрывает viewer и удаляет `media` из URL;
- автор/credit media виден в caption;
- «Скачать» присутствует только у assets с явным разрешением demo; иначе отсутствует, а не disabled.

### Команда проекта

Группы:

- организация;
- площадка;
- визуальная концепция и декор;
- фото/видео;
- beauty/style;
- программа;
- техника;
- еда;
- логистика и сервис.

Пустые группы не показываются.

Карточка credit содержит profile, роль, contribution, city/travel marker, price hint, rating, verified, open/contact actions.

### Hover credit card

На desktop появляется компактный preview поверх карточки или рядом:

- 2 mini-project previews;
- основная цена;
- город/выезд;
- rating/reviews;
- «Открыть профиль».

На touch то же содержание открывается по кнопке `Info` или внутри карточки; критическая информация не зависит от hover.

### Действия

- Save → выбор коллекции; success toast.
- Share → native share при наличии, иначе dialog/copy link.
- Reaction → optimistic local update.
- Author/profile → профиль.
- Tag → поиск.
- Location → поиск по городу/типу площадки, не внешняя карта по умолчанию.
- Contact участника → modal с контекстом проекта.

### После команды

Блок «Собрать похожую команду» показывает 4–8 профилей, которые закрывают роли проекта, с объяснением рекомендации. Это иллюстрация будущей нейросетевой ценности, но demo-логика детерминирована.

## 9. Коллекции `/collections`

- Создать коллекцию — dialog с name/description/privacy demo.
- Save из project/feed открывает существующие коллекции и «Новая коллекция».
- После сохранения кнопка становится fill, toast содержит Undo и link to collection.
- Удаление из коллекции подтверждается только при destructive bulk action; одиночное удаление имеет Undo.
- Пустая коллекция предлагает поиск и curated projects.

## 10. Уведомления `/notifications`

Страница содержит tabs «Все / Непрочитанные», группы «Сегодня / Ранее», Mark all read.

Notification click:

- сразу помечает item прочитанным;
- открывает deep link;
- сохраняет return path;
- не удаляет notification.

Unread dot исчезает, когда непрочитанных нет.

## 11. Настройки `/settings`

### Тема

Radio/segmented: `Системная / Светлая / Тёмная`. Изменение применяется сразу, сохраняется локально и подтверждается ненавязчивым toast только при ручном выборе.

### Персонализация

Город, интересы, категории, стили. Reset открывает confirm dialog и возвращает demo defaults.

### Demo

Reset state удаляет только локальное состояние Chereda demo, затем ведёт на `/demo` и показывает success banner.

## 12. О Chereda `/about`

Это отдельная информационная страница о платформе, не project detail.

### Цель

За 2–4 минуты объяснить инвестору или новому пользователю проблему, механизм и масштабируемость без выдуманных обещаний.

### Структура

1. Hero: «От вдохновения — к команде, которая это создала».
2. Проблема: подрядчики и кейсы разрознены.
3. Как работает: Вдохновение → Проект → Команда → Контакт.
4. Интерактивный пример одного проекта и 8 credits.
5. Два режима: discovery и PRO.
6. Доверие: цены, локация, отзывы, верификация, объяснимый рейтинг.
7. Ценность для Viewer.
8. Будущее для профессионалов: общие проекты, кастомные страницы, биржа — явно помечено «следующий этап».
9. География demo.
10. CTA «Посмотреть проекты» и «Открыть PRO».

### Запреты

- Не публиковать непроверенные рыночные цифры без источника и даты.
- Не говорить, что AI уже работает в production.
- Не обещать доступные бронирования, оплату или мировое покрытие.
- Не превращать страницу в длинный pitch deck; каждый тезис иллюстрировать интерфейсом.

## 13. Demo hub `/demo`

Не виден в основной навигации. Содержит карточки пяти сценариев, переключатели состояний, reset seed, light/dark и быстрые ссылки на hero-entities. Каждая карточка указывает длительность и итог сценария.

## 14. Системные страницы

### 404

Показывает путь назад, ленту, поиск и 4 популярных проекта. Не шутит в ущерб ясности.

### Error

Показывает retry, home и correlation id demo без stack trace.

### Offline

Если реализовано: статус, ранее загруженный контент, retry. Не блокирует доступ к уже открытым локальным seed-данным.

