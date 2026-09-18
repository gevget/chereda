# Chereda — каталог категорий и фильтров

## 1. Назначение

Этот файл — канонический словарь для PRO-каталога, search filters, tags и seed. Он нормализует исходную CSV и добавляет обязательные категории, без которых центральный сценарий Chereda неполон.

## 2. Правила фильтрации

- Значимые фильтры отражаются в URL.
- Один и тот же field имеет одинаковый ID во всех категориях.
- Label может быть локализован, ID и value стабильны.
- Смена верхней категории удаляет только несовместимые category-specific filters.
- Count рядом с option вычисляется из текущего набора результатов.
- Option с нулём не скрывается, а становится disabled, если это помогает понять структуру.
- Range ограничивается реальными demo min/max для категории.
- «Есть фото/видео/портфолио» — разные признаки.
- «Расположение» разделяется на город и готовность к выезду.
- Filter sheet применяет изменения по кнопке; desktop обновляет с debounce 250–400 ms.

## 3. Универсальные фильтры

| ID | Label | Control | URL | Значения |
|---|---|---|---|---|
| `q` | Поиск | search input | `q` | строка |
| `category` | Категория | single select | `category` | category slug |
| `subcategory` | Специализация | multi-select | `subcategories` | slugs через запятую |
| `city` | Город | combobox | `city` | city slug |
| `nearby` | Рядом | switch/radius | `nearby` | `25`, `50`, `100`, `250` км при наличии geo |
| `travelMode` | Выезд | multi-select | `travel` | `local`, `nearby`, `countrywide`, `international`, `remote` |
| `priceMin` | Цена от | currency input | `priceMin` | число |
| `priceMax` | Цена до | currency input | `priceMax` | число |
| `priceUnit` | Единица цены | select | `priceUnit` | project/hour/person/shift/unit |
| `ratingMin` | Рейтинг | segmented | `rating` | `4`, `4.5`, `4.8` |
| `withReviews` | Есть отзывы | checkbox | `reviews` | `1` |
| `verified` | Проверенный профиль | checkbox | `verified` | `1` |
| `withPhoto` | Есть фото | checkbox | `photo` | `1` |
| `withVideo` | Есть видео | checkbox | `video` | `1` |
| `withPortfolio` | Есть проекты | checkbox | `portfolio` | `1` |
| `pricePublished` | Цена указана | checkbox | `priced` | `1` |
| `styles` | Стили | multi-combobox | `styles` | style slugs |
| `eventTypes` | Формат события | multi-select | `events` | event slugs |
| `availableOn` | Доступен на дату | date | `date` | ISO date |
| `languages` | Язык | multi-select | `languages` | `ru,en,...` |
| `sort` | Сортировка | select | `sort` | recommended/rating/reviews/priceAsc/priceDesc/new |
| `view` | Вид | segmented | `view` | compact/standard/visual |

### 3.1. Quick filters

Над выдачей доступны: город, бюджет, рейтинг 4.5+, проверенные, есть проекты, выезд. Остальные — в sidebar/sheet.

### 3.2. Applied chips

Порядок: категория → специализация → город/выезд → дата → цена → отраслевые параметры → доверие/media. Последний chip — «Сбросить всё», оформленный как text action.

## 4. Исходные категории: полный нормализованный список

### 4.1. Площадки — `venues`

Подкатегории (9):

- Банкетные площадки
- Бизнес-площадки
- Концертные площадки
- Свадебные площадки
- Летние площадки
- Загородные площадки
- Игровые площадки
- Спортивные площадки
- Особые площадки

Фильтры:

| ID | Label | Control | Значения/правило |
|---|---|---|---|
| `capacity` | Вместимость | range + presets | 20, 30, 50, 80, 100, 120, 150, 200, 250, 300, 350, 400, 500, 600, 700, 1000, 1500+ |
| `pricePerPerson` | Цена за человека | currency range | demo-data min/max |
| `rentPrice` | Аренда | currency range | за час/смену/мероприятие |
| `serviceFee` | Обслуживание | percent range | 0–20% |
| `outsideCatering` | Сторонний кейтеринг | tri-state | да/нет/неважно |
| `parkingSpaces` | Парковка | number min | количество мест |
| `vehicleAccess` | Заезд автомобиля | checkbox | да |
| `equipment` | Оснащение | multi-select | свет, звук, сцена, экран, мебель, Wi‑Fi |
| `kitchen` | Кухня | multi-select | собственная, доготовочная, отсутствует |
| `accessibility` | Доступность | multi-select | безбарьерный вход, лифт, санузел |
| `outdoor` | Открытая территория | checkbox | да |
| `accommodation` | Проживание | checkbox | да |

### 4.2. Артисты — `artists`

Подкатегории (42):

