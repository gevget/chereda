'use client';

import Link from 'next/link';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useMemo, useState, type FormEvent} from 'react';
import {ArrowRight, BookmarkSimple, CalendarBlank, CaretDown, CaretUp, Heart, MapPin, ShareNetwork, Users} from '@phosphor-icons/react';
import {events, type CheredaEvent, type EventSession} from '@/data/events';
import {mediaById, profiles, projects} from '@/data/seed';
import {cityName} from '@/data/catalog';
import {useApp} from '@/components/navigation/app-shell';
import {DateRangeCalendar} from '@/components/events/date-range-calendar';
import {EventReviews} from '@/components/events/event-reviews';
import {eventCategories} from '@/data/event-categories';
import {returnContextLabel,safeReturnTo,withReturnTo} from '@/components/navigation/return-context';

const savedKey='chereda-saved-events-v1';
const registrationsKey='chereda-event-registrations-v1';
const createdEventsKey='chereda-created-events-v1';
const categorySlug=(name:string)=>eventCategories.find(item=>item.name===name)?.slug??name.toLocaleLowerCase('ru-RU').replaceAll(' ','-');
const dateValue=(value:string)=>new Date(`${value}T12:00:00`).getTime();
function dateWindow(period:string,now=new Date()){
  const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  if(period==='today')return {start:today,end:new Date(today.getFullYear(),today.getMonth(),today.getDate()+1)};
  const mondayOffset=(today.getDay()+6)%7;
  const monday=new Date(today.getFullYear(),today.getMonth(),today.getDate()-mondayOffset);
  if(period==='week')return {start:monday,end:new Date(monday.getFullYear(),monday.getMonth(),monday.getDate()+7)};
  if(period==='weekend'){
    const saturday=new Date(monday.getFullYear(),monday.getMonth(),monday.getDate()+5+(today.getDay()===0?-7:0));
    return {start:saturday,end:new Date(saturday.getFullYear(),saturday.getMonth(),saturday.getDate()+2)};
  }
  return null;
}
function isInPeriod(dateISO:string,period:string){
  const window=dateWindow(period);
  if(!window)return true;
  const date=dateValue(dateISO);
  return date>=window.start.getTime()&&date<window.end.getTime();
}
function readStoredIds(key:string){
  try{const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value.filter((item):item is string=>typeof item==='string'):[]}catch{return []}
}
function readAllEvents(){
  try{const local=JSON.parse(localStorage.getItem(createdEventsKey)||'[]');return [...events,...(Array.isArray(local)?local.filter((item):item is CheredaEvent=>Boolean(item&&typeof item.slug==='string'&&Array.isArray(item.sessions))):[])]}catch{return events}
}
function matchesRange(dateISO:string,start:string,end:string){return (!start||dateISO>=start)&&(!end||dateISO<=end)}
function readSavedEvents(){
  try{const value=JSON.parse(localStorage.getItem(savedKey)||'[]');if(!Array.isArray(value))return {ids:[] as string[],error:'Список сохранённых событий повреждён.'};return {ids:value.filter((item):item is string=>typeof item==='string'),error:''}}catch{return {ids:[] as string[],error:'Браузер не разрешил прочитать сохранённые события.'}}
}
type SavedRegistration={eventId:string;sessionId:string;name:string;email:string;phone?:string;registeredAt?:string};
function readRegistrations(){
  try{
    const value=JSON.parse(localStorage.getItem(registrationsKey)||'[]');
    if(!Array.isArray(value))return {items:[] as SavedRegistration[],error:'Список регистраций повреждён. Новые записи можно создать со страницы события.'};
    return {items:value.filter((item):item is SavedRegistration=>Boolean(item&&typeof item==='object'&&typeof item.eventId==='string'&&typeof item.sessionId==='string'&&typeof item.name==='string'&&typeof item.email==='string')),error:''};
  }catch{return {items:[] as SavedRegistration[],error:'Браузер не разрешил прочитать сохранённые регистрации.'}}
}

