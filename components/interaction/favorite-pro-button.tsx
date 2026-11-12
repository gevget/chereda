'use client';

import {useEffect,useState} from 'react';
import {useApp} from '@/components/navigation/app-shell';
import {LucideBookmark} from '@/components/icons/lucide';

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
  useEffect(()=>{queueMicrotask(()=>setSaved(readFavorites().includes(profileId)))},[profileId]);
  const toggle=()=>{
    const current=readFavorites();
    const next=current.includes(profileId)?current.filter(id=>id!==profileId):[...current,profileId];
    localStorage.setItem(key,JSON.stringify(next));
    setSaved(next.includes(profileId));
    app.toast(next.includes(profileId)?'Профиль добавлен в избранное PRO':'Профиль убран из избранного PRO');
  };
  const label=saved?`Убрать ${name} из избранного PRO`:`Сохранить ${name} в избранное PRO`;
  return <button className="pro-catalog-save" onClick={toggle} aria-label={label} aria-pressed={saved} title={label}><LucideBookmark size={17}/></button>;
}
