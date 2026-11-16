'use client';

import Link from 'next/link';
import {ArrowRight,Calendar} from '@phosphor-icons/react';
import {useEffect,useMemo,useState} from 'react';
import {EventReviews} from '@/components/events/event-reviews';
import {events,type CheredaEvent} from '@/data/events';
import {mediaById,profiles,projects} from '@/data/seed';
import {withReturnTo} from '@/components/navigation/return-context';

const storageKey='chereda-created-events-v1';
const today=()=>{
  const date=new Date();
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
};
const displayDate=(iso:string)=>new Date(`${iso}T12:00:00`).toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'});

function isCheredaEvent(value:unknown):value is CheredaEvent{
  if(!value||typeof value!=='object')return false;
  const event=value as Partial<CheredaEvent>;
  return typeof event.id==='string'&&typeof event.slug==='string'&&typeof event.title==='string'&&
    typeof event.category==='string'&&typeof event.city==='string'&&
    (event.format==='Онлайн'||event.format==='Офлайн')&&typeof event.description==='string'&&
    typeof event.organizerId==='string'&&typeof event.venueId==='string'&&
    Array.isArray(event.teamIds)&&event.teamIds.every(id=>typeof id==='string')&&
    typeof event.projectSlug==='string'&&Array.isArray(event.tags)&&event.tags.every(tag=>typeof tag==='string')&&
    Array.isArray(event.sessions)&&event.sessions.length>0&&event.sessions.every(session=>
      Boolean(session)&&typeof session.id==='string'&&typeof session.dateISO==='string'&&
      typeof session.date==='string'&&typeof session.time==='string'&&typeof session.venueId==='string'&&
      typeof session.capacity==='number'&&typeof session.registered==='number'&&typeof session.price==='string'&&
      (session.status==='open'||session.status==='full'||session.status==='past'));
}

function readAllEvents():CheredaEvent[]{
  try{
    const stored:unknown=JSON.parse(localStorage.getItem(storageKey)||'[]');
    const local=Array.isArray(stored)?stored.filter(isCheredaEvent):[];
    const seenIds=new Set(events.map(event=>event.id));
    const seenSlugs=new Set(events.map(event=>event.slug));
    const uniqueLocal=local.filter(event=>{
      if(seenIds.has(event.id)||seenSlugs.has(event.slug))return false;
      seenIds.add(event.id);seenSlugs.add(event.slug);return true;
    });
    return [...events,...uniqueLocal];
  }catch{return events}
}

