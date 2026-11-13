'use client'

import {useEffect,useState} from 'react'
import Link from 'next/link'
import {ArrowRight,CalendarBlank,ChatCircle,MapPin,UsersThree} from '@phosphor-icons/react'
import {cityName} from '@/data/catalog'
import {readBrowserValue} from '@/data/browser-storage'
import {profiles,projects,services} from '@/data/seed'

type ViewerRequest={
 profileId:string;profileName?:string;projectId?:string;serviceId?:string;serviceName?:string
 eventCity?:string;eventDate?:string;guestCount?:number;contactName?:string;preferredChannel?:string
 contactValue?:string;contactEmail?:string;message?:string;date?:string
}

function readRequests(){
 const raw=readBrowserValue('chereda-requests')
 if(!raw)return [] as ViewerRequest[]
 const parsed:unknown=JSON.parse(raw)
 if(!Array.isArray(parsed))throw new Error('invalid-request-list')
 return parsed.filter((item):item is ViewerRequest=>!!item&&typeof item==='object'&&typeof (item as ViewerRequest).profileId==='string')
}

export function ViewerRequests(){
 const [requests,setRequests]=useState<ViewerRequest[]>([])
 const [ready,setReady]=useState(false)
 const [error,setError]=useState(false)
 useEffect(()=>{queueMicrotask(()=>{try{setRequests(readRequests())}catch{setError(true)}finally{setReady(true)}})},[])
 const recover=()=>{try{localStorage.removeItem('chereda-requests');setRequests([]);setError(false)}catch{setError(true)}}
 if(!ready)return <div className="page-loading" role="status" aria-busy="true">Восстанавливаем локальные заявки…</div>
 if(error)return <div className="empty viewer-empty" role="alert"><h3>Не удалось прочитать локальные заявки</h3><p>Список хранится только в этом браузере. Его можно сбросить и продолжить работу.</p><button className="button" onClick={recover}>Сбросить повреждённый список</button></div>
 if(!requests.length)return <div className="empty viewer-empty"><h3>Заявок пока нет</h3><p>Выберите специалиста в проекте или каталоге PRO. Сохранённые demo-заявки появятся здесь.</p><Link className="button primary" href="/pro">Открыть PRO-каталог <ArrowRight size={16}/></Link></div>
 return <div className="viewer-request-list" aria-label="Сохранённые demo-заявки">{[...requests].reverse().map((request,index)=>{
  const profile=profiles.find(item=>item.id===request.profileId)
  const project=projects.find(item=>item.id===request.projectId)
  const service=services.find(item=>item.id===request.serviceId)
  const contact=request.contactValue||request.contactEmail
  return <article className="card card-body viewer-request-card" key={`${request.date??'request'}-${request.profileId}-${index}`}>
   <div className="between wrap"><div><div className="eyebrow">Demo-заявка · сохранена в этом браузере</div><h3>{profile?.name??request.profileName??'Профиль специалиста'}</h3></div><span className="badge">{request.date?new Date(request.date).toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'}):'Локально'}</span></div>
   {(service?.name||request.serviceName)&&<p className="viewer-request-service">Услуга: <b>{service?.name??request.serviceName}</b></p>}
   <div className="viewer-request-facts">{request.eventCity&&<span><MapPin size={16}/>{cityName(request.eventCity)}</span>}{request.eventDate&&<span><CalendarBlank size={16}/>{new Date(`${request.eventDate}T12:00:00`).toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'})}</span>}{request.guestCount&&<span><UsersThree size={16}/>{request.guestCount} гостей</span>}{contact&&<span><ChatCircle size={16}/>{request.preferredChannel??'Контакт'} · {contact}</span>}</div>
   {request.message&&<p className="viewer-request-message">{request.message}</p>}
   <div className="row wrap viewer-request-links">{profile&&<Link className="button" href={`/profiles/${profile.slug}`}>Открыть профиль <ArrowRight size={15}/></Link>}{project&&<Link className="button" href={`/projects/${project.slug}`}>Открыть проект <ArrowRight size={15}/></Link>}</div>
  </article>
 })}</div>
}
