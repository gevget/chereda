import type {Profile} from '@/types/domain';

export type MarketContext={market:'RU'|'EU';currency:'RUB'|'EUR';language:'ru'|'en'};
export type BriefSeed={eventType:string;styleTags:string[];palette:string[];roleHints:string[];reasons:string[]};
export type MatchResult={profileId:string;score:number;reasons:string[];sharedProjectCount:number};

export const visualBriefSeed:BriefSeed={
  eventType:'свадьба',
  styleTags:['botanical','minimal','editorial'],
  palette:['молочный','зелёный','тёплое дерево'],
  roleHints:['Площадка','Организация','Декор и флористика','Фотограф','Видеограф','Beauty','Кейтеринг'],
  reasons:['Мягкий естественный свет → фотографы с editorial-стилем','Длинный общий стол → площадка с банкетной рассадкой','Ботанические композиции → декор и флористика']
};

export const teamMatch=(profile:Profile,source:Profile[]):MatchResult=>{
  const shared=new Set(source.flatMap(item=>item.projectIds.filter(id=>profile.projectIds.includes(id)))).size;
  const style=source.some(item=>item.styles.some(value=>profile.styles.includes(value)));
  const city=source.some(item=>item.city===profile.city)||profile.travel==='countrywide';
  const trust=profile.verified;
  const score=Math.min(97,42+shared*8+(style?18:0)+(city?16:0)+(trust?9:0));
  return {profileId:profile.id,score,sharedProjectCount:shared,reasons:[shared?`${shared} общих проекта в credits`:'Дополняет роли текущей команды',style?'Совпадает визуальный стиль':'Добавляет новое направление',city?'Подходит по городу или выезду':'Нужно уточнить выезд',trust?'Профиль подтверждён в demo':'Credit требует уточнения']};
};

export const venueFit=(profile:Profile)=>{
  const capacity=profile.capacity??0;
  const score=Math.min(96,52+(capacity>=80?16:0)+(profile.outsideCatering?8:0)+(profile.equipment?.length??0)*3+(profile.parkingSpaces?7:0));
  return {score,status:score>=82?'Подходит':score>=65?'Требует уточнения':'Не подходит',matched:[capacity>=80?'Вместимость для 80–150 гостей':'Камерный формат',profile.outsideCatering?'Разрешён сторонний кейтеринг':'Собственная кухня',(profile.equipment?.length??0)>2?'Есть базовое оснащение':'Технику нужно уточнить'],warnings:[capacity>150?'Нужно уточнить вместимость выбранного зала':'Схема рассадки подтверждается отдельно','Доступность даты — demo']};
};

export const radarRows=(city:string,period:string)=>{
  const shift=(city.length*7+period.length*3)%13;
  return [['Площадки',72+shift,'Нужны данные по доступности'],['Фото и видео',61+shift,'Высокая связность credits'],['Декор',49+shift,'Спрос на editorial и botanical'],['Кейтеринг',35+shift,'Категория требует наполнения']] as [string,number,string][];
};

export const partnerHub={id:'studio-chereda',slug:'studio-chereda',name:'Studio Chereda / Moscow',ownerProfileId:'bureau-krug',memberProfileIds:['bureau-krug','forma-flora','anna-mironova-photo','ilya-levin-film','loft-bereg','atlas-catering'],projectIds:['white-garden-wedding','neon-garden-launch','project-11'],cities:['moscow','saint-petersburg']};
