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
const surnameStems=['Лазарев','Комаров','Беляев','Назаров','Сергеев','Федоров','Крылов','Захаров','Макаров','Громов','Сафин','Егоров','Орлов','Титов','Гусев','Елисеев','Котов','Романов'];
const names=['Нина','Павел','Вера','Артём','Юлия','Денис','Мария','Олег','Ксения','Михаил','Алина','Кирилл','Татьяна','Роман','Ева','Лев','Полина','Игорь'];
export const profiles:Profile[]=heroRows.map(([slug,name,type,category,specialty,city,amount,unit],i)=>({id:slug,slug,name,type,category,subcategory:slug==='loft-bereg'?'Свадебные':slug==='sever-hall'?'Бизнес-площадки':slug==='elena-sokolova-hair'?'Стилисты по волосам':categories.find(c=>c.slug===category)!.subcategories[0],specialty,city,travel:type==='venue'?'local':slug==='elena-sokolova-hair'?'nearby':i%4===0?'countrywide':'local',price:p(amount,unit,city==='astana'?'KZT':city==='dubai'?'AED':'RUB'),bio:`${name} — ${specialty.toLowerCase()} для событий с продуманной эстетикой. В demo показаны услуги, условия работы и участие в общих проектах.`,styles:['editorial','botanical','современный'],verified:i%5!==2,rating:4.3+(i%7)*0.1,score:72000+i*1173,rank:i+1,capacity:slug==='loft-bereg'?150:slug==='sever-hall'?220:undefined,outsideCatering:type==='venue'?true:undefined,projectIds:[],serviceIds:[],avatar:stockAvatarPool[i%stockAvatarPool.length],cover:stockCoverPool[i%stockCoverPool.length]}));
for(let i=18;i<72;i++){const cat=categories[(i-18)%categories.length];const stem=surnameStems[(i*7+Math.floor((i-18)/18))%18];const name=`${names[i%18]} ${stem}${i%2===0?'а':''}`;const subcategory=cat.subcategories[i%cat.subcategories.length];profiles.push({id:`profile-${i+1}`,slug:`profile-${i+1}`,name,type:'person',category:cat.slug,subcategory,specialty:subcategory,city:cities[i%cities.length].slug,travel:i%3===0?'countrywide':i%3===1?'nearby':'local',price:p(9000+(i%13)*14000,'проект'),bio:`${name} работает с событиями в категории «${cat.name}». В профиле собраны услуги, проекты и прозрачные условия выезда.`,styles:['современный',i%2?'editorial':'classic'],verified:i%3!==0,rating:4.3+(i%7)*0.1,score:65000+i*317,rank:i+1,projectIds:[],serviceIds:[],avatar:stockAvatarPool[i%stockAvatarPool.length],cover:stockCoverPool[i%stockCoverPool.length]});}
export const services:Service[]=profiles.flatMap((profile,i)=>[0,1,2].map((j)=>({id:`service-${i+1}-${j+1}`,profileId:profile.id,name:profile.slug==='elena-sokolova-hair'?['Укладка + проба','Свадебная укладка','Сопровождение образа'][j]:profile.slug==='loft-bereg'?['Аренда суббота','Аренда буднего дня','Терраса и зал'][j]:[`${profile.specialty}: основной пакет`,`${profile.specialty}: расширенный пакет`,`${profile.specialty}: консультация`][j],description:j===0?'Подготовка, работа в день события и согласованные материалы.':'Состав услуги и доступность уточняются в локальной demo-заявке.',price:profile.slug==='elena-sokolova-hair'&&j===0?{kind:'fixed',from:18000,currency:'RUB',unit:'образ'}:profile.price})));
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
 const pmedia=Array.from({length:8},(_,j):Media=>({id:`media-${i+1}-${j+1}`,projectId:slug,src:stockProjectPool[(i*5+j*3)%stockProjectPool.length],alt:`Демонстрационная композиция проекта «${title}», кадр ${j+1}: пространство и детали события`,caption:['Общий план','Детали пространства','Подготовка','Встреча гостей','Атмосфера вечера','Команда в работе','Детали сервировки','Финальный свет'][j],isDemoContent:true}));
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
export const ratings:RatingEntry[]=profiles.map((profile,i)=>{const breakdown={reviews:25000+(i%13)*500,verification:profile.verified?14000:7000,projects:22000+(i%9)*700,activity:10000+(i%7)*400,engagement:5000+(i%5)*300};const score=Object.values(breakdown).reduce((a,b)=>a+b,0);profile.score=score;return{id:`rating-${i}`,profileId:profile.id,category:profile.category,city:profile.city,period:'month',rank:i+1,movement:(i%9)-4,score,breakdown};});
export const initialCollections:Collection[]=[['wedding-shortlist','Свадьба — shortlist',8],['moscow-venues','Площадки Москвы',6],['photo-video','Фото и видео',5],['beauty-look','Образ',4],['light-decor','Свет и декор',7]].map(([slug,name,count],i)=>({slug:String(slug),name:String(name),projectIds:projects.slice(i, i+Number(count)).map(p=>p.id)}));
export const initialNotices:Notice[]=Array.from({length:12},(_,i)=>({id:`notice-${i+1}`,title:['Новый проект в вашей подборке','Обновлены условия площадки','Профиль подтверждён','Идея для вашей коллекции'][i%4],body:`Демо-уведомление о проекте «${projects[i].title}».`,href:`/projects/${projects[i].slug}`,date:`2026-09-${String(18-i).padStart(2,'0')}`}));
export const profileBySlug=(slug:string)=>profiles.find(p=>p.slug===slug);
export const projectBySlug=(slug:string)=>projects.find(p=>p.slug===slug);
export const mediaById=(id:string)=>media.find(m=>m.id===id)!;
export const creditsFor=(projectId:string)=>credits.filter(c=>c.projectId===projectId).sort((a,b)=>a.creditOrder-b.creditOrder);
