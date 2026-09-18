# Chereda — media и бесплатные stock-источники

## 1. Цель

Создать убедительную визуальную ленту и проекты, не нарушая лицензии и не выдавая stock-контент за подтверждённое портфолио вымышленных специалистов.

Этот документ задаёт внутреннюю политику demo и не заменяет юридическую консультацию. Перед публичным коммерческим запуском лицензии и releases проверяются повторно.

## 2. Разрешённые источники

Использовать только бесплатные материалы конкретного источника, а не premium/plus элементы.

### Unsplash

- Официальная лицензия: <https://unsplash.com/license>
- Бесплатное коммерческое и некоммерческое использование допускается; attribution не обязателен, но приветствуется.
- Нельзя продавать неизменённые изображения или собирать библиотеку, конкурирующую с Unsplash.
- Не брать Unsplash+ по правилам бесплатной коллекции.

### Pexels

- Официальная лицензия: <https://www.pexels.com/license/>
- Фото и видео разрешены бесплатно, могут изменяться; attribution не обязателен.
- Нельзя продавать неизменённые копии, намекать на endorsement человека/бренда, перераспределять как stock или использовать как товарный знак.

### Pixabay

- Официальное summary: <https://pixabay.com/service/license-summary/>
- Бесплатное использование и адаптация допускаются; attribution обычно не обязателен.
- Запрещено standalone-распространение, misleading use и определённое коммерческое использование узнаваемых брендов/логотипов.
- Для каждого asset учитывать возможные дополнительные права личности, бренда, дизайна и собственности.

## 3. Запрещённые источники

Не скачивать изображения из:

- Google/Yandex Images;
- Instagram, Pinterest, VK, Telegram;
- Behance, Dribbble и личных сайтов авторов;
- сайтов event-агентств и площадок;
- пресс-релизов и СМИ;
- stock preview с watermark;
- неизвестных rehost-сайтов.

Ссылка на источник не превращает чужое изображение в разрешённое.

## 4. Asset manifest обязателен

Каждый загруженный asset имеет запись:

```json
{
  "id": "media-white-garden-01",
  "file": "projects/white-garden/01-ceremony.webp",
  "source": "pexels",
  "sourceUrl": "https://www.pexels.com/photo/.../",
  "author": "Author Name",
  "authorUrl": "https://www.pexels.com/@.../",
  "licenseUrl": "https://www.pexels.com/license/",
  "downloadedAt": "YYYY-MM-DD",
  "mediaType": "photo",
  "width": 1800,
  "height": 1200,
  "alt": "Светлый банкетный зал с длинным столом и зелёной флористикой",
  "projectId": "white-garden-wedding",
  "isDemoStock": true,
  "recognizablePeople": false,
  "recognizableBrands": false
}
```

Без manifest asset не попадает в production bundle demo.

## 5. Поиск и подбор

### 5.1. Search queries

Искать сериями на английском для стабильной выдачи:

- `editorial wedding venue botanical long table`;
- `event stage lighting concert audience`;
- `corporate conference modern stage`;
- `wedding hair stylist preparation hands`;
- `makeup artist bridal preparation`;
- `event florist installation details`;
- `catering plated dinner event`;
- `videographer camera event backstage`;
- `loft event empty interior`;
- `team building creative workshop`.

### 5.2. Визуальная совместимость проекта

Один project должен выглядеть как единая съёмка. Для hero-project:

- единая температура и контраст;
- совместимая архитектура/декор;
- повторяемые цвета и материалы;
- одна логика сезона и времени суток;
- отсутствие очевидно разных пар/главных героев в одной истории;
- media covers all roles: общий план, детали, люди в работе, подготовка, программа.

Если единая серия недоступна, использовать 4–6 нейтральных detail shots и не собирать ложный репортаж из несовместимых лиц.

## 6. Люди, бренды и локации

- Предпочитать кадры без отчётливо узнаваемых гостей и детей.
- Не использовать лицо как avatar вымышленного человека без явной проверки допустимости и нейтрального контекста.
- Для avatars безопаснее: кадры со спины/в работе, crop рук/камеры, абстрактный monogram или сгенерированный neutral portrait с маркировкой.
- Не помещать узнаваемого человека в негативный, медицинский, политический или вводящий в заблуждение контекст.
- Удалять/не брать заметные логотипы, номера машин, вывески и товарные знаки.
- Не подписывать stock-интерьер реальным адресом.
- Не писать, что конкретный вымышленный профиль автор stock-фотографии. Формулировка проекта: «демонстрационный проект».

## 7. Контентная матрица