function EventActions({event,onSavedChange,compact=false}:{event:CheredaEvent;onSavedChange?:(saved:boolean)=>void;compact?:boolean}){
  const app=useApp();
  const [saved,setSaved]=useState(false);
  const liked=app.likes.includes(`event:${event.id}`);
  useEffect(()=>{queueMicrotask(()=>setSaved(readStoredIds(savedKey).includes(event.id)))},[event.id]);
  const toggleSaved=()=>{try{const ids=readStoredIds(savedKey);const next=saved?ids.filter(id=>id!==event.id):[...new Set([...ids,event.id])];localStorage.setItem(savedKey,JSON.stringify(next));setSaved(!saved);onSavedChange?.(!saved);app.toast(saved?'Событие убрано из сохранённого':'Событие сохранено в этом браузере')}catch{app.toast('Браузер не разрешил сохранить событие')}};
  const share=async()=>{const url=`${location.origin}/events/${event.slug}`;try{if(navigator.share)await navigator.share({title:event.title,url});else{await navigator.clipboard.writeText(url);app.toast('Ссылка скопирована')}}catch{try{await navigator.clipboard.writeText(url);app.toast('Ссылка скопирована')}catch{app.toast(url)}}};
  return <div className={`row wrap event-actions${compact?' compact':''}`}><button className={`button ${compact?'event-action-icon':''} ${liked?'selected':''}`} aria-pressed={liked} aria-label={liked?'Убрать отметку «Нравится»':'Нравится'} title={liked?'Убрать отметку «Нравится»':'Нравится'} onClick={()=>app.toggleLike(`event:${event.id}`)}><Heart weight={liked?'fill':'regular'} size={17}/>{!compact&&'Нравится'}</button><button className={`button ${compact?'event-action-icon':''} ${saved?'selected':''}`} aria-pressed={saved} aria-label={saved?'Убрать из сохранённого':'Сохранить'} title={saved?'Убрать из сохранённого':'Сохранить'} onClick={toggleSaved}><BookmarkSimple weight={saved?'fill':'regular'} size={17}/>{!compact&&(saved?'Сохранено':'Сохранить')}</button><button className={`button ${compact?'event-action-icon':''}`} aria-label="Поделиться событием" title="Поделиться" onClick={share}><ShareNetwork size={17}/>{!compact&&'Поделиться'}</button></div>
}

function EventCard({event,onSavedChange,period='',past=false,rangeStart='',rangeEnd='',returnTo}:{event:CheredaEvent;onSavedChange?:(saved:boolean)=>void;period?:string;past?:boolean;rangeStart?:string;rangeEnd?:string;returnTo?:string}){
  const matching=event.sessions.filter(item=>past?item.status==='past':item.status!=='past'&&(rangeStart||rangeEnd?matchesRange(item.dateISO,rangeStart,rangeEnd):period!=='all'&&period!==''?isInPeriod(item.dateISO,period):true));
  const session=(past?matching.sort((a,b)=>dateValue(b.dateISO)-dateValue(a.dateISO)):period?matching.sort((a,b)=>dateValue(a.dateISO)-dateValue(b.dateISO)):matching.filter(item=>item.status==='open').sort((a,b)=>dateValue(a.dateISO)-dateValue(b.dateISO)))[0]??event.sessions[0];
  const project=projects.find(item=>item.slug===event.projectSlug);
  const cover=project?mediaById(project.mediaIds[0])?.src:undefined;
  const organizer=profiles.find(profile=>profile.slug===event.organizerId);
  const eventHref=withReturnTo(`/events/${event.slug}?occurrence=${session.id}`,returnTo);
  return <article className="card event-card"><Link href={eventHref} className="event-cover" style={cover?{backgroundImage:`url('${cover}')`}:undefined} aria-label={`Открыть событие: ${event.title}`}><span className="badge">{event.category}</span></Link><div className="card-body"><div className="eyebrow event-card-date-row"><span className="event-card-date"><CalendarBlank size={15}/>{session.date} · {session.time}</span>{session.status==='full'&&<span className="badge">Мест нет</span>}</div><h3><Link href={eventHref}>{event.title}</Link></h3><p className="event-card-description">{event.description}</p><p>{event.city==='Онлайн'?`Онлайн · ${session.price}`:`${event.city} · ${event.format} · ${session.price}`}</p><div className="row wrap meta"><span className="event-card-attendee"><Users size={15}/>{session.registered} записались</span>{organizer&&<span>· {organizer.name}</span>}</div><EventActions event={event} onSavedChange={onSavedChange} compact/></div></article>
}

