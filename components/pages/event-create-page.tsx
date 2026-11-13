'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useMemo, useState, type FormEvent} from 'react';
import {ArrowLeft, CalendarBlank, Plus, X} from '@phosphor-icons/react';
import {DateRangeCalendar} from '@/components/events/date-range-calendar';
import {events, type CheredaEvent, type EventSession} from '@/data/events';
import {cities} from '@/data/catalog';
import {profiles, projects} from '@/data/seed';

const storageKey='chereda-created-events-v1';
const eventCategories=['Искусство и культура','Образование','Бизнес','Музыка','Кино и театр','Еда и напитки','Нетворкинг','Детям','Спорт и активный отдых','Другое'];
const dayLabel=(value:string)=>new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',year:'numeric'}).format(new Date(`${value}T12:00:00`));
const makeSlug=(value:string)=>value.toLocaleLowerCase('ru-RU').normalize('NFKD').replace(/[^a-z0-9а-яё]+/gi,'-').replace(/^-|-$/g,'').replace(/[а-яё]/g,char=>({'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'}[char]??char));
const eachDate=(start:string,end:string)=>{const result:string[]=[];const cursor=new Date(`${start}T12:00:00`);const last=new Date(`${end||start}T12:00:00`);while(cursor<=last&&result.length<15){result.push(cursor.toISOString().slice(0,10));cursor.setDate(cursor.getDate()+1)}return result};