### На один hero-project

| Кадр | Количество |
|---|---:|
| Cover wide | 1 |
| Общий план пространства | 2 |
| Декор/флористика | 2–3 |
| Люди/программа | 1–2 |
| Подготовка/beauty | 1–2 |
| Еда/detail | 1–2 |
| Техника/backstage | 1 |

### На hero-profile

- 1 avatar/logo;
- 1 cover;
- 6–12 project previews через связанные проекты;
- отдельные service images только когда они не дублируют project media.

### Для ленты

- 45% проекты/пространства;
- 20% декор и детали;
- 15% люди в работе;
- 10% сцена/свет/звук;
- 10% подготовка, beauty, еда и логистика.

Не допускать, чтобы wedding-контент занимал более 40% первых 30 карточек.

## 8. Форматы и размеры

| Назначение | Соотношение | Минимум | Output |
|---|---|---:|---|
| Project cover | 16:9 или 3:2 | 1600 px wide | AVIF/WebP + fallback |
| Profile cover | 3:1 или 16:5 | 1600 px wide | AVIF/WebP |
| Feed portrait | 4:5 | 900×1125 | AVIF/WebP |
| Feed landscape | 3:2 | 1200×800 | AVIF/WebP |
| Avatar | 1:1 | 320×320 | WebP/PNG для logo |
| Thumbnail | source ratio | 480 px wide | WebP |

- Не upscale маленькие originals.
- Хранить один master и генерировать responsive variants.
- Сохранять visual focus через `object-position` metadata.
- Strip ненужные EXIF/GPS.
- Hero target до 350 KB, card target до 180 KB, thumbnail до 80 KB при приемлемом качестве.
- Lazy-load ниже fold; hero preload только для текущей страницы.

## 9. Имена файлов

Формат:

`[entity]-[slug]-[index]-[descriptor].[ext]`

Примеры:

```text
project-white-garden-01-ceremony.webp
project-white-garden-02-table-detail.webp
profile-anna-mironova-avatar.webp
venue-loft-bereg-cover.webp
```

Без пробелов, кириллицы, случайных hash в исходном имени и слов `IMG_1234`.

## 10. Alt text

- Описывать полезное содержание кадра, а не файл.
- 60–140 знаков для content image.
- Не начинать «Изображение…».
- Указывать функцию/контекст, если он важен: «Стилист фиксирует низкий пучок во время подготовки невесты».
- Декоративный crop получает пустой alt только если рядом есть эквивалентное текстовое содержание.
- Не приписывать личность, место или авторство, которых мы не знаем.

## 11. Video

- Pexels/Pixabay video допустимы при соблюдении актуальной лицензии конкретного материала.
- Demo хранит poster локально; autoplay выключен по умолчанию в settings.
- Autoplay, если включён: muted, loop, playsinline; пауза вне viewport.
- Duration preview 6–15 s.
- Не использовать звук без явного пользовательского действия.
- Captions обязательны для смыслового speech; декоративный клип помечается соответствующе.

## 12. Deduplication

- Один asset не используется в разных project как самостоятельный кадр.
- Cover не повторяется как соседняя feed card.
- Perceptual duplicates отклоняются.
- Один автор stock не должен определять весь demo.
- Перед добавлением проверять manifest по source URL и file hash.

## 13. Attribution

Хотя три выбранных источника обычно не требуют attribution для разрешённых free assets, Chereda хранит автора и ссылку в manifest. Для investor demo можно добавить страницу/секцию «Источники demo-медиа» без перегрузки карточек.

Если конкретный asset или лицензия требует attribution, она должна быть видима в соответствующем media viewer или footer credits. Нельзя полагаться только на внутренний manifest.

## 14. Workflow для Codex

1. Определить project/profile и нужный shot list.
2. Искать только в разрешённых источниках.
3. Проверить, что asset относится к free collection и открыть актуальную license page.
4. Проверить людей, логотипы, бренды и misleading context.
5. Скачать master и создать manifest entry.
6. Оптимизировать и создать responsive variants.
7. Написать alt и visual focus.
8. Связать asset с одной сущностью.
9. Проверить light/dark card crop на desktop/mobile.
10. Запустить deduplication и broken-asset checks.

## 15. Stop conditions

Не использовать asset, если:

- источник или license неясны;
- это premium item без лицензии;
- виден watermark;
- узнаваемый человек представлен как вымышленный профессионал;
- логотип/бренд создаёт впечатление партнёрства;
- изображение требует ложного location/project claim;
- невозможно сохранить source URL и автора;
- качество недостаточно для заданного размера.

