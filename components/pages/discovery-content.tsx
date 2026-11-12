'use client';

import Link from 'next/link';
import {LucideArrowRight,LucideBell,LucideBookmark,LucideCalendarPlus,LucideHeart,LucideUserPlus} from '@/components/icons/lucide';

type ResourceKind='blog'|'faq'|'knowledge'|'video-lessons'|'webinars'|'api'|'complaint';

const content:Record<ResourceKind,{title:string;intro:string;steps:[string,string,string];next:[string,string]}>= {
  blog:{title:'Попробуйте идею на реальном сценарии',intro:'Каждый материал продолжает путь в продукте: сначала визуал, затем авторы и понятное действие.',steps:['Откройте проект, который нравится визуально','Перейдите к специалисту через credits','Сохраните проект или отправьте локальную заявку'],next:['Открыть ленту','/feed']},
  faq:{title:'Быстрый путь к ответу',intro:'Если вопрос появляется в процессе выбора, не нужно начинать сначала: вернитесь к проекту, профессионалу или каталогу по одному действию.',steps:['Посмотрите, что именно понравилось в проекте','Откройте автора через состав команды','Сохраните специалиста или запросите запись'],next:['Вернуться к ленте','/feed']},
  knowledge:{title:'Шпаргалка для первого выбора',intro:'Не нужно собирать десятки вкладок. Chereda связывает изображение, людей, условия и следующий шаг в одном месте.',steps:['Смотрите общие проекты, а не отдельные картинки','Откройте участника, который сделал нужную часть работы','Сравните цену, город, услуги и отзывы'],next:['Найти специалиста','/pro']},
  'video-lessons':{title:'Практика вместо просмотра',intro:'Уроки устроены как короткие действия в интерфейсе: открыли кейс, нашли автора, добавили в свою подборку.',steps:['Выберите кадр, который хочется повторить','Нажмите на автора в команде проекта','Выберите услугу или сохраните проект в коллекцию'],next:['Открыть проект недели','/projects/white-garden-wedding']},
  webinars:{title:'Разберите свой сценарий за один вечер',intro:'Вебинарный формат показывает не теорию, а последовательность решений: визуал, проект, команда, площадка и контакт.',steps:['Определите стиль и формат события','Сравните двух кандидатов по реальным карточкам','Сохраните shortlist и вернитесь к нему позже'],next:['Собрать shortlist','/collections']},
  api:{title:'Что можно будет подключить',intro:'Сначала Chereda даёт понятный локальный выбор. Затем тот же brief и подборку можно будет передать в рабочие системы.',steps:['Соберите структуру задачи из проекта','Добавьте команду и площадку в shortlist','Подготовьте brief для согласования'],next:['Создать brief','/brief']},
  complaint:{title:'Что произойдёт после обращения',intro:'В demo обращение остаётся в браузере. Экран показывает будущий понятный маршрут поддержки без потери контекста.',steps:['Укажите раздел и коротко опишите ситуацию','Сохраните обращение локально','Вернитесь к сценарию через справочный центр'],next:['Открыть справочный центр','/support']}
};

export function DiscoveryGuide({kind}:{kind:ResourceKind}){
  const item=content[kind];
  return <>
    <section className="section discovery-guide">
      <div className="section-head"><div><div className="eyebrow">Как использовать Chereda</div><h2>{item.title}</h2></div><span className="meta">3 простых шага</span></div>
      <p className="lede">{item.intro}</p>
      <div className="grid discovery-step-grid">{item.steps.map((step,index)=><article className="card card-body discovery-step" key={step}><span className="discovery-step-icon">{index===0?<LucideHeart size={19}/>:index===1?<LucideUserPlus size={19}/>:<LucideBookmark size={19}/>}</span><span className="eyebrow">Шаг {index+1}</span><h3>{step}</h3></article>)}</div>
    </section>
    <section className="card card-body discovery-action-card"><div><div className="eyebrow">Следующий шаг</div><h2>Продолжите в своём темпе</h2><p>Сохранения, подписки и заявки остаются локально в demo, поэтому к интересному можно вернуться без лишних решений.</p></div><div className="row wrap"><Link className="button primary" href={item.next[1]}>{item.next[0]} <LucideArrowRight size={16}/></Link><Link className="button" href="/subscriptions"><LucideBell size={16}/> Мои подписки</Link><Link className="button" href="/recommendations"><LucideCalendarPlus size={16}/> Подборка для вас</Link></div></section>
  </>;
}