function collectionIds(slug:string,list:CheredaEvent[]=events){
  if(slug==='online')return list.filter(event=>event.format==='Онлайн'||event.collection==='Онлайн-события').map(event=>event.id);
  if(slug==='industry')return list.filter(event=>event.tags.includes('Для профессионалов')||event.category==='Бизнес'||event.category==='Образование'||event.collection==='Встречи индустрии').map(event=>event.id);
  if(slug==='inspiration')return list.filter(event=>event.category==='Искусство и культура'||event.collection==='Для вдохновения').map(event=>event.id);
  if(slug==='week')return list.filter(event=>event.sessions.some(session=>session.status!=='past'&&isInPeriod(session.dateISO,'week'))).map(event=>event.id);
  return [];
}

export function EventsPage({initialCategory}:{initialCategory?:string}={}){
  const app=useApp();const params=useSearchParams();const router=useRouter();const pathname=usePathname();
  const [eventsData,setEventsData]=useState<CheredaEvent[]>(events);const [calendarOpen,setCalendarOpen]=useState(false);
  const [categoriesExpanded,setCategoriesExpanded]=useState(()=>Boolean(initialCategory&&eventCategories.slice(0,6).every(item=>item.name!==initialCategory)));
  useEffect(()=>{queueMicrotask(()=>setEventsData(readAllEvents()))},[]);
  const category=params.get('category')||initialCategory||'Все категории';
  const date=params.get('date')||'all';
  const dateStart=params.get('from')||'';const dateEnd=params.get('to')||'';
  const format=params.get('format')||'all';
  const price=params.get('price')||'all';
  const past=params.get('tab')==='past';
  const sort=params.get('sort')||'soonest';
  const collection=params.get('collection')||'';
  const updateUrl=(next:Record<string,string>)=>{const query=new URLSearchParams(params.toString());Object.entries(next).forEach(([key,value])=>value?query.set(key,value):query.delete(key));router.push(`${pathname}${query.size?`?${query}`:''}`,{scroll:false})};
  const categories=Array.from(new Set([...eventCategories.map(item=>item.name),...eventsData.map(event=>event.category)]));
  const rows=useMemo(()=>eventsData.filter(event=>{
    if(category!=='Все категории'&&event.category!==category)return false;
    if(collection&&!collectionIds(collection,eventsData).includes(event.id))return false;
    if(format!=='all'&&event.format!==format)return false;
    if(price==='free'&&!event.sessions.some(session=>session.price==='Бесплатно'))return false;
    const sessions=event.sessions.filter(session=>past?session.status==='past':session.status!=='past');
    if(!sessions.length)return false;
    if((dateStart||dateEnd)&&!sessions.some(session=>matchesRange(session.dateISO,dateStart,dateEnd)))return false;
    if(date!=='all'&&!sessions.some(session=>isInPeriod(session.dateISO,date)))return false;
    const selectedCity=cityName(app.city);
    return event.city===selectedCity||event.city==='Онлайн'||params.get('city')==='all';
  }).sort((a,b)=>{
    if(sort==='popular')return Math.max(...b.sessions.map(session=>session.registered))-Math.max(...a.sessions.map(session=>session.registered));
    const aDate=Math.min(...a.sessions.filter(session=>past?session.status==='past':session.status!=='past').map(session=>dateValue(session.dateISO)));
    const bDate=Math.min(...b.sessions.filter(session=>past?session.status==='past':session.status!=='past').map(session=>dateValue(session.dateISO)));
    return past?bDate-aDate:aDate-bDate;
  }),[eventsData,category,collection,date,dateStart,dateEnd,format,price,past,sort,app.city,params]);
  const setDateFilter=(value:string)=>updateUrl({date:value==='all'?'':value,from:'',to:''});
  const setCustomDateRange=(from:string,to:string)=>updateUrl({date:'',from,to});
  const setFormatFilter=(value:string)=>updateUrl({format:value==='all'?'':value});
  const setPriceFilter=(value:string)=>updateUrl({price:value==='all'?'':value});
  const setSortFilter=(value:string)=>updateUrl({sort:value==='soonest'?'':value});
  const setPastFilter=(value:boolean)=>updateUrl({tab:value?'past':''});
  const reset=()=>{setCalendarOpen(false);router.push('/events')};
  return <div className="container page events-page">
    <div className="eyebrow">Афиша Chereda</div>
    <div className="section-head"><div><h1>{category!=='Все категории'?category:'События'}</h1><p className="lede">Находите встречи, открытия и события индустрии — и знакомьтесь с командами, которые их создают.</p></div><div className="row wrap"><Link className="button" href="/events/saved">Сохранённые</Link><Link className="button" href="/events/registrations">Мои регистрации</Link><Link className="button primary" href="/events/create">Создать событие <ArrowRight size={16}/></Link></div></div>
    <section className="event-controls" aria-label="Фильтры событий"><button className="button" onClick={()=>app.open('city')}><MapPin size={16}/><span>{cityName(app.city)}</span></button><select className="select" aria-label="Категория" value={category} onChange={e=>{const value=e.target.value;if(value==='Все категории'&&initialCategory){router.push('/events')}else updateUrl({category:value==='Все категории'?'':value})}}><option>Все категории</option>{categories.map(value=><option key={value}>{value}</option>)}</select><div className="event-range-control"><button className={`button${dateStart||dateEnd||date!=='all'?' selected':''}`} aria-expanded={calendarOpen} onClick={()=>setCalendarOpen(value=>!value)}><CalendarBlank size={16}/><span>{dateStart?`${dateStart}${dateEnd?` — ${dateEnd}`:''}`:date==='today'?'Сегодня':date==='weekend'?'На выходных':date==='week'?'На этой неделе':'Выбрать период'}</span></button>{calendarOpen&&<div className="event-range-popover"><div className="event-date-presets" aria-label="Быстрый выбор периода">{[['today','Сегодня'],['weekend','На выходных'],['week','На этой неделе']].map(([value,label])=><button key={value} type="button" className={`chip ${date===value?'selected':''}`} onClick={()=>{setDateFilter(value);setCalendarOpen(false)}}>{label}</button>)}</div><DateRangeCalendar start={dateStart} end={dateEnd} onChange={setCustomDateRange}/><div className="row wrap"><button className="button primary" onClick={()=>setCalendarOpen(false)}>Применить</button><button className="button" onClick={()=>{setCustomDateRange('','');setCalendarOpen(false)}}>Сбросить</button></div></div>}</div><select className="select" aria-label="Цена" value={price} onChange={e=>setPriceFilter(e.target.value)}><option value="all">Любая цена</option><option value="free">Бесплатно</option></select><select className="select" aria-label="Формат" value={format} onChange={e=>setFormatFilter(e.target.value)}><option value="all">Любой формат</option><option>Офлайн</option><option>Онлайн</option></select></section>
    <section className="event-collections"><h2>Подборки</h2><div className="event-collection-grid">{[['На этой неделе','week'],['Для вдохновения','inspiration'],['Встречи индустрии','industry'],['Онлайн-события','online']].map(([title,slug])=>{const eventId=collectionIds(slug,eventsData)[0];const collectionEvent=eventsData.find(item=>item.id===eventId)||eventsData[0];const project=collectionEvent?projects.find(item=>item.slug===collectionEvent.projectSlug):undefined;const cover=project?mediaById(project.mediaIds[0])?.src:undefined;return <Link key={slug} className="card event-collection" href={`/events?collection=${slug}`}><span className="event-collection-cover">{cover&&<img src={cover} alt=""/>}</span><span className="event-collection-copy"><span className="eyebrow">Подборка Chereda</span><b>{title}</b><span className="meta">Смотреть события <ArrowRight size={14}/></span></span></Link>})}</div></section>
    <section className="event-categories"><h2>Категории</h2><div className="event-category-grid" id="event-category-grid">{(categoriesExpanded?eventCategories:eventCategories.slice(0,6)).map(item=>{const count=eventsData.filter(event=>event.category===item.name).length;return <Link key={item.slug} className={`card event-category-card ${category===item.name?'selected':''}`} href={`/events/category/${item.slug}`} aria-label={`${item.name}: ${count} ${count===1?'событие':count>1&&count<5?'события':'событий'}`}><span className="event-category-icon"><img src={`/icons/events/${item.icon}.svg`} alt="" aria-hidden="true"/></span><span className="event-category-copy"><b>{item.name}</b><small>{count} {count===1?'событие':count>1&&count<5?'события':'событий'}</small></span><ArrowRight className="event-category-arrow" size={17}/></Link>})}</div>{eventCategories.length>6&&<button className="button event-categories-toggle" type="button" aria-expanded={categoriesExpanded} aria-controls="event-category-grid" onClick={()=>setCategoriesExpanded(value=>!value)}>{categoriesExpanded?'Свернуть':'Показать все'}{categoriesExpanded?<CaretUp size={16}/>:<CaretDown size={16}/>}</button>}</section>
    <section className="section"><div className="section-head events-results-head"><div><h2>{past?'Прошедшие события':category!=='Все категории'?category:'Все события'} · {rows.length}</h2>{initialCategory&&<p className="meta">Афиша: {category}</p>}</div><div className="tabs events-results-tools"><button className={`chip ${!past?'selected':''}`} onClick={()=>setPastFilter(false)}>Предстоящие</button><button className={`chip ${past?'selected':''}`} onClick={()=>setPastFilter(true)}>Прошедшие</button><label className="sr-only" htmlFor="events-sort">Сортировка событий</label><select id="events-sort" className="select" value={sort} onChange={event=>setSortFilter(event.target.value)}><option value="soonest">Сначала ближайшие</option><option value="popular">Сначала популярные</option></select>{(category!=='Все категории'||date!=='all'||dateStart||dateEnd||format!=='all'||price!=='all'||collection)&&<button className="text-button" onClick={reset}>Сбросить фильтры</button>}</div></div>{rows.length?<div className="grid event-grid">{rows.map(event=><EventCard key={event.id} event={event} period={date!=='all'?date:collection==='week'?'week':''} rangeStart={dateStart} rangeEnd={dateEnd} past={past} returnTo={pathname+(params.toString()?`?${params.toString()}`:'')}/>)}</div>:<div className="empty"><h3>Пока нет событий по этим условиям</h3><p>Поменяйте город или условия отбора, чтобы посмотреть другие события.</p><div className="row wrap event-empty-actions"><button className="button" onClick={()=>app.open('city')}>Выбрать город</button><button className="button" onClick={reset}>Сбросить фильтры</button></div></div>}</section>
  </div>
}