export function RelatedEvents({projectSlug,profileSlug,detailed=false}:{projectSlug?:string;profileSlug?:string;detailed?:boolean}){
  const [allEvents,setAllEvents]=useState(events);
  useEffect(()=>{queueMicrotask(()=>setAllEvents(readAllEvents()))},[]);
  const related=useMemo(()=>{
    const currentDate=today();
    return allEvents.filter(event=>projectSlug?event.projectSlug===projectSlug:Boolean(profileSlug&&(event.organizerId===profileSlug||event.venueId===profileSlug||event.sessions.some(session=>session.venueId===profileSlug)||event.teamIds.includes(profileSlug))))
      .map(event=>{
        const sessions=[...event.sessions].sort((a,b)=>a.dateISO.localeCompare(b.dateISO));
        const session=sessions.find(item=>item.status!=='past'&&item.dateISO>=currentDate)||sessions[sessions.length-1];
        const project=projects.find(item=>item.slug===event.projectSlug);
        const cover=project?mediaById(project.mediaIds[0])?.src:undefined;
        return {event,sessions,session,cover};
      })
      .filter((item):item is typeof item&{session:NonNullable<typeof item.session>}=>Boolean(item.session))
      .sort((a,b)=>{
        const aPast=a.session.status==='past'||a.session.dateISO<currentDate;
        const bPast=b.session.status==='past'||b.session.dateISO<currentDate;
        if(aPast!==bPast)return aPast?1:-1;
        return aPast?b.session.dateISO.localeCompare(a.session.dateISO):a.session.dateISO.localeCompare(b.session.dateISO);
      });
  },[allEvents,projectSlug,profileSlug]);
  if(!related.length)return null;
  const profile=profileSlug?profiles.find(item=>item.slug===profileSlug):undefined;
  const project=projectSlug?projects.find(item=>item.slug===projectSlug):undefined;
  const returnTo=projectSlug?`/projects/${projectSlug}`:profileSlug?`/profiles/${profileSlug}`:undefined;
  if(detailed&&projectSlug)return <section className="section related-events-section project-event-lifecycle" aria-labelledby="related-events-title">
    <div className="section-head"><div><div className="eyebrow">События и этапы проекта</div><h2 id="related-events-title">История события</h2><p className="meta">Анонсы, даты, программа и архив берутся из связанных событий.</p></div><Link className="button" href="/events">Вся афиша</Link></div>
    <div className="project-event-lifecycle-list">{related.map(({event,sessions,cover})=><ProjectLifecycleEvent key={event.id} event={event} sessions={sessions} cover={cover} returnTo={returnTo}/>)}</div>
  </section>;
  return <section className="section related-events-section" aria-labelledby="related-events-title">
    <div className="section-head"><div><div className="eyebrow">Связи в Chereda</div><h2 id="related-events-title">{profile?'События с участием':project?'События проекта':'Связанные события'}</h2><p className="meta">{profile?profile.name:project?.title}</p></div><Link className="button" href="/events">Вся афиша</Link></div>
    <div className="event-related-grid">{related.map(({event,session,cover})=><Link className="card event-related-card" href={withReturnTo(`/events/${event.slug}`,returnTo)} key={event.id}>
      <span className="event-related-cover">{cover&&<img src={cover} alt="" loading="lazy"/>}<span className="badge">{event.category}</span></span>
      <span className="event-related-copy"><b>{event.title}</b><span className="meta">{displayDate(session.dateISO)} · {session.time}</span><span className="meta">{event.format==='Онлайн'?'Онлайн':`${event.city} · офлайн`} · {session.price}</span><span className="event-card-link">Страница события <span aria-hidden="true">→</span></span></span>
    </Link>)}</div>
  </section>;
}

