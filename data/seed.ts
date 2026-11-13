import type {Profile,Project,Credit,Media,Service,Review,RatingEntry,Collection,Notice,Price} from '@/types/domain';
import {cities,categories} from './catalog';

type HeroRow=[string,string,Profile['type'],string,string,string,number,string];
const heroRows:HeroRow[]=[
 ['anna-mironova-photo','Анна Миронова','person','photo-video','Фотограф','moscow',85000,'съёмка'],
 ['ilya-levin-film','Илья Левин','person','photo-video','Видеограф','moscow',110000,'проект'],
 ['elena-sokolova-hair','Елена Соколова','person','beauty','Стилист по волосам','moscow',12000,'образ'],
 ['alisa-tumanova-makeup','Алиса Туманова','person','beauty','Визажист','moscow',14000,'образ'],
 ['maya-ershova-nails','Майя Ершова','person','beauty','Ногтевой сервис','moscow',6500,'услуга'],
 ['maksim-orlov-host','Максим Орлов','person','hosts','Ведущий','moscow',140000,'событие'],
 ['daria-volkova-producer','Дарья Волкова','person','event-agencies','Event-продюсер','saint-petersburg',180000,'проект'],
 ['timur-sadykov-host','Тимур Садыков','person','hosts','Деловой ведущий','astana',900000,'событие'],
 ['leila-karim-style','Лейла Карим','person','fashion','Стилист образа','dubai',2800,'образ'],
 ['bureau-krug','Бюро «Круг»','company','event-agencies','Event-агентство','moscow',450000,'проект'],
 ['forma-flora','Forma Flora','company','decor','Декор и флористика','moscow',280000,'проект'],
 ['smena-light','Smena Light','company','technical-production','Свет','saint-petersburg',190000,'смена'],
 ['pulse-sound','Pulse Sound','company','technical-production','Звук','kazan',120000,'смена'],
 ['atlas-catering','Atlas Catering','company','catering','Кейтеринг','moscow',6500,'человек'],
 ['kadr-lab','Kadr Lab','team','photo-video','Фото и видео','yekaterinburg',160000,'проект'],
 ['loft-bereg','Лофт «Берег»','venue','venues','Площадка','moscow',320000,'событие'],
 ['sever-hall','Sever Hall','venue','venues','Площадка','saint-petersburg',260000,'событие'],
 ['volga-stage','Volga Stage','company','technical-production','Сцена и экраны','volgograd',150000,'смена']
];
const projectRows:[string,string,string,string,string[]][]=[
 ['white-garden-wedding','Белый сад','свадьба','moscow',['botanical','minimal','editorial']],
 ['neon-garden-launch','Neon Garden','презентация бренда','moscow',['neon','futuristic']],
 ['quiet-shore-dinner','Тихий берег','частный ужин','saint-petersburg',['камерный','romantic']],
 ['city-pulse-forum','Пульс города','форум','kazan',['деловой','современный']],
 ['assembly-point-team','Точка сборки','тимбилдинг','yekaterinburg',['industrial','interactive']],
 ['northern-light-awards','Northern Light','премия','saint-petersburg',['cinematic','luxury']],
 ['desert-bloom-dinner','Desert Bloom','частное событие','dubai',['botanical','luxury']],
 ['new-classic-wedding','Новая классика','свадьба','nizhny-novgorod',['classic','editorial']],
 ['signal-music-night','Signal','концерт','volgograd',['festival','neon']],
 ['paper-moon-kids','Бумажная луна','детское событие','astana',['family','immersive']]
];
const extraTitles=['Линии света','Сад в городе','Открытая сцена','Ритм пространства','Первый план','Северный маршрут','Новая форма','После заката','Тихий разговор','Встреча у воды','Смена масштаба','Параллель','Зелёный контур','Тепло города','Точка света','Лёгкий воздух','Большой день','Город говорит','Грани сезона','Новый кадр'];
for(let i=0;i<extraTitles.length;i++) projectRows.push([`project-${i+11}`,extraTitles[i],['свадьба','корпоратив','презентация бренда','форум','частный ужин'][i%5],cities[i%cities.length].slug,[['editorial','botanical'],['industrial','современный'],['камерный','classic']][i%3]]);
const p=(n:number,unit:string,currency:Price['currency']='RUB'):Price=>({kind:'from',from:n,currency,unit});
// Local stock pool for the demo. Files are downloaded from Unsplash and kept in
// public/media/stock so the core experience never depends on a remote image URL.
const assetBasePath=process.env.NEXT_PUBLIC_BASE_PATH??'';
const assetPath=(path:string)=>`${assetBasePath}${path}`;
const stockAvatarPool=[1,2,3,4,5,6,7,8].map(n=>assetPath(`/media/stock/avatar-${String(n).padStart(2,'0')}.webp`));
const stockCoverPool=[1,2,3,4,5,6,7,8,9,10,11,12].map(n=>assetPath(`/media/stock/cover-${String(n).padStart(2,'0')}.webp`));
const stockProjectPool=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map(n=>assetPath(`/media/stock/project-${String(n).padStart(2,'0')}.webp`));
const createDemoAvatar=(name:string,index:number)=>{
 const initials=name.match(/[\p{L}\p{N}]+/gu)?.slice(0,2).map(part=>part[0]).join('').toLocaleUpperCase('ru-RU')||'CH';
 const accentX=42+((index*47)%236);
 const accentY=42+((index*71)%236);
 const accentRadius=18+((index*13)%34);
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320"><rect width="320" height="320" rx="160" fill="#f1eee9"/><circle cx="${accentX}" cy="${accentY}" r="${accentRadius}" fill="#e63462" opacity=".12"/><path d="M42 278c28-36 56-54 84-54s56 18 84 54" fill="none" stroke="#3c1642" stroke-opacity=".14" stroke-width="2"/><text x="160" y="174" text-anchor="middle" dominant-baseline="middle" fill="#3c1642" font-family="Roboto Flex,Arial,sans-serif" font-size="82" font-weight="560">${initials}</text></svg>`;
 return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};
