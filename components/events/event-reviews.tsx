'use client';

import {useEffect,useMemo,useState,type FormEvent} from 'react';
import {Star} from '@phosphor-icons/react';
import {useApp} from '@/components/navigation/app-shell';
import Link from 'next/link';
import {events} from '@/data/events';

type EventReview={id:string;eventId:string;occurrenceId?:string;projectSlug?:string;profileIds?:string[];author:string;rating:number;text:string;date:string;demo?:boolean};
const storageKey='chereda-event-reviews-v1';
const seededReviews:EventReview[]=[
  {id:'review-autumn-review-1',eventId:'ev-autumn-review',occurrenceId:'review-2026-10-20',projectSlug:'white-garden-wedding',profileIds:['bureau-krug','loft-bereg','anna-mironova-photo','elena-sokolova-hair','forma-flora'],author:'Участник demo',rating:5,text:'Понравилось, что на встрече разобрали не только финальные фотографии, но и решения по площадке, команде и подготовке.',date:'22 октября 2026',demo:true},
  {id:'review-autumn-review-2',eventId:'ev-autumn-review',occurrenceId:'review-2026-10-20',projectSlug:'white-garden-wedding',profileIds:['bureau-krug','loft-bereg','anna-mironova-photo','elena-sokolova-hair','forma-flora'],author:'Участница demo',rating:4,text:'Полезная программа и спокойный формат вопросов. После разбора стало понятнее, как связать идею проекта с реальными условиями площадки.',date:'23 октября 2026',demo:true},
];

function isEventReview(value:unknown):value is EventReview{
  if(!value||typeof value!=='object')return false;
  const review=value as Partial<EventReview>;
  return typeof review.id==='string'&&typeof review.eventId==='string'&&typeof review.author==='string'&&
    typeof review.rating==='number'&&review.rating>=1&&review.rating<=5&&typeof review.text==='string'&&typeof review.date==='string'&&
    (review.projectSlug===undefined||typeof review.projectSlug==='string')&&
    (review.profileIds===undefined||(Array.isArray(review.profileIds)&&review.profileIds.every(id=>typeof id==='string')));
}

function loadReviews():EventReview[]{
  try{
    const stored:unknown=JSON.parse(localStorage.getItem(storageKey)||'[]');
    const local=Array.isArray(stored)?stored.filter(isEventReview):[];
    const seededIds=new Set(seededReviews.map(review=>review.id));
    return [...seededReviews,...local.filter(review=>!seededIds.has(review.id))];
  }catch{return seededReviews}
}

