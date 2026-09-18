import {categories} from './catalog';
import {initialCollections,profiles,projects} from './seed';
import type {Collection} from '@/types/domain';

export type SiteMapEntry={href:string;label:string;description:string;kind?:'page'|'category'|'profile'|'project'|'collection'|'system'};
export type SiteMapSection={title:string;description:string;entries:SiteMapEntry[]};

const page=(href:string,label:string,description:string):SiteMapEntry=>({href,label,description,kind:'page'});

export const buildSiteMap=(collections:Collection[]=initialCollections):SiteMapSection[]=>[
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
    page('/collections','Коллекции','Все подборки Viewer'),
    ...collections.map(collection=>({href:`/collections/${collection.slug}`,label:collection.name,description:`${collection.projectIds.length} проектов в подборке`,kind:'collection' as const})),
    page('/notifications','Уведомления','Локальные события и обновления'),
    page('/settings','Настройки','Тема, город и интересы'),
    page('/settings?tab=sitemap','Карта сайта','Полный список доступных экранов')
  ]},
  {title:'Профессиональный контур',description:'Локальные demo-сценарии для профессионалов и рекомендаций.',entries:[
    page('/register','Регистрация / onboarding','Выбор сценария Viewer или профессионала'),
    page('/professional','Профиль профессионала','Demo-конструктор и preview'),
    page('/recommendations','Рекомендации','Объяснимые подборки'),
    page('/subscriptions','Подписки','Подписки на профессионалов'),
    page('/favorites-pro','Избранные PRO','Сохранённые профессионалы')
  ]},
  {title:'Информационные разделы',description:'Материалы продукта и справка.',entries:[
    page('/platform','Возможности платформы','Возможности Chereda'),
    page('/blog','Блог','Материалы о событиях'),
    page('/faq','Вопросы и ответы','Частые вопросы'),
    page('/knowledge','База знаний','Справочные материалы'),
    page('/video-lessons','Видеоуроки','Обучающие сценарии'),
    page('/webinars','Вебинары','Демо-вебинары'),
    page('/api','Экспорт и API','Описание локального demo API'),
    page('/support','Справочный центр','Поддержка'),
    page('/complaint','Пожаловаться','Локальная форма обращения')
  ]},
  {title:'Категории PRO',description:'Каждая категория ведёт на собственную выдачу и набор фильтров.',entries:categories.map(category=>({href:`/pro/${category.slug}`,label:category.name,description:`${category.subcategories.length} подкатегорий · фильтры из каталога`,kind:'category' as const}))},
  {title:'Проекты и кейсы',description:'Все demo-проекты, связанные с командами и профилями.',entries:projects.map(project=>({href:`/projects/${project.slug}`,label:project.title,description:`${project.eventType} · ${project.city}`,kind:'project' as const}))},
  {title:'Профили профессионалов',description:'Все профили из детерминированного demo-seed.',entries:profiles.map(profile=>({href:`/profiles/${profile.slug}`,label:profile.name,description:`${profile.specialty} · ${profile.city}`,kind:'profile' as const}))},
  {title:'Системные состояния',description:'Экран загрузки, пустого результата, ошибки и отсутствующего маршрута.',entries:[
    page('/demo','Demo hub','Переходы и состояния для презентации'),
    page('/offline','Offline','Локальный offline-сценарий'),
    page('/404','Страница не найдена','Доступный preview системного состояния'),
    page('/error','Ошибка','Доступный preview состояния ошибки')
  ].map(entry=>({...entry,kind:'system' as const}))}
];

export const siteMapEntryCount=(collections:Collection[]=initialCollections)=>buildSiteMap(collections).reduce((total,section)=>total+section.entries.length,0);