// Prefer distinct, event-relevant existing photos for project covers. The
// remaining frames use project-specific local illustrations so projects never
// borrow the same photograph or depend on a remote image service.
const projectMediaSets:Record<string,number[]>={
 'свадьба':[1,2,3,4,13,14,16,10],
 'презентация бренда':[5,6,7,9,11,12,15,8],
 'частный ужин':[1,3,4,13,14,16,10,2],
 'форум':[5,8,9,11,15,6,10,12],
 'тимбилдинг':[5,8,9,10,11,15,6,3],
 'премия':[4,5,6,7,8,11,12,15],
 'частное событие':[1,2,3,4,10,13,14,16],
 'концерт':[6,7,8,11,12,15,5,9],
 'детское событие':[1,2,3,13,14,16,10,4],
 'корпоратив':[5,8,9,10,11,15,6,3]
};
const usedProjectPhotos=new Set<number>();
const surnameStems=['Лазарев','Комаров','Беляев','Назаров','Сергеев','Федоров','Крылов','Захаров','Макаров','Громов','Сафин','Егоров','Орлов','Титов','Гусев','Елисеев','Котов','Романов'];
const names=['Нина','Павел','Вера','Артём','Юлия','Денис','Мария','Олег','Ксения','Михаил','Алина','Кирилл','Татьяна','Роман','Ева','Лев','Полина','Игорь'];
export const profiles:Profile[]=heroRows.map(([slug,name,type,category,specialty,city,amount,unit],i)=>({id:slug,slug,name,type,category,subcategory:slug==='loft-bereg'?'Свадебные':slug==='sever-hall'?'Бизнес-площадки':slug==='elena-sokolova-hair'?'Стилисты по волосам':categories.find(c=>c.slug===category)!.subcategories[0],specialty,city,travel:type==='venue'?'local':slug==='elena-sokolova-hair'?'nearby':i%4===0?'countrywide':'local',price:slug==='sever-hall'?{kind:'request',currency:'RUB',unit}:slug==='daria-volkova-producer'?{kind:'range',from:180000,to:280000,currency:'RUB',unit}:p(amount,unit,city==='astana'?'KZT':city==='dubai'?'AED':'RUB'),bio:`${name} — ${specialty.toLowerCase()} для событий с продуманной эстетикой. В demo показаны услуги, условия работы и участие в общих проектах.`,styles:['editorial','botanical','современный'],verified:i%5!==2,rating:4.3+(i%7)*0.1,score:72000+i*1173,rank:i+1,capacity:slug==='loft-bereg'?150:slug==='sever-hall'?220:undefined,outsideCatering:type==='venue'?true:undefined,parkingSpaces:type==='venue'?(slug==='loft-bereg'?48:120):undefined,equipment:type==='venue'?['свет','звук','мебель','Wi‑Fi']:undefined,kitchen:type==='venue'?(slug==='loft-bereg'?'prep':'own'):undefined,accessibility:type==='venue'?['безбарьерный вход','лифт','санузел']:undefined,outdoor:type==='venue',accommodation:slug==='loft-bereg',venueType:type==='venue'?(slug==='loft-bereg'?'Лофт':'Бизнес-площадка'):undefined,catalogTags:type==='venue'?['Установка авто','Служебный вход','звуковое оборудование (да или нет)','Световое оборудование (да или нет)','Проекторы и экраны ( да или нет)']:['Есть фото','Есть Отзывы','Есть записи в портфолио'],projectIds:[],serviceIds:[],avatar:i<stockAvatarPool.length?stockAvatarPool[i]:createDemoAvatar(name,i),cover:i<stockCoverPool.length?stockCoverPool[i]:assetPath(`/media/covers/cover-${String(i+1).padStart(2,'0')}.svg`)}));
for(let i=18;i<72;i++){const cat=categories[(i-18)%categories.length];const stem=surnameStems[(i*7+Math.floor((i-18)/18))%18];const name=`${names[i%18]} ${stem}${i%2===0?'а':''}`;const subcategory=cat.subcategories.length?cat.subcategories[i%cat.subcategories.length]:cat.name;profiles.push({id:`profile-${i+1}`,slug:`profile-${i+1}`,name,type:'person',category:cat.slug,subcategory,specialty:subcategory,city:cities[i%cities.length].slug,travel:i%3===0?'countrywide':i%3===1?'nearby':'local',price:p(9000+(i%13)*14000,'проект'),bio:`${name} работает с событиями в категории «${cat.name}». В профиле собраны услуги, проекты и прозрачные условия выезда.`,styles:['современный',i%2?'editorial':'classic'],catalogTags:['Есть фото','Есть Отзывы','Есть записи в портфолио'],verified:i%3!==0,rating:4.3+(i%7)*0.1,score:65000+i*317,rank:i+1,projectIds:[],serviceIds:[],avatar:createDemoAvatar(name,i),cover:assetPath(`/media/covers/cover-${String(i+1).padStart(2,'0')}.svg`)});}
export const services:Service[]=profiles.flatMap((profile,i)=>[0,1,2].map((j)=>({id:`service-${i+1}-${j+1}`,profileId:profile.id,name:profile.slug==='elena-sokolova-hair'?['Укладка + проба','Свадебная укладка','Сопровождение образа'][j]:profile.slug==='loft-bereg'?['Аренда суббота','Аренда буднего дня','Терраса и зал'][j]:[`${profile.specialty}: основной пакет`,`${profile.specialty}: расширенный пакет`,`${profile.specialty}: консультация`][j],description:j===0?'Подготовка, работа в день события и согласованные материалы.':'Состав услуги и доступность уточняются в локальной demo-заявке.',price:profile.slug==='elena-sokolova-hair'&&j===0?{kind:'fixed',from:18000,currency:'RUB',unit:'образ'}:profile.slug==='atlas-catering'&&j===0?{kind:'range',from:6500,to:12000,currency:'RUB',unit:'человек'}:profile.slug==='pulse-sound'&&j===0?{kind:'request',currency:'RUB',unit:'смена'}:profile.price})));
for(const profile of profiles) profile.serviceIds=services.filter(s=>s.profileId===profile.id).map(s=>s.id);
const whiteCredits:[string,string,string][]=[
 ['bureau-krug','Организация','концепция, бюджет и координация'],['loft-bereg','Площадка','зал, терраса и сервисные зоны'],['forma-flora','Декор и флористика','церемония, столы и навигация'],['anna-mironova-photo','Фотограф','репортаж и editorial-серия'],['ilya-levin-film','Видеограф','highlight film и церемония'],['elena-sokolova-hair','Укладка','пробный и свадебный образ'],['alisa-tumanova-makeup','Макияж','образ и touch-up'],['maya-ershova-nails','Ногтевой сервис','подготовка за день до события'],['maksim-orlov-host','Ведущий','церемония и вечерняя программа'],['atlas-catering','Кейтеринг','welcome, ужин и late snack']
];
export const projects:Project[]=[];export const credits:Credit[]=[];export const media:Media[]=[];
projectRows.forEach(([slug,title,eventType,city,styles],i)=>{
 const localPool=profiles.filter(p=>p.city===city);
 const selected=i===0?whiteCredits: Array.from({length:Math.min(7,localPool.length)},(_,j)=>{const profile=localPool[(i+j)%localPool.length];return [profile.id,profile.specialty,`работа по направлению «${profile.specialty.toLowerCase()}» в проекте «${title}»`] as [string,string,string]});
 const unique=selected.filter((row,j)=>selected.findIndex(v=>v[0]===row[0])===j);
 const pcredits=unique.map(([profileId,roleLabel,contribution],j):Credit=>({id:`credit-${i+1}-${j+1}`,projectId:slug,profileId,roleLabel,contribution,categoryId:profiles.find(p=>p.id===profileId)!.category,serviceIds:[profiles.find(p=>p.id===profileId)!.serviceIds[0]],isLead:j===0,creditOrder:j+1,confirmed:true}));
 credits.push(...pcredits);
 const mediaSet=projectMediaSets[eventType]??projectMediaSets['частное событие'];
 const photo=mediaSet.find(n=>!usedProjectPhotos.has(n));
 if(photo)usedProjectPhotos.add(photo);
 const pmedia=Array.from({length:8},(_,j):Media=>({id:`media-${i+1}-${j+1}`,projectId:slug,src:j===0&&photo?stockProjectPool[photo-1]:assetPath(`/media/projects/project-${String(i+1).padStart(2,'0')}-${String(j+1).padStart(2,'0')}.svg`),alt:`Демонстрационный визуал проекта «${title}», кадр ${j+1}: ${j===0?'пространство события':'авторская иллюстрация Chereda'}`,caption:['Общий план','Детали пространства','Подготовка','Встреча гостей','Атмосфера вечера','Команда в работе','Детали сервировки','Финальный свет'][j],isDemoContent:true}));
 media.push(...pmedia);
 projects.push({id:slug,slug,title,description:i===0?'Камерная городская свадьба на 86 гостей. Светлая ботаническая сценография, длинный общий стол, утренняя подготовка и вечерняя музыкальная программа. Каждый участник связан с единым проектом.':`${title} — демонстрационный ${eventType} в городе ${cities.find(c=>c.slug===city)?.name}. Пространство, команда и детали собраны в одном проекте.`,eventType,city,date:`2026-${String(i%9+1).padStart(2,'0')}-18`,styles,tags:[eventType,...styles],mediaIds:pmedia.map(m=>m.id),creditIds:pcredits.map(c=>c.id),leadProfileId:pcredits[0].profileId,reactions:83+i*17,saves:24+i*9,isDemoContent:true});
});
// Each profile is connected to at least three existing projects without inventing a second entity.
profiles.forEach(profile=>{profile.projectIds=[...new Set(credits.filter(c=>c.profileId===profile.id).map(c=>c.projectId))];});
profiles.forEach((profile,i)=>{while(profile.projectIds.length<3){const localProjects=projects.filter(p=>p.city===profile.city&&p.id!=='white-garden-wedding');let target=localProjects[(i+profile.projectIds.length)%localProjects.length];if(profile.projectIds.includes(target.id))target=localProjects.find(p=>!profile.projectIds.includes(p.id))!;
 if(!credits.some(c=>c.projectId===target.id&&c.profileId===profile.id)){const credit:Credit={id:`credit-extra-${i}-${profile.projectIds.length}`,projectId:target.id,profileId:profile.id,roleLabel:profile.specialty,contribution:`участие в направлении «${profile.specialty.toLowerCase()}»`,categoryId:profile.category,serviceIds:[profile.serviceIds[0]],isLead:false,creditOrder:target.creditIds.length+1,confirmed:true};credits.push(credit);target.creditIds.push(credit.id);}profile.projectIds.push(target.id);}});