export function EventReviews({eventId,occurrenceId,occurrenceLabel,projectSlug,profileIds=[],canReview}:{eventId:string;occurrenceId?:string;occurrenceLabel?:string;projectSlug?:string;profileIds?:string[];canReview:boolean}){
  const app=useApp();
  const [allReviews,setAllReviews]=useState<EventReview[]>(seededReviews);
  const [ready,setReady]=useState(false);
  const [rating,setRating]=useState('5');
  const [text,setText]=useState('');
  const [notice,setNotice]=useState('');
  useEffect(()=>{queueMicrotask(()=>{setAllReviews(loadReviews());setReady(true)})},[]);
  const reviews=useMemo(()=>allReviews.filter(review=>review.eventId===eventId&&(!occurrenceId||review.occurrenceId===occurrenceId)),[allReviews,eventId,occurrenceId]);
  const hasViewerReview=reviews.some(review=>!review.demo&&review.author==='Вы · локальный demo');
  const reviewsAnchor=`event-reviews-${eventId}-${occurrenceId??'event'}`;
  const submit=(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    const value=text.trim();
    if(!value)return;
    if(hasViewerReview){setNotice('Вы уже оставили отзыв об этом сеансе.');return}
    const review:EventReview={id:`local-${eventId}-${occurrenceId??'event'}-${Date.now()}`,eventId,occurrenceId,projectSlug,profileIds,author:'Вы · локальный demo',rating:Number(rating),text:value,date:new Date().toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'})};
    const next=[...allReviews,review];
    setAllReviews(next);setText('');setNotice('Отзыв добавлен в этом браузере.');
    try{
      const local=next.filter(item=>!item.demo);
      localStorage.setItem(storageKey,JSON.stringify(local));
    }catch{setNotice('Отзыв добавлен до закрытия этой вкладки. Хранилище браузера недоступно.')}
    app.toast('Отзыв сохранён локально');
  };
  return <section className="event-reviews section" id={reviewsAnchor} aria-labelledby={reviewsAnchor}>
    <div className="section-head"><div><div className="eyebrow">Опыт участников</div><h2 id={reviewsAnchor}>Отзывы о событии и проекте</h2><p className="meta">Отзыв относится к выбранному завершённому сеансу и также виден в отзывах связанных участников.</p></div><span className="badge">{ready?reviews.length:'—'} отзывов</span></div>
    {!ready?<div className="page-loading" role="status" aria-busy="true">Загружаем отзывы…</div>:reviews.length?<div className="event-review-list">{reviews.map(review=><article className="card card-body event-review-card" key={review.id}>
      <div className="between"><div><b>{review.author}</b><div className="meta">{review.date}{review.demo?' · демонстрационный отзыв':''}</div></div><span className="event-review-rating" aria-label={`Оценка ${review.rating} из 5`}>{Array.from({length:review.rating},(_,index)=><Star key={index} size={15} weight="fill"/>)}</span></div>
      <p>{review.text}</p>
    </article>)}</div>:<div className="empty event-review-empty"><h3>Отзывов пока нет</h3><p>После события можно поделиться впечатлением и помочь другим участникам.</p></div>}
    {canReview&&hasViewerReview?<div className="card card-body event-review-confirmation" role="status"><b>Вы уже оставили отзыв об этом сеансе</b><p className="meta">Он показан здесь и в отзывах связанных участников.</p></div>:canReview?<form className="card card-body event-review-form" onSubmit={submit}>
      <h3>Оставить отзыв</h3>
      {occurrenceLabel&&<p className="meta">Отзыв о сеансе {occurrenceLabel}. Он также появится в истории связанного проекта.</p>}
      <label className="field">Ваша оценка<select className="select" value={rating} onChange={event=>setRating(event.target.value)}>{[5,4,3,2,1].map(value=><option value={value} key={value}>{value} из 5</option>)}</select></label>
      <label className="field">Впечатление о событии<textarea className="input" rows={4} minLength={10} maxLength={1200} required value={text} onChange={event=>setText(event.target.value)} placeholder="Что было полезно, что запомнилось?"/></label>
      <p className="meta">Отзыв сохраняется локально и не отправляется организатору.</p>
      <button className="button primary" type="submit" disabled={text.trim().length<10}>Опубликовать отзыв</button>
    </form>:<p className="event-review-locked" role="note">Оставить отзыв можно после завершения события.</p>}
    {notice&&<p className="event-review-notice" role="status" aria-live="polite">{notice}</p>}
  </section>;
}

export function ProfileEventFeedback({profileId}:{profileId:string}){
  const [allReviews,setAllReviews]=useState<EventReview[]>(seededReviews);
  const [ready,setReady]=useState(false);
  useEffect(()=>{queueMicrotask(()=>{setAllReviews(loadReviews());setReady(true)})},[]);
  const linked=allReviews.filter(review=>review.profileIds?.includes(profileId));
  const eventById=new Map(events.map(event=>[event.id,event]));
  const reviewableEvents=events.filter(event=>(event.teamIds.includes(profileId)||event.organizerId===profileId||event.venueId===profileId)&&event.sessions.some(session=>session.status==='past'&&!linked.some(review=>review.eventId===event.id&&review.occurrenceId===session.id&&!review.demo&&review.author==='Вы · локальный demo')));
  return <section className="profile-event-feedback section" aria-labelledby={`profile-event-feedback-${profileId}`}>
    <div className="section-head"><div><div className="eyebrow">Обратная связь после события</div><h3 id={`profile-event-feedback-${profileId}`}>Отзывы участников событий</h3><p className="meta">Отзывы доступны после завершения сеанса и связаны с проектом и его командой.</p></div><span className="badge">{ready?linked.length:'—'}</span></div>
    {!ready?<div className="page-loading" role="status" aria-busy="true">Загружаем отзывы…</div>:linked.length?<div className="stack profile-review-list">{linked.map(review=>{
      const event=eventById.get(review.eventId);
      const session=event?.sessions.find(item=>item.id===review.occurrenceId);
      if(!event)return null;
      const href=`/events/${event.slug}${session?`?occurrence=${encodeURIComponent(session.id)}`:''}#event-reviews-${event.id}-${session?.id??'event'}`;
      return <article className="card card-body review-card" key={review.id}><div className="between"><div><b>{review.author}</b><div className="meta">{review.date}{session?` · ${session.date}`:''}{review.demo?' · демонстрационный отзыв':''}</div></div><span className="review-stars icon-meta"><Star size={13} weight="fill"/> {review.rating}</span></div><p>{review.text}</p><Link className="meta" href={href}>О событии и отзыве <span aria-hidden="true">→</span></Link></article>;
    })}</div>:<div className="empty"><p>После завершённого события здесь появятся отзывы, связанные с этим участником.</p></div>}
    {reviewableEvents.length>0&&<div className="row wrap">{reviewableEvents.map(event=>{const completed=[...event.sessions].filter(session=>session.status==='past'&&!linked.some(review=>review.eventId===event.id&&review.occurrenceId===session.id&&!review.demo&&review.author==='Вы · локальный demo')).sort((a,b)=>b.dateISO.localeCompare(a.dateISO))[0];return completed?<Link className="button" href={`/events/${event.slug}?occurrence=${encodeURIComponent(completed.id)}#event-reviews-${event.id}-${completed.id}`} key={event.id}>Оставить отзыв о событии <span aria-hidden="true">→</span></Link>:null})}</div>}
  </section>;
}