function ProjectLifecycleEvent({event,sessions,cover,returnTo}:{event:CheredaEvent;sessions:CheredaEvent['sessions'];cover?:string;returnTo?:string}){
  const organizer=profiles.find(profile=>profile.slug===event.organizerId);
  const team=event.teamIds.map(id=>profiles.find(profile=>profile.slug===id)).filter((profile):profile is NonNullable<typeof profile>=>Boolean(profile));
  const venueIds=[...new Set([event.venueId,...sessions.map(session=>session.venueId)].filter(Boolean))];
  const venues=venueIds.map(id=>profiles.find(profile=>profile.slug===id)).filter((profile):profile is NonNullable<typeof profile>=>Boolean(profile));
  const participants=[...new Map([...(organizer?[organizer]:[]),...venues,...team].map(profile=>[profile.id,profile])).values()];
  const project=projects.find(item=>item.slug===event.projectSlug);
  const upcoming=sessions.some(session=>session.status!=='past'&&session.dateISO>=today());
  const completedSessions=[...sessions].filter(session=>session.status==='past'||session.dateISO<today()).sort((a,b)=>b.dateISO.localeCompare(a.dateISO));
  const completedSession=completedSessions[0];
  const nextSession=sessions.find(session=>session.status!=='past'&&session.dateISO>=today());
  const primarySession=nextSession??completedSession??sessions[0];
  const eventHref=withReturnTo(`/events/${event.slug}?occurrence=${primarySession.id}`,returnTo);
  return <article className="card project-lifecycle-event">
    <div className="project-lifecycle-cover">{cover&&<img src={cover} alt="" loading="lazy"/>}<span className="badge">{event.category}</span><span className={`badge ${upcoming?'event-lifecycle-upcoming':'event-lifecycle-archive'}`}>{upcoming?'Предстоящее событие':'В архиве'}</span></div>
    <div className="project-lifecycle-copy">
      <div className="eyebrow">{event.format} · {event.city}{event.ageRating?` · ${event.ageRating}`:''}</div>
      <h3><Link href={eventHref}>{event.title}</Link></h3>
      {event.subtitle&&<p className="project-lifecycle-subtitle">{event.subtitle}</p>}
      <p>{event.description}</p>
      {event.details&&<p>{event.details}</p>}
      {event.audience&&<p className="project-lifecycle-audience"><b>Для кого:</b> {event.audience}</p>}
      <div className="project-lifecycle-sessions" aria-label="Даты и сеансы">
        {sessions.map(session=>{
          const venueId=session.venueId||event.venueId;
          const venue=profiles.find(profile=>profile.slug===venueId);
          const isPast=session.status==='past'||session.dateISO<today();
          const state=isPast?'Прошло':session.status==='full'?'Мест нет':'Регистрация открыта';
          return <div className="project-lifecycle-session" key={session.id}>
            <span className="icon-meta"><Calendar size={15}/><b>{displayDate(session.dateISO)}</b></span>
            <span>{session.time} · {event.format==='Онлайн'?'Онлайн':event.city}</span>
            <span>{session.price} · {state}</span>
            <span className="meta">{session.registered} из {session.capacity} записались</span>
            {venue&&<Link className="text-link" href={withReturnTo(`/profiles/${venue.slug}`,returnTo)}>{venue.name}</Link>}
            <Link className="text-link" href={withReturnTo(`/events/${event.slug}?occurrence=${session.id}`,returnTo)}>{isPast?'Открыть архив сеанса':'Информация и регистрация'} <ArrowRight size={14}/></Link>
          </div>;
        })}
      </div>
      {event.agenda&&event.agenda.length>0&&<div className="project-lifecycle-program"><h4>Программа</h4><ol>{event.agenda.map((item,index)=><li key={`${item.time}-${index}`}><b>{item.time} · {item.title}</b><span>{item.description}</span></li>)}</ol></div>}
      {event.outcomes&&event.outcomes.length>0&&<div className="project-lifecycle-outcomes"><h4>Что получат участники</h4><ul>{event.outcomes.map(item=><li key={item}>{item}</li>)}</ul></div>}
      {(event.language||event.collection||event.address||event.accessibility)&&<div className="project-lifecycle-extra"><h4>Условия и контекст</h4><div className="project-lifecycle-extra-grid">{event.language&&<span><b>Язык</b>{event.language}</span>}{event.collection&&<span><b>Подборка</b>{event.collection}</span>}{event.address&&<span><b>Адрес</b>{event.address}</span>}{event.accessibility&&<span><b>Доступность</b>{event.accessibility}</span>}</div></div>}
      {participants.length>0&&<div className="project-lifecycle-participants"><h4>Организатор, площадка и команда события</h4><div className="project-lifecycle-people">{participants.map(person=><Link className="project-lifecycle-person" href={withReturnTo(`/profiles/${person.slug}`,returnTo)} key={person.id}><img src={person.avatar} alt=""/><span><b>{person.name}</b><small>{person.specialty}</small></span></Link>)}</div></div>}
      {event.tags.length>0&&<div className="project-lifecycle-tags" aria-label="Темы события">{event.tags.map(tag=><span className="chip" key={tag}>{tag}</span>)}</div>}
      {completedSession&&project&&<div className="project-lifecycle-report"><h4>Фотоотчёт завершённого сеанса</h4><div className="event-report-grid">{project.mediaIds.slice(0,3).map((id,index)=>{const media=mediaById(id);return <Link className="event-report-item" href={withReturnTo(`/projects/${project.slug}?media=${index}&from=events`,eventHref)} key={id}><img src={media.src} alt={media.alt} loading="lazy"/><span>{media.caption||`Кадр ${index+1}`}</span></Link>})}</div></div>}
      <Link className="button primary project-lifecycle-open" href={eventHref}>{upcoming?'О событии и регистрации':'О событии и фотоотчёте'} <ArrowRight size={16}/></Link>
      {completedSessions.map(session=><EventReviews key={`${event.id}-${session.id}`} eventId={event.id} occurrenceId={session.id} occurrenceLabel={`${session.date} · ${session.time}`} projectSlug={event.projectSlug} profileIds={[event.organizerId,event.venueId,...event.teamIds,...(session.venueId?[session.venueId]:[])].filter(Boolean)} canReview/>)}
    </div>
  </article>;
}