function RegistrationForm({eventId,session}:{eventId:string;session:EventSession}){
  const [open,setOpen]=useState(false);const [registered,setRegistered]=useState(false);const [error,setError]=useState('');
  useEffect(()=>{queueMicrotask(()=>{const stored=readRegistrations();setRegistered(stored.items.some(item=>item.eventId===eventId&&item.sessionId===session.id));setError(stored.error)})},[eventId,session.id]);
  const submit=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();const stored=readRegistrations();if(stored.error){setError(stored.error);return}if(stored.items.some(item=>item.eventId===eventId&&item.sessionId===session.id)){setRegistered(true);return}const form=new FormData(event.currentTarget);const record={eventId,sessionId:session.id,name:String(form.get('name')||''),email:String(form.get('email')||''),phone:String(form.get('phone')||''),registeredAt:new Date().toISOString()};try{localStorage.setItem(registrationsKey,JSON.stringify([...stored.items,record]));setRegistered(true);setError('')}catch{setError('Браузер не разрешил сохранить регистрацию. Попробуйте позже.')}};
  if(registered)return <div className="event-registration-confirm"><b>Вы зарегистрированы</b><p>Подтверждение сохранено локально в этом браузере.</p><Link className="button" href="/events/registrations">Мои регистрации</Link></div>;
  if(!open)return <button className="button primary" onClick={()=>setOpen(true)}>Зарегистрироваться бесплатно</button>;
  return <form className="event-registration" onSubmit={submit}><label className="field">Имя<input className="input" name="name" autoComplete="name" required/></label><label className="field">Email<input className="input" name="email" type="email" autoComplete="email" required/></label><label className="field">Телефон · необязательно<input className="input" name="phone" type="tel" autoComplete="tel"/></label><p className="meta">Это локальное демо: контакты не отправляются на сервер и останутся в этом браузере.</p>{error&&<p className="form-error" role="alert">{error}</p>}<button className="button primary" type="submit">Подтвердить регистрацию</button><button className="text-button" type="button" onClick={()=>setOpen(false)}>Отмена</button></form>
}