- Шоу-программа; Огненное/световое шоу; Юмористическое шоу; Спортивное/экстремальное шоу; Песочное шоу; Шоу мыльных пузырей; Цирковое шоу
- Травести-шоу; Оригинальный жанр; Детская программа; Этническое шоу; Бармен-шоу; Артисты цирка; Акробатическое шоу; Силовое шоу
- Иллюзионисты; Клоуны; Мимы; Жонглёры; Ростовые куклы; Животные; Атмосферные артисты; Шаржисты/художники; Живые статуи
- Предсказания; Казино; Двойники; Аквагрим/боди-арт
- Музыкальная программа; Кавер-группа; Народные/этнические музыканты; Певцы/певицы; Инструментальная музыка; Оперные исполнители; Шоу барабанов
- Танцевальная программа; Танцевальные коллективы; Народные/этнические коллективы; Классический танец; Дуэт; Стриптиз; Сольный танец

Фильтры: universal + `fee`, `minBookingHours`, `performanceDuration`, `teamSize`, `audienceAge`, `technicalRider`, `ownEquipment`, `repertoire`, `format` (solo/duo/team), `portfolioRecords`.

`fee` использует range по seed, а не исходный потолок 200 млн ₽. `Указан гонорар` нормализован в `pricePublished`.

### 4.3. Ведущие — `hosts`

Подкатегории (10):

- Ведущие праздников
- Ведущие на свадьбу
- Ведущие на корпоратив
- Актёры театра и кино
- Свадебные регистраторы
- Ведущие радио
- Свадебные распорядители
- Модераторы / деловые ведущие
- Комедийные ведущие
- Ведущие аукционов

Фильтры: universal + `fee`, `minBookingHours`, `eventDuration`, `cohost`, `languages`, `audienceSize`, `eventFormats`, `portfolioRecords`.

Исходное название «Камеди клаб» не использовать как категорию: это чужой бренд. В UI — «Комедийные ведущие».

### 4.4. Организация мероприятий — `event-agencies`

Подкатегории (11):

- Event-агентства
- Свадебные агентства
- Тимбилдинг-агентства
- Букинговые агентства
- Концертные агентства
- Событийный туризм
- Агентства деловых мероприятий
- Рекламные и PR-агентства
- Выставочные агентства
- Модельные агентства
- Event-продюсеры

Фильтры: universal + `portfolio`, `teamSize`, `yearsExperience`, `projectBudgetMin`, `servicesIncluded`, `eventFormats`, `fullCycle`, `clientTypes`.

### 4.5. Техническое обеспечение — `technical-production`

Подкатегории (8):

- Охрана
- Пиротехника
- Медицинское сопровождение
- Вывоз мусора
- Световое оборудование
- Звуковое оборудование
- Сценическое оборудование
- Экраны и проекторы

Фильтры: universal + `equipmentTypes`, `crewIncluded`, `deliveryIncluded`, `setupIncluded`, `minRentalHours`, `powerRequirements`, `certificates`, `capacityClass`.

### 4.6. Декор — `decor`

Подкатегории (4):

- Театральные декорации
- Витринистика
- Декор фестивалей и форумов
- Свадебный декор

Фильтры: universal + `decorStyles`, `floristry`, `productionIncluded`, `installationIncluded`, `dismantlingIncluded`, `rentalOnly`, `projectBudgetMin`, `materials`.

### 4.7. IT — `it`

Подкатегория: Разработка сайтов.

Фильтры: universal + `portfolio`, `remote`, `deliveryTime`, `platform`, `supportIncluded`, `integrations`.

### 4.8. Дизайн — `design`

Подкатегории: Брендинг; Полиграфия.

Фильтры: universal + `portfolio`, `remote`, `deliveryTime`, `deliverables`, `printProduction`, `sourceFilesIncluded`, `revisionCount`.

### 4.9. PR — `pr`

Подкатегории: SMM; Маркетинг; Тендерное сопровождение; Юридическое сопровождение.

Фильтры: universal + `portfolio`, `remote`, `serviceFormat`, `industryExperience`, `retainerAvailable`, `reporting`, `campaignBudgetMin`.

### 4.10. Транспорт, перевозки и курьеры — `transport`

Подкатегории (13):

- Автобусы; Автомобили; Ретро-авто; Мотоциклы
- Катера; Яхты; Гидроциклы
- Вертолёты; Самолёты; Воздушные шары
- Перевозка людей с ограниченными возможностями
- Мобильные гримёрные
- Другое

Фильтры: universal + `vehicleClass`, `passengerCapacity`, `withDriver`, `minRentalHours`, `routeDistance`, `delivery`, `modelYear`, `color`, `accessibility`, `decorationAllowed`.

Повторяющиеся исходные строки «Разное», «Вертолёты», «Самолёты» и «Воздушный шар» объединены.

### 4.11. Одежда и обувь — `fashion`

Подкатегории (8):

- Магазины и салоны
- Мужские костюмы
- Свадебные платья
- Вечерние платья
- Пошив на заказ
- Косплей
- Карнавальные костюмы
- Исторические костюмы

Фильтры: universal + `productType`, `sizeRange`, `madeToMeasure`, `fitting`, `productionTime`, `brandSegment`, `availability`, `delivery`.