export function EventCreatePage(){
  const router=useRouter();
  const [title,setTitle]=useState('');const [subtitle,setSubtitle]=useState('');const [description,setDescription]=useState('');const [details,setDetails]=useState('');
  const [category,setCategory]=useState(eventCategories[0]);const [city,setCity]=useState('Москва');const [format,setFormat]=useState<'Офлайн'|'Онлайн'>('Офлайн');
  const [start,setStart]=useState('');const [end,setEnd]=useState('');const [startTime,setStartTime]=useState('18:00');const [endTime,setEndTime]=useState('20:00');
  const [organizerId,setOrganizerId]=useState('bureau-krug');const [venueId,setVenueId]=useState('loft-bereg');const [teamIds,setTeamIds]=useState<string[]>(['anna-mironova-photo']);const [projectSlug,setProjectSlug]=useState('white-garden-wedding');
  const [audience,setAudience]=useState('');const [address,setAddress]=useState('');const [tags,setTags]=useState('');const [ageRating,setAgeRating]=useState('16+');const [language,setLanguage]=useState('Русский');const [capacity,setCapacity]=useState('100');
  const [agenda,setAgenda]=useState([{time:'18:00',title:'Открытие',description:''}]);const [outcomes,setOutcomes]=useState('');const [error,setError]=useState('');
  const organizers=useMemo(()=>profiles.filter(profile=>profile.type==='company'||profile.type==='team'),[]);
  const venues=useMemo(()=>profiles.filter(profile=>profile.type==='venue'),[]);
  const venueCities=useMemo(()=>cities.filter(item=>venues.some(venue=>venue.city===item.slug)),[venues]);
  const cityVenues=venues.filter(venue=>cities.find(item=>item.slug===venue.city)?.name===city);
  const people=useMemo(()=>profiles.filter(profile=>profile.id!==organizerId&&profile.type!=='venue').slice(0,18),[organizerId]);
  const toggleTeam=(id:string)=>setTeamIds(current=>current.includes(id)?current.filter(item=>item!==id):[...current,id]);
  const submit=(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();setError('');
    const dates=eachDate(start,end);
    if(!dates.length){setError('Выберите дату или период в календаре.');return}
    if(dates.length>14){setError('Для демо можно добавить до 14 повторяющихся дат.');return}
    const id=`ev-local-${Date.now().toString(36)}`;let slug=makeSlug(title)||id;
    const used=new Set([...events.map(item=>item.slug)]);
    try{const saved=JSON.parse(localStorage.getItem(storageKey)||'[]') as CheredaEvent[];saved.forEach(item=>used.add(item.slug));
      let suffix=2;const base=slug;while(used.has(slug)){slug=`${base}-${suffix++}`}
      const sessions:EventSession[]=dates.map((date,index)=>({id:`${id}-session-${index+1}`,date:dayLabel(date),dateISO:date,time:`${startTime}–${endTime}`,venueId:format==='Онлайн'?'':venueId,capacity:Math.max(1,Number(capacity)||100),registered:0,price:'Бесплатно',status:'open'}));
      const created:CheredaEvent={id,slug,title:title.trim(),subtitle:subtitle.trim()||undefined,category,city:format==='Онлайн'?'Онлайн':city,format,description:description.trim(),details:details.trim(),audience:audience.trim()||undefined,ageRating,language,agenda:agenda.filter(row=>row.title.trim()),outcomes:outcomes.split('\n').map(item=>item.trim()).filter(Boolean),organizerId,venueId:format==='Онлайн'?'':venueId,address:format==='Онлайн'?undefined:address.trim()||undefined,teamIds,projectSlug,tags:tags.split(',').map(tag=>tag.trim()).filter(Boolean),sessions,isLocalDraft:true,collection:'Новое в Chereda'};
      const current=JSON.parse(localStorage.getItem(storageKey)||'[]') as CheredaEvent[];localStorage.setItem(storageKey,JSON.stringify([...current,created]));router.push(`/events/${slug}`);
    }catch{setError('Не удалось сохранить событие в этом браузере. Освободите место в хранилище и попробуйте ещё раз.')}
  };
  return <div className="container page events-page event-create-page">
    <Link href="/events" className="button"><ArrowLeft size={16}/>К афише</Link>
    <div className="event-create-heading"><div className="eyebrow">Демо-сценарий организатора</div><h1>Создать событие</h1><p className="lede">Соберите страницу события и добавьте даты. Черновик сохранится только в этом браузере.</p></div>
    <form className="event-create-layout" onSubmit={submit}>
      <div className="event-create-main">
        <section className="card card-body event-create-section"><div className="event-create-section-title"><span className="badge">1</span><div><h2>О событии</h2><p className="meta">Коротко объясните, что ждёт гостя.</p></div></div>
          <label className="field">Название<input className="input" required maxLength={100} value={title} onChange={e=>setTitle(e.target.value)} placeholder="Например, открытая встреча о сценографии"/></label>
          <label className="field">Подзаголовок<input className="input" maxLength={120} value={subtitle} onChange={e=>setSubtitle(e.target.value)} placeholder="Главная тема или формат встречи"/></label>
          <div className="event-create-fields"><label className="field">Категория<select className="select" value={category} onChange={e=>setCategory(e.target.value)}>{eventCategories.map(item=><option key={item}>{item}</option>)}</select></label><label className="field">Формат<select className="select" value={format} onChange={e=>setFormat(e.target.value as 'Офлайн'|'Онлайн')}><option>Офлайн</option><option>Онлайн</option></select></label></div>
          {format==='Офлайн'&&<div className="event-create-fields"><label className="field">Город<select className="select" required value={city} onChange={e=>{const next=e.target.value;setCity(next);const nextVenue=venues.find(venue=>cities.find(item=>item.slug===venue.city)?.name===next);if(nextVenue)setVenueId(nextVenue.slug)}}>{venueCities.map(item=><option key={item.slug}>{item.name}</option>)}</select></label><label className="field">Адрес или ориентир<input className="input" value={address} onChange={e=>setAddress(e.target.value)} placeholder="Улица, дом, вход"/></label></div>}
          <label className="field">Короткое описание<textarea className="input" required rows={3} maxLength={500} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Что это за событие и почему стоит прийти?"/></label>
          <label className="field">Подробности<textarea className="input" required rows={6} value={details} onChange={e=>setDetails(e.target.value)} placeholder="Расскажите о программе, формате участия, ведущих и важных деталях."/></label>
          <label className="field">Для кого это событие?<input className="input" value={audience} onChange={e=>setAudience(e.target.value)} placeholder="Кому будет полезно"/></label>
          <div className="event-create-fields"><label className="field">Возрастной рейтинг<select className="select" value={ageRating} onChange={e=>setAgeRating(e.target.value)}><option>0+</option><option>6+</option><option>12+</option><option>16+</option><option>18+</option></select></label><label className="field">Язык события<select className="select" value={language} onChange={e=>setLanguage(e.target.value)}><option>Русский</option><option>Английский</option><option>Русский и английский</option></select></label></div>
          <label className="field">Темы и теги<input className="input" value={tags} onChange={e=>setTags(e.target.value)} placeholder="Свет, практика, нетворкинг"/><span className="meta">Разделяйте теги запятыми.</span></label>
        </section>
        <section className="card card-body event-create-section"><div className="event-create-section-title"><span className="badge">2</span><div><h2>Даты и время</h2><p className="meta">Можно добавить несколько соседних дат одного события.</p></div></div>
          <DateRangeCalendar start={start} end={end} onChange={(from,to)=>{setStart(from);setEnd(to)}}/>
          <div className="event-create-fields event-time-fields"><label className="field">Начало<input className="input" type="time" required value={startTime} onChange={e=>setStartTime(e.target.value)}/></label><label className="field">Окончание<input className="input" type="time" required value={endTime} onChange={e=>setEndTime(e.target.value)}/></label></div>
          <label className="field">Количество мест на каждый сеанс<input className="input" type="number" min="1" max="10000" value={capacity} onChange={e=>setCapacity(e.target.value)}/><span className="meta">В демо регистрация бесплатная. Продажа билетов и оплата здесь не подключены.</span></label>
          {start&&<p className="badge event-date-count"><CalendarBlank size={15}/>{eachDate(start,end).length} {eachDate(start,end).length===1?'сеанс':'сеанса'} · {dayLabel(start)}{end&&` — ${dayLabel(end)}`}</p>}
        </section>
        <section className="card card-body event-create-section"><div className="event-create-section-title"><span className="badge">3</span><div><h2>Программа</h2><p className="meta">Добавьте расписание по времени — оно появится на странице события.</p></div></div>
          <div className="event-create-agenda">{agenda.map((row,index)=><div className="event-create-agenda-row" key={`agenda-${index}`}><label className="field">Время<input className="input" type="time" value={row.time} onChange={e=>setAgenda(items=>items.map((item,i)=>i===index?{...item,time:e.target.value}:item))}/></label><label className="field">Название<input className="input" value={row.title} onChange={e=>setAgenda(items=>items.map((item,i)=>i===index?{...item,title:e.target.value}:item))}/></label><label className="field">Описание<input className="input" value={row.description} onChange={e=>setAgenda(items=>items.map((item,i)=>i===index?{...item,description:e.target.value}:item))}/></label><button className="icon-btn" type="button" aria-label={`Удалить пункт программы ${index+1}`} disabled={agenda.length===1} onClick={()=>setAgenda(items=>items.filter((_,i)=>i!==index))}><X size={17}/></button></div>)}</div>
          <button className="button" type="button" onClick={()=>setAgenda(items=>[...items,{time:'19:00',title:'',description:''}])}><Plus size={16}/>Добавить пункт программы</button>
          <label className="field">Что унесут участники<textarea className="input" rows={3} value={outcomes} onChange={e=>setOutcomes(e.target.value)} placeholder={'Один результат на строку\nНапример, готовая структура brief'}/></label>
        </section>
        <section className="card card-body event-create-section"><div className="event-create-section-title"><span className="badge">4</span><div><h2>Люди и проект</h2><p className="meta">Свяжите мероприятие с существующими профилями и проектом.</p></div></div>
          <label className="field">Организатор<select className="select" value={organizerId} onChange={e=>setOrganizerId(e.target.value)}>{organizers.map(item=><option key={item.id} value={item.slug}>{item.name} · {item.specialty}</option>)}</select></label>
          {format==='Офлайн'&&<label className="field">Площадка<select className="select" value={venueId} onChange={e=>setVenueId(e.target.value)}>{cityVenues.map(item=><option key={item.id} value={item.slug}>{item.name} · {item.capacity} гостей</option>)}</select></label>}
          <div className="field"><span>Команда события</span><div className="event-profile-pick-grid">{people.map(profile=><button className={`event-profile-pick${teamIds.includes(profile.slug)?' selected':''}`} type="button" key={profile.id} aria-pressed={teamIds.includes(profile.slug)} onClick={()=>toggleTeam(profile.slug)}><img src={profile.avatar} alt=""/><span><b>{profile.name}</b><small>{profile.specialty}</small></span>{teamIds.includes(profile.slug)?<X size={16}/>:<Plus size={16}/>}</button>)}</div></div>
          <label className="field">Связанный проект<select className="select" value={projectSlug} onChange={e=>setProjectSlug(e.target.value)}>{projects.slice(0,24).map(item=><option key={item.slug} value={item.slug}>{item.title}</option>)}</select></label>
        </section>
      </div>
      <aside className="card card-body event-create-aside"><span className="eyebrow">Публикация · демо</span><h2>Проверьте перед сохранением</h2><ul><li>Есть название и подробное описание.</li><li>Выбран один день или период дат.</li><li>Указаны организатор, команда и проект.</li><li>Черновик останется локальным.</li></ul>{error&&<p className="form-error" role="alert">{error}</p>}<button className="button primary" type="submit">Сохранить событие <ArrowLeft className="event-create-submit-icon" size={17}/></button><Link className="text-button" href="/events">Вернуться без сохранения</Link><p className="meta">В этой версии нет публикации на сервере, билетов и оплаты. В афише событие будет помечено как локальное демо.</p></aside>
    </form>
  </div>;
}