export function EventDetailPage({slug}:{slug:string}){
  const params=useSearchParams();const router=useRouter();const app=useApp();const [eventsData,setEventsData]=useState<CheredaEvent[]>(events);const [hydrated,setHydrated]=useState(false);
  useEffect(()=>{queueMicrotask(()=>{setEventsData(readAllEvents());setHydrated(true)})},[]);
  const event=eventsData.find(item=>item.slug===slug);
  if(!event)return <div className="container page">{hydrated?<><h1>Событие не найдено</h1><p className="lede">Ссылка могла вести на черновик, сохранённый в другом браузере.</p><Link className="button" href="/events">К афише</Link></>:<div className="empty">Загружаем событие…</div>}</div>;
  const returnTo=safeReturnTo(params.get('returnTo'),'/events');
  const currentEventPath=`/events/${event.slug}${params.size?`?${params.toString()}`:''}`;
  const session=event.sessions.find(item=>item.id===params.get('occurrence'))||event.sessions.find(item=>item.status==='open')||event.sessions[0];const organizer=profiles.find(profile=>profile.slug===event.organizerId);const venue=profiles.find(profile=>profile.slug===session.venueId||profile.slug===event.venueId);const team=event.teamIds.map(id=>profiles.find(profile=>profile.slug===id)).filter((item):item is NonNullable<typeof item>=>Boolean(item));const project=projects.find(item=>item.slug===event.projectSlug);const cover=project?mediaById(project.mediaIds[0])?.src:undefined;const displayCity=event.format==='Онлайн'?'Онлайн':venue?cityName(venue.city):event.city;const now=new Date();const today=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;const sessionEnded=session.status==='past'||session.dateISO<today;const eventEnded=event.sessions.every(item=>item.status==='past'||item.dateISO<today);
  const chooseSession=(id:string)=>{const query=new URLSearchParams(params.toString());query.set('occurrence',id);router.push(`/events/${event.slug}?${query.toString()}`,{scroll:false})};
  const removeDraft=()=>{if(!event.isLocalDraft||!window.confirm('Удалить этот локальный черновик события?'))return;try{const saved=JSON.parse(localStorage.getItem(createdEventsKey)||'[]');localStorage.setItem(createdEventsKey,JSON.stringify(Array.isArray(saved)?saved.filter((item:CheredaEvent)=>item.id!==event.id):[]));app.toast('Локальный черновик удалён');router.push('/events')}catch{app.toast('Не удалось удалить черновик из этого браузера')}};
  const reportMedia=sessionEnded&&project?project.mediaIds.slice(0,6).map(id=>mediaById(id)):[];
  return <div className="container page events-page"><Link href={returnTo} className="meta">← {returnContextLabel(returnTo)}</Link><div className="event-detail-grid"><main><div className="event-detail-cover" role="img" aria-label={`Обложка события «${event.title}»`} style={cover?{backgroundImage:`url('${cover}')`}:undefined}><span className="badge">{event.category}</span></div><div className="eyebrow">{event.format} · {displayCity}{event.ageRating?` · ${event.ageRating}`:''}{event.isLocalDraft&&<span className="badge">Локальное демо</span>}</div><h1>{event.title}</h1>{event.subtitle&&<h2 className="event-subtitle">{event.subtitle}</h2>}<p className="lede">{event.description}</p><EventActions event={event}/>
    <section className="card card-body event-detail-section"><h2>О событии</h2><p>{event.details||event.description}</p>{event.audience&&<div className="event-detail-fact"><b>Кому подойдёт</b><p>{event.audience}</p></div>}<div className="row wrap">{event.tags.map(tag=><span className="chip" key={tag}>{tag}</span>)}</div></section>
    {event.agenda?.length&&<section className="card card-body event-detail-section"><h2>Программа</h2><div className="event-agenda">{event.agenda.map((item,index)=><article className="event-agenda-item" key={`${item.time}-${index}`}><time>{item.time}</time><div><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div></section>}
    {event.outcomes?.length&&<section className="card card-body event-detail-section"><h2>Что вы получите</h2><ul className="event-outcomes">{event.outcomes.map(item=><li key={item}>{item}</li>)}</ul></section>}
    {event.collection&&<section className="card card-body event-detail-section event-collection-callout"><span className="eyebrow">Подборка Chereda</span><h2>{event.collection}</h2><p>Откройте другие события этой подборки и соберите собственный маршрут.</p><Link className="button" href={`/events?category=${encodeURIComponent(event.category)}`}>Смотреть похожие события <ArrowRight size={16}/></Link></section>}
    <section className="card card-body event-detail-section"><div className="section-head"><div><h2>Организатор</h2><p className="meta">Кто отвечает за программу и проведение</p></div></div>{organizer&&<Link className="event-entity-card" href={withReturnTo(`/profiles/${organizer.slug}`,currentEventPath)}><img src={organizer.cover} alt=""/><div className="event-entity-avatar"><img src={organizer.avatar} alt=""/></div><div className="event-entity-copy"><b>{organizer.name}</b><span>{organizer.specialty} · {cityName(organizer.city)}</span><small>{organizer.bio}</small></div><ArrowRight size={18}/></Link>}</section>
    <section className="card card-body event-detail-section"><div className="section-head"><div><h2>Команда события</h2><p className="meta">Специалисты, которые участвуют в событии</p></div></div><div className="event-entity-grid">{team.map(profile=><Link className="event-person-card" key={profile.id} href={withReturnTo(`/profiles/${profile.slug}`,currentEventPath)}><img className="event-person-avatar" src={profile.avatar} alt=""/><b>{profile.name}</b><span>{profile.specialty}</span><small>{profile.bio}</small><span className="event-card-link">Открыть профиль <ArrowRight size={15}/></span></Link>)}</div></section>
    <section className="card card-body event-detail-section"><h2>{event.format==='Онлайн'?'Формат участия':'Площадка'}</h2>{venue?<Link className="event-venue-card" href={withReturnTo(`/profiles/${venue.slug}`,currentEventPath)}><img src={venue.cover} alt=""/><div><span className="eyebrow">{venue.venueType} · до {venue.capacity} гостей</span><h3>{venue.name}</h3><p>{event.address||`${cityName(venue.city)} · адрес указан в профиле площадки`}</p><p>{event.accessibility||venue.accessibility?.join(' · ')}</p><span className="event-card-link">Страница площадки <ArrowRight size={15}/></span></div></Link>:<div className="event-online-card"><CalendarBlank size={21}/><div><b>Онлайн-встреча · {event.language||'Русский'}</b><p>Инструкция для подключения появится после локальной регистрации.</p></div></div>}</section>
    {project&&<section className="card card-body event-detail-section"><div className="section-head"><div><h2>Проект команды</h2><p className="meta">Событие связано с существующим проектом Chereda</p></div></div><Link className="event-project-card" href={withReturnTo(`/projects/${project.slug}?from=events`,currentEventPath)}><img src={cover} alt=""/><div><span className="eyebrow">Проект · {cityName(project.city)}</span><h3>{project.title}</h3><p>{project.description}</p><span className="event-card-link">Открыть проект и участников <ArrowRight size={15}/></span></div></Link></section>}
    {eventEnded&&project&&<section className="card card-body event-detail-section"><h2>Фотоотчёт</h2><p>Материалы события связаны с проектом команды.</p><div className="event-report-grid">{reportMedia.map((item,index)=><Link className="event-report-item" href={withReturnTo(`/projects/${project.slug}?media=${index}&from=events`,currentEventPath)} key={item.id}><img src={item.src} alt={item.alt}/><span>{item.caption||`Кадр ${index+1}`}</span></Link>)}</div><Link className="button primary" href={withReturnTo(`/projects/${project.slug}?from=events`,currentEventPath)}>Открыть проект и команду</Link></section>}
    <EventReviews eventId={event.id} occurrenceId={session.id} occurrenceLabel={`${session.date} · ${session.time}`} projectSlug={event.projectSlug} profileIds={[event.organizerId,event.venueId,...event.teamIds,...(session.venueId?[session.venueId]:[])].filter(Boolean)} canReview={sessionEnded}/></main>
    <aside className="card card-body event-register"><span className="eyebrow">{eventEnded?'Событие завершено':event.sessions.length>1?'Выберите дату':'Ближайшая дата'}</span>{event.sessions.length>1&&<select className="select" aria-label="Дата события" value={session.id} onChange={e=>chooseSession(e.target.value)}>{event.sessions.map(item=><option key={item.id} value={item.id}>{item.date} · {item.time}{item.status==='full'?' · мест нет':''}{item.status==='past'?' · прошло':''}</option>)}</select>}<h2>{session.date}</h2><p>{session.time} · {displayCity}</p><p>{session.price}{session.status!=='past'?` · ${Math.max(0,session.capacity-session.registered)} мест осталось`:''}</p>{event.format==='Онлайн'&&<span className="badge">Онлайн · ссылка после регистрации</span>}{session.status==='open'?<RegistrationForm eventId={event.id} session={session}/>:<span className="badge">{session.status==='past'?'Событие прошло':'Мест нет'}</span>}<p className="meta">{session.registered} записались · список гостей не раскрывается без согласия</p><div className="event-register-facts"><span>Возраст</span><b>{event.ageRating||'Без ограничений'}</b><span>Язык</span><b>{event.language||'Русский'}</b><span>Формат</span><b>{event.format}</b></div>{event.isLocalDraft&&<button className="text-button" onClick={removeDraft}>Удалить локальный черновик</button>}</aside></div></div>
}

export function EventsCategoryPage({slug}:{slug:string}){
  const [category,setCategory]=useState(()=>Array.from(new Set(events.map(event=>event.category))).find(value=>categorySlug(value)===decodeURIComponent(slug))||decodeURIComponent(slug).replaceAll('-',' '));
  useEffect(()=>{queueMicrotask(()=>{const match=readAllEvents().find(event=>categorySlug(event.category)===decodeURIComponent(slug));if(match)setCategory(match.category)})},[slug]);
  return <EventsPage initialCategory={category}/>;
}

export function MyEventRegistrationsPage(){
  const [items,setItems]=useState<SavedRegistration[]>([]);const [error,setError]=useState('');const [eventsData,setEventsData]=useState<CheredaEvent[]>(events);
  useEffect(()=>{queueMicrotask(()=>{const stored=readRegistrations();setItems(stored.items);setError(stored.error);setEventsData(readAllEvents())})},[]);
  const rows=items.map(item=>({item,event:eventsData.find(value=>value.id===item.eventId)})).filter((row):row is {item:SavedRegistration;event:CheredaEvent}=>Boolean(row.event));
  return <div className="container page events-page"><Link href="/events" className="meta">← К афише</Link><h1>Мои регистрации</h1><p className="lede">Ваши записи на события, сохранённые в этом браузере.</p>{error&&<div className="empty" role="alert"><h2>Не удалось восстановить регистрации</h2><p>{error}</p><Link className="button" href="/events">Открыть афишу</Link></div>}{!error&&rows.length?<div className="grid event-grid">{rows.map(({item,event})=>{const session=event.sessions.find(value=>value.id===item.sessionId);const eventHref=withReturnTo(`/events/${event.slug}?occurrence=${item.sessionId}`,'/events/registrations');return <article className="card card-body event-registration-card" key={`${item.eventId}-${item.sessionId}`}><span className="eyebrow">{session?.date} · {session?.time}</span><h2><Link href={eventHref}>{event.title}</Link></h2><p>{event.city} · {event.format} · {session?.price}</p><span className="badge">Регистрация подтверждена · локальное демо</span><Link className="button" href={eventHref}>Открыть событие</Link></article>})}</div>:!error&&<div className="empty"><h2>Пока нет регистраций</h2><p>Выберите событие в афише и заполните короткую форму. Запись появится здесь.</p><Link className="button primary" href="/events">Открыть афишу</Link></div>}</div>
}

export function SavedEventsPage(){
  const [ids,setIds]=useState<string[]>([]);const [error,setError]=useState('');const [eventsData,setEventsData]=useState<CheredaEvent[]>(events);
  useEffect(()=>{queueMicrotask(()=>{const stored=readSavedEvents();setIds(stored.ids);setError(stored.error);setEventsData(readAllEvents())})},[]);
  const rows=ids.map(id=>eventsData.find(event=>event.id===id)).filter((event):event is CheredaEvent=>Boolean(event));
  return <div className="container page events-page"><Link href="/events" className="meta">← К афише</Link><h1>Сохранённые события</h1><p className="lede">События, которые вы отметили в этом браузере.</p>{error&&<div className="empty" role="alert"><h2>Не удалось восстановить список</h2><p>{error}</p><Link className="button" href="/events">Открыть афишу</Link></div>}{!error&&rows.length?<div className="grid event-grid">{rows.map(event=><EventCard key={event.id} event={event} returnTo="/events/saved" onSavedChange={saved=>{if(!saved)setIds(current=>current.filter(id=>id!==event.id))}}/>)}</div>:!error&&<div className="empty"><h2>Пока ничего не сохранено</h2><p>Нажмите «Сохранить» на карточке события, чтобы вернуться к нему позже.</p><Link className="button primary" href="/events">Открыть афишу</Link></div>}</div>
}
