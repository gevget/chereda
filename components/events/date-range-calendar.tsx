'use client';

import {useMemo, useState} from 'react';
import {CaretLeft, CaretRight} from '@phosphor-icons/react';

const weekdays=['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
const iso=(date:Date)=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const fromIso=(value:string)=>value?new Date(`${value}T12:00:00`):null;
const monthLabel=(date:Date)=>new Intl.DateTimeFormat('ru-RU',{month:'long',year:'numeric'}).format(date);

export function DateRangeCalendar({start,end,onChange}:{start:string;end:string;onChange:(start:string,end:string)=>void}){
  const [month,setMonth]=useState(()=>{const initial=fromIso(start)||new Date();return new Date(initial.getFullYear(),initial.getMonth(),1)});
  const days=useMemo(()=>{
    const first=new Date(month.getFullYear(),month.getMonth(),1);
    const offset=(first.getDay()+6)%7;
    const count=new Date(month.getFullYear(),month.getMonth()+1,0).getDate();
    return Array.from({length:Math.ceil((offset+count)/7)*7},(_,index)=>{
      const day=index-offset+1;
      return day<1||day>count?null:new Date(month.getFullYear(),month.getMonth(),day);
    });
  },[month]);
  const select=(value:string)=>{
    if(!start||end||value<start)onChange(value,'');
    else onChange(start,value);
  };
  return <div className="date-range-calendar" aria-label="Выбор периода">
    <div className="date-range-calendar-head"><button type="button" className="icon-button" aria-label="Предыдущий месяц" onClick={()=>setMonth(value=>new Date(value.getFullYear(),value.getMonth()-1,1))}><CaretLeft size={18}/></button><strong>{monthLabel(month)}</strong><button type="button" className="icon-button" aria-label="Следующий месяц" onClick={()=>setMonth(value=>new Date(value.getFullYear(),value.getMonth()+1,1))}><CaretRight size={18}/></button></div>
    <div className="date-range-calendar-grid">{weekdays.map(day=><span className="date-range-weekday" key={day}>{day}</span>)}{days.map((day,index)=>{
      if(!day)return <span className="date-range-empty" key={`blank-${index}`}/>;
      const value=iso(day);const selected=value===start||value===end;const inRange=Boolean(start&&end&&value>start&&value<end);
      return <button type="button" key={value} className={`date-range-day${selected?' selected':''}${inRange?' in-range':''}`} aria-pressed={selected} aria-label={new Intl.DateTimeFormat('ru-RU',{dateStyle:'full'}).format(day)} onClick={()=>select(value)}>{day.getDate()}</button>
    })}</div>
    <div className="date-range-summary"><span>{start?new Intl.DateTimeFormat('ru-RU',{dateStyle:'medium'}).format(fromIso(start)!):'Начало периода'}</span><span aria-hidden="true">—</span><span>{end?new Intl.DateTimeFormat('ru-RU',{dateStyle:'medium'}).format(fromIso(end)!):'Конец периода'}</span></div>
    <p className="meta">{start&&!end?'Выберите конечную дату. Повторяющиеся даты станут отдельными сеансами.':'Можно выбрать один день или период.'}</p>
  </div>;
}
