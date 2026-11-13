'use client';

import {useEffect,useState} from 'react';
import {useApp} from '@/components/navigation/app-shell';
import {LucideBookmark} from '@/components/icons/lucide';
import {writeBrowserValue} from '@/data/browser-storage';

const key='chereda-favorites-pro';

function readFavorites(){
  try{
    const parsed=JSON.parse(localStorage.getItem(key)||'[]');
    return Array.isArray(parsed)?parsed.filter((id):id is string=>typeof id==='string'):[];
  }catch{return []}
}

export function FavoriteProButton({profileId,name}:{profileId:string;name:string}){
  const app=useApp();
  const [saved,setSaved]=useState(false);
  const [ready,setReady]=useState(false);
  useEffect(()=>{queueMicrotask(()=>{setSaved(readFavorites().includes(profileId));setReady(true)})},[profileId]);
  const toggle=()=>{
    const current=readFavorites();
    const next=saved?current.filter(id=>id!==profileId):[...new Set([...current,profileId])];
    const persisted=writeBrowserValue(key,JSON.stringify(next));
    setSaved(!saved);
    app.toast(`${saved?'Профиль убран из избранного PRO':'Профиль добавлен в избранное PRO'}${persisted?'':' · только до закрытия вкладки'}`);
  };
  const label=saved?`Убрать ${name} из избранного PRO`:`Сохранить ${name} в избранное PRO`;
  return <button className="pro-catalog-save" onClick={toggle} disabled={!ready} aria-label={label} aria-pressed={saved} title={label}><LucideBookmark size={17}/></button>;
}