profiles.forEach(profile=>{profile.projectIds=[...new Set(credits.filter(c=>c.profileId===profile.id).map(c=>c.projectId))];});
const reviewerNames=['Мария К.','Алексей Р.','Полина Б.','Никита С.','Екатерина Л.','София М.','Дмитрий П.'];
const reviewTexts=[
 'Понравилась внимательность к деталям и ясная смета. Подготовка прошла спокойно, а итоговый результат сохранил выбранный стиль.',
 'Сроки и состав услуги обсудили заранее. В день события команда была на связи, результат соответствовал согласованному плану.',
 'Команда предложила два варианта решения и объяснила разницу по бюджету. Это помогло выбрать подходящий формат без спешки.',
 'На подготовке возникла небольшая правка, которую внесли в тот же день. В остальном процесс был последовательным и понятным.',
 'Особенно помогли короткие подтверждения по каждому этапу. На площадке всё было готово к оговорённому времени.',
 'Визуальное решение совпало с референсами, которые обсуждали до проекта. Отдельно отметим аккуратную работу с деталями.',
 'После события получили материалы в согласованный срок. Общение было спокойным, а вопросы решались по делу.'
];
export const reviews:Review[]=profiles.flatMap((profile,i)=>Array.from({length:i<18?7:1},(_,j)=>({id:`review-${i}-${j}`,profileId:profile.id,projectId:profile.projectIds[j%profile.projectIds.length],author:reviewerNames[j],rating:j%3===0?4:5,text:reviewTexts[j],date:`2026-${String(j%7+2).padStart(2,'0')}-12`})));
for(const profile of profiles){const ownReviews=reviews.filter(review=>review.profileId===profile.id);profile.rating=ownReviews.length?Math.round(ownReviews.reduce((sum,review)=>sum+review.rating,0)/ownReviews.length*10)/10:0}
const monthlyRatings:RatingEntry[]=profiles.map((profile,i)=>{const profileReviews=reviews.filter(review=>review.profileId===profile.id);const profileProjects=projects.filter(project=>profile.projectIds.includes(project.id));const profileCredits=credits.filter(credit=>credit.profileId===profile.id);const reviewPoints=profileReviews.length*2000+Math.round(profile.rating*100);const verification=profile.verified?12000:0;const projectPoints=profile.projectIds.length*2200;const activity=profileCredits.filter(credit=>credit.confirmed).length*400+profile.serviceIds.length*200;const engagement=profileProjects.reduce((sum,project)=>sum+project.reactions+project.saves,0)*10;const breakdown={reviews:reviewPoints,verification,projects:projectPoints,activity,engagement};const score=Object.values(breakdown).reduce((a,b)=>a+b,0);profile.score=score;return{id:`rating-month-${i}`,profileId:profile.id,category:profile.category,city:profile.city,period:'month',rank:i+1,movement:(i%9)-4,score,breakdown};});
const yearlyRatings:RatingEntry[]=monthlyRatings.map((entry,i)=>{const profile=profiles.find(item=>item.id===entry.profileId)!;const profileReviews=reviews.filter(review=>review.profileId===profile.id);const profileProjects=projects.filter(project=>profile.projectIds.includes(project.id));const profileCredits=credits.filter(credit=>credit.profileId===profile.id);const breakdown={reviews:entry.breakdown.reviews+profileReviews.length*350,verification:entry.breakdown.verification,projects:entry.breakdown.projects+profile.projectIds.length*300,activity:entry.breakdown.activity+profileCredits.length*80,engagement:entry.breakdown.engagement+profileProjects.reduce((sum,project)=>sum+project.reactions+project.saves,0)*2};const score=Object.values(breakdown).reduce((a,b)=>a+b,0);return{...entry,id:`rating-year-${i}`,period:'year',rank:i+1,movement:entry.movement*2+((i%3)-1),score,breakdown};});
export const ratings:RatingEntry[]=[...monthlyRatings,...yearlyRatings];
export const initialCollections:Collection[]=[['wedding-shortlist','Свадьба — shortlist',8],['moscow-venues','Площадки Москвы',6],['photo-video','Фото и видео',5],['beauty-look','Образ',4],['light-decor','Свет и декор',7]].map(([slug,name,count],i)=>({slug:String(slug),name:String(name),projectIds:projects.slice(i, i+Number(count)).map(p=>p.id)}));
export const initialNotices:Notice[]=Array.from({length:12},(_,i)=>({id:`notice-${i+1}`,title:['Новый проект в вашей подборке','Обновлены условия площадки','Профиль подтверждён','Идея для вашей коллекции'][i%4],body:`Демо-уведомление о проекте «${projects[i].title}».`,href:`/projects/${projects[i].slug}`,date:`2026-09-${String(18-i).padStart(2,'0')}`}));
export const profileBySlug=(slug:string)=>profiles.find(p=>p.slug===slug);
export const projectBySlug=(slug:string)=>projects.find(p=>p.slug===slug);
export const mediaById=(id:string)=>media.find(m=>m.id===id)!;
export const creditsFor=(projectId:string)=>credits.filter(c=>c.projectId===projectId).sort((a,b)=>a.creditOrder-b.creditOrder);
