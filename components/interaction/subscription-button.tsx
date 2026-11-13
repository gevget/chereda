'use client';

import {useEffect,useState} from 'react';
import {useApp} from '@/components/navigation/app-shell';
import {LucideUserPlus} from '@/components/icons/lucide';
import {writeBrowserValue} from '@/data/browser-storage';

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
  const [ready,setReady]=useState(false);
  useEffect(()=>{queueMicrotask(()=>{setSubscribed(readSubscriptions().includes(profileId));setReady(true)})},[profileId]);
  const toggle=()=>{
    const current=readSubscriptions();
    const next=subscribed?current.filter(id=>id!==profileId):[...new Set([...current,profileId])];
    const persisted=writeBrowserValue(key,JSON.stringify(next));
    setSubscribed(!subscribed);
    app.toast(`${subscribed?'Подписка снята':'Профиль добавлен в подписки'}${persisted?'':' · только до закрытия вкладки'}`);
  };
  const label=subscribed?'Отменить подписку':'Подписаться';
  return <button className={iconOnly?'subscription-card-button icon-only':compact?'subscription-card-button':'button'} onClick={toggle} disabled={!ready} aria-pressed={subscribed} aria-label={label} title={label}>
    {iconOnly?(subscribed?'✓':<LucideUserPlus size={16}/>):<>{!subscribed&&<LucideUserPlus size={compact?16:18}/>} {subscribed?'Вы подписаны':'Подписаться'}</>}
  </button>;
}
