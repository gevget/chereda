const returnOrigin='https://chereda.local';

export function safeReturnTo(value:string|null,fallback:string){
  if(!value||!value.startsWith('/')||value.startsWith('//')||value.includes('\\'))return fallback;
  try{
    const destination=new URL(value,returnOrigin);
    if(destination.origin!==returnOrigin)return fallback;
    return `${destination.pathname}${destination.search}${destination.hash}`;
  }catch{
    return fallback;
  }
}

export function withReturnTo(href:string,returnTo?:string){
  const safe=safeReturnTo(returnTo??null,'');
  if(!safe)return href;
  const destination=new URL(href,returnOrigin);
  destination.searchParams.set('returnTo',safe);
  return `${destination.pathname}${destination.search}${destination.hash}`;
}

export function returnContextLabel(href:string){
  const path=new URL(href,returnOrigin).pathname;
  if(path==='/feed')return 'Лента';
  if(path==='/search')return 'Поиск';
  if(path==='/events'||path.startsWith('/events/'))return path==='/events'?'Афиша':'Событие';
  if(path==='/pro'||path.startsWith('/pro/'))return 'PRO';
  if(path==='/ratings')return 'Рейтинг';
  if(path==='/favorites')return 'Избранное';
  if(path==='/favorites-pro')return 'Избранные PRO';
  if(path==='/subscriptions')return 'Подписки';
  if(path.startsWith('/projects/'))return 'Проект';
  if(path.startsWith('/profiles/'))return 'Профиль';
  if(path==='/collections'||path.startsWith('/collections/'))return 'Коллекция';
  return 'Назад';
}