### 4.12. Прокат одежды и обуви — `fashion-rental`

Подкатегории (5): Костюмерные; Косплей; Карнавальные костюмы; Исторические костюмы; Другое.

Фильтры: universal + `productType`, `sizeRange`, `rentalPeriod`, `deposit`, `fitting`, `cleaningIncluded`, `delivery`, `replacementTerms`.

## 5. Обязательное расширение для центрального demo-сценария

Эти категории прямо следуют из продуктовой идеи и должны присутствовать в seed, даже если их нет в исходной CSV.

### 5.1. Фото и видео — `photo-video`

Подкатегории: Фотографы; Видеографы; Аэросъёмка; Love story; Same-day edit; Фотобудки; Контент-мейкеры.

Фильтры: universal + `shootingHours`, `teamSize`, `secondShooter`, `deliveryTime`, `retouchCount`, `sourceFiles`, `drone`, `sameDayEdit`, `equipment`, `studioIncluded`, `portfolioStyles`.

### 5.2. Beauty и подготовка — `beauty`

Подкатегории: Визажисты; Стилисты по волосам; Ногтевой сервис; Барберы; Стилисты образа; Бровисты; Подготовка кожи.

Фильтры: universal + `onLocation`, `trialIncluded`, `serviceDuration`, `peopleCount`, `earlyStart`, `touchUp`, `materialsIncluded`, `hygieneVerified`, `portfolioStyles`.

### 5.3. Кейтеринг и еда — `catering`

Подкатегории: Кейтеринг; Банкетное меню; Фуршет; Кондитеры и торты; Бар; Кофе-станции; Food stations; Персонал кейтеринга.

Фильтры: universal + `pricePerPerson`, `minimumOrder`, `cuisine`, `dietaryOptions`, `tasting`, `serviceStaff`, `tableware`, `delivery`, `outsideVenue`, `alcoholPolicy`.

### 5.4. Персонал — `event-staff`

Подкатегории: Координаторы; Хостес; Промоутеры; Официанты; Гардеробщики; Монтажники; Курьеры; Переводчики.

Фильтры: universal + `hourlyRate`, `minBookingHours`, `peopleAvailable`, `uniform`, `languages`, `experience`, `nightWork`, `documentsVerified`.

### 5.5. Флористика — `floristry`

Подкатегории: Свадебная флористика; Оформление столов; Букеты; Крупные конструкции; Искусственные композиции.

Фильтры: universal + `flowerTypes`, `seasonal`, `installation`, `dismantling`, `delivery`, `minimumBudget`, `rentalVases`, `portfolioStyles`.

## 6. Style vocabulary

Начальный управляемый словарь:

- минимализм; классика; современный; editorial; fashion; cinematic;
- industrial; loft; арт-деко; ретро; этника; boho;
- botanical; eco; romantic; luxury; neon; futuristic;
- деловой; фестивальный; камерный; семейный; детский; иммерсивный.

Style — отдельная taxonomy. Не использовать тип события («свадьба») как style.

## 7. Event type vocabulary

- свадьба; помолвка; частная вечеринка; день рождения;
- корпоратив; тимбилдинг; деловая конференция; форум;
- выставка; презентация бренда; премия; fashion event;
- концерт; фестиваль; городской праздник; спортивное событие;
- детское событие; благотворительное событие; онлайн/гибрид.

## 8. Sort

| Value | Логика demo |
|---|---|
| `recommended` | city + relevance + quality + diversity |
| `rating` | score/rating desc, reviews tie-break |
| `reviews` | review count desc, rating tie-break |
| `priceAsc` | known `priceFrom` asc, on-request last |
| `priceDesc` | known `priceFrom` desc, on-request last |
| `new` | lastActivity desc after quality floor |

## 9. Filter dependencies

- `radius` доступен только при выбранном city и наличии geo.
- `priceUnit` меняет подписи и диапазон price.
- `date` не обещает реальную бронь; label «Свободен в demo».
- `capacity` только для venues/transport/audience-related services.
- `minRentalHours` только для аренды и транспорта.
- `remote` только для совместимых цифровых услуг.
- Смена subcategory может добавлять поля, но не удаляет универсальные.

## 10. URL examples

```text
/pro/venues?city=moscow&subcategories=lofts&capacity=80-150&priceMax=500000&outsideCatering=1&sort=recommended

/pro/photo-video?city=saint-petersburg&subcategories=photographers&styles=editorial,cinematic&priceMax=180000&verified=1

/pro/beauty?city=moscow&subcategories=hair-stylists,makeup-artists&date=2026-10-24&onLocation=1&trialIncluded=1
```

## 11. Запреты

- Не показывать 200 млн ₽ как общий видимый максимум.
- Не использовать свободный текст вместо управляемых category/style values.
- Не добавлять filter без ID, URL-правила и типа control.
- Не смешивать «есть проекты» и «есть фото».
- Не считать отсутствующую цену нулевой.
- Не скрывать профили другого города, если они явно выезжают.
- Не использовать брендовые названия как общие категории.

