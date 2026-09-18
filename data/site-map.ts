import {categories} from './catalog';
import {initialCollections,profiles,projects} from './seed';
import type {Collection} from '@/types/domain';

export type SiteMapEntry={href:string;label:string;description:string;kind?:'page'|'category'|'profile'|'project'|'collection'|'system'};
export type SiteMapSection={title:string;description:string;entries:SiteMapEntry[]};

const page=(href:string,label:string,description:string):SiteMapEntry=>({href,label,description,kind:'page'});

/**
 * The sitemap is a developer-facing route catalogue, not a dump of demo data.
 * Each dynamic entity is represented once so the map stays useful as the seed grows.
 */
export const buildSiteMap=(collections:Collection[]=initialCollections):SiteMapSection[]=>{
  const sampleCollection=collections[0]??initialCollections[0];
  const sampleProject=projects[0];
  const sampleProfile=profiles[0];
  const sampleCategory=categories[0];
  return [
    {title:'Основные разделы',description:'Главные сценарии исследования Chereda.',entries:[
      page('/','Главная · лента','Корневой вход в ленту'),
      page('/feed','Лента','Для вас, популярное, новое и быстрые темы'),
      page('/search','Поиск','Поиск проектов и профессионалов'),
      page('/pro','PRO-каталог','Каталог специалистов и площадок'),
      page('/ratings','Рейтинг','Score, лидеры и методика'),
      page('/about','О проекте','Как работает Chereda')
    ]},
    {title:'Viewer и сохранённое',description:'Личные разделы, коллекции и уведомления.',entries:[
      page('/me','Мой профиль','Сохранённые проекты, история и рекомендации'),
      page('/favorites','Избранное','Проекты, отмеченные реакцией Viewer'),
      page('/collections','Коллекции','Все подборки Viewer'),
      {href:`/collections/${sampleCollection.slug}`,label:'Детали коллекции',description:'Заполненная коллекция с проектами',kind:'collection'},
      page('/notifications','Уведомления','Локальные события и обновления'),
      page('/settings','Настройки','Тема, город и интересы'),
      page('/settings?tab=sitemap','Карта сайта','Каталог типов страниц внутри настроек')
    ]},
    {title:'Профессиональный контур',description:'Локальные demo-сценарии для профессионалов и рекомендаций.',entries:[
      page('/register','Регистрация / onboarding','Выбор сценария Viewer или профессионала'),
      page('/professional','Профиль профессионала','Demo-конструктор и preview'),
      page('/recommendations','Рекомендации','Объяснимые подборки'),
      page('/subscriptions','Подписки','Подписки на профессионалов'),
      page('/favorites-pro','Избранные PRO','Сохранённые профессионалы')
    ]},
    {title:'Информационные разделы',description:'По одному маршруту каждого информационного шаблона.',entries:[
      page('/platform','Возможности платформы','Возможности Chereda'),
      page('/blog','Статья · блог','Представительный шаблон статьи'),
      page('/faq','Вопросы и ответы','Шаблон FAQ'),
      page('/knowledge','База знаний','Справочный материал'),
      page('/video-lessons','Видеоуроки','Обучающий материал'),
      page('/webinars','Вебинары','Демо-вебинар'),
      page('/api','Экспорт и API','Описание локального demo API'),
      page('/support','Справочный центр','Поддержка'),
      page('/complaint','Пожаловаться','Локальная форма обращения')
    ]},
    {title:'Типовые страницы каталога',description:'Один пример категории, проекта и профиля; остальные записи открываются из соответствующих списков.',entries:[
      {href:`/pro/${sampleCategory.slug}`,label:`Категория · ${sampleCategory.name}`,description:'Заполненная категорийная выдача с фильтрами',kind:'category'},
      {href:`/projects/${sampleProject.slug}`,label:`Проект · ${sampleProject.title}`,description:'Заполненная карточка проекта и команды',kind:'project'},
      {href:`/profiles/${sampleProfile.slug}`,label:`Профиль · ${sampleProfile.name}`,description:'Заполненный профиль профессионала',kind:'profile'}
    ]},
    {title:'Системные состояния',description:'Экран загрузки, пустого результата, ошибки и отсутствующего маршрута.',entries:[
      page('/demo','Demo hub','Переходы и состояния для презентации'),
      page('/offline','Offline','Локальный offline-сценарий'),
      page('/404','Страница не найдена','Доступный preview системного состояния'),
      page('/error','Ошибка','Доступный preview состояния ошибки')
    ].map(entry=>({...entry,kind:'system' as const}))}
  ];
};

export const siteMapEntryCount=(collections:Collection[]=initialCollections)=>buildSiteMap(collections).reduce((total,section)=>total+section.entries.length,0);
