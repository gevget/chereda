'use client';

import {useEffect,useState} from 'react';
import {useApp} from '@/components/navigation/app-shell';
import {LucideUserPlus} from '@/components/icons/lucide';

const key='chereda-subscriptions';

function readSubscriptions(){
  try{
    const parsed=JSON.parse(localStorage.getItem(key)||'[]');
    return Array.isArray(parsed)?parsed.filter((id):id is string=>typeof id==='string'):[];
  }catch{return []}
}

export function SubscriptionButton({profileId,compact=false,iconOnly=false}:{profileId:string;compact?:boolean;iconOnly?:boolean}){
  const app=useApp();
  const [subscribed,setSubscribed]=useState(false);
  useEffect(()=>{queueMicrotask(()=>setSubscribed(readSubscriptions().includes(profileId)))},[profileId]);
  const toggle=()=>{
    const current=readSubscriptions();
    const next=current.includes(profileId)?current.filter(id=>id!==profileId):[...current,profileId];
    localStorage.setItem(key,JSON.stringify(next));
    setSubscribed(next.includes(profileId));
    app.toast(next.includes(profileId)?'Профиль добавлен в подписки':'Подписка снята');
  };
  const label=subscribed?'Отменить подписку':'Подписаться';
  return <button className={iconOnly?'subscription-card-button icon-only':compact?'subscription-card-button':'button'} onClick={toggle} aria-pressed={subscribed} aria-label={label} title={label}>
    {iconOnly?(subscribed?'✓':<LucideUserPlus size={16}/>):<>{!subscribed&&<LucideUserPlus size={compact?16:18}/>} {subscribed?'Вы подписаны':'Подписаться'}</>}
  </button>;
}
