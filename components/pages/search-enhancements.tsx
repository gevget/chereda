'use client';

import {useEffect,useMemo,useRef,useState} from 'react';
import {CaretDown,MagnifyingGlass,X,CheckCircle} from '@phosphor-icons/react';
import {usePathname,useRouter,useSearchParams} from 'next/navigation';
import {categories,cities,cityName} from '@/data/catalog';
import {mediaById,projects} from '@/data/seed';

type PillKind='category'|'city'|'styles'|'sort'|null;

const styles=['editorial','botanical','современный','classic','minimal','лофт','романтичный','яркий'];
const suggestions=['Свадьба','Editorial','Концерт','Форум','Корпоратив','Съёмка','Вечеринка','Выпускной','Презентация'];

function useSearchControls(){
  const router=useRouter();
  const search=useSearchParams();
  const path=usePathname();
  const set=(changes:Record<string,string|null>)=>{const next=new URLSearchParams(search.toString());Object.entries(changes).forEach(([key,value])=>value?next.set(key,value):next.delete(key));router.push(`${path}?${next.toString()}`)};
  return {search,set};
}

function Pill({children,kind,open,onClick,count,onClear}:{children:React.ReactNode;kind:Exclude<PillKind,null>;open:boolean;onClick:()=>void;count?:number;onClear?:()=>void}){
  return <div className={`search-design-pill-wrap ${open?'is-open':''}`}><button type="button" className="search-design-pill" onClick={onClick}><span>{children}</span>{count ? <b className="search-count">{count}</b> : null}<CaretDown size={15} weight="bold"/></button>{onClear&&<button type="button" className="search-pill-clear" aria-label={`Очистить ${kind==='city'?'расположение':kind==='styles'?'стили':kind==='category'?'область творчества':'сортировку'}`} onClick={e=>{e.stopPropagation();onClear()}}><X size={14}/></button>}</div>
}

export function SearchDesignControls(){
  const {search,set}=useSearchControls();
  const [open,setOpen]=useState<PillKind>(null);
  const controlsRef=useRef<HTMLDivElement>(null);
  const [query,setQuery]=useState(search.get('q')??'');
  useEffect(()=>{queueMicrotask(()=>setQuery(search.get('q')??''))},[search]);
  useEffect(()=>{if(!open)return;const onPointerDown=(event:PointerEvent)=>{if(!controlsRef.current?.contains(event.target as Node))setOpen(null)};const onKeyDown=(event:KeyboardEvent)=>{if(event.key==='Escape')setOpen(null)};document.addEventListener('pointerdown',onPointerDown);document.addEventListener('keydown',onKeyDown);return()=>{document.removeEventListener('pointerdown',onPointerDown);document.removeEventListener('keydown',onKeyDown)}},[open]);
  const category=search.get('category')??'';
  const city=search.get('city')??'';
  const selectedStyles=useMemo(()=>((search.get('styles')??'').split(',').map(v=>v.trim()).filter(Boolean)),[search]);
  const sort=search.get('sort')??'recommended';
  const selectedCategory=categories.find(c=>c.slug===category);
  const commitQuery=(value:string)=>set({q:value.trim()||null});
  const toggleStyle=(value:string)=>{const next=selectedStyles.includes(value)?selectedStyles.filter(v=>v!==value):[...selectedStyles,value];set({styles:next.length?next.join(','):null})};
  const suggestionsData=suggestions.map((label,index)=>({label,src:mediaById(projects[index%projects.length].mediaIds[index%projects[index%projects.length].mediaIds.length]).src}));
  return <div className="search-design-controls" ref={controlsRef}>
    <div className="search-design-filter-row">
      <form className="search-design-query search-design-pill-wrap" onSubmit={e=>{e.preventDefault();commitQuery(query)}}><div className="search-design-pill"><MagnifyingGlass size={16}/><input aria-label="Введённый запрос" value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')commitQuery(query)}} placeholder="Введите запрос"/>{query&&<button type="button" className="search-pill-clear inline" aria-label="Удалить запрос" onClick={()=>{setQuery('');set({q:null})}}><X size={14}/></button>}</div></form>
      <Pill kind="category" open={open==='category'} onClick={()=>setOpen(open==='category'?null:'category')} count={category?1:0} onClear={category?()=>set({category:null}):undefined}>{selectedCategory?.name??'Область творчества'}</Pill>
      <Pill kind="city" open={open==='city'} onClick={()=>setOpen(open==='city'?null:'city')} count={city?1:0} onClear={city?()=>set({city:null}):undefined}>{city?cityName(city):'Расположение'}</Pill>
      <Pill kind="styles" open={open==='styles'} onClick={()=>setOpen(open==='styles'?null:'styles')} count={selectedStyles.length} onClear={selectedStyles.length?()=>set({styles:null}):undefined}>{selectedStyles.length?'Выбрано':'Все стили'}</Pill>
      <Pill kind="sort" open={open==='sort'} onClick={()=>setOpen(open==='sort'?null:'sort')}>{sort==='rating'?'По рейтингу':sort==='new'?'Сначала новые':'Рекомендуемые'}</Pill>
    </div>
    {open==='category'&&<div className="search-design-menu menu-category">{categories.map(c=><button type="button" className={category===c.slug?'selected':''} key={c.slug} onClick={()=>{set({category:category===c.slug?null:c.slug});setOpen(null)}}>{c.name}</button>)}</div>}
    {open==='city'&&<div className="search-design-menu menu-city">{cities.map(c=><button type="button" className={city===c.slug?'selected':''} key={c.slug} onClick={()=>{set({city:city===c.slug?null:c.slug});setOpen(null)}}>{c.name}</button>)}</div>}
    {open==='styles'&&<div className="search-design-menu menu-styles styles-menu">{styles.map(style=><button type="button" className={selectedStyles.includes(style)?'selected':''} key={style} onClick={()=>toggleStyle(style)}>{style}{selectedStyles.includes(style)?<CheckCircle size={15} aria-hidden="true"/>:null}</button>)}<button type="button" className="menu-done" onClick={()=>setOpen(null)}>Готово</button></div>}
    {open==='sort'&&<div className="search-design-menu menu-sort">{[['recommended','Рекомендуемые'],['new','Сначала новые'],['rating','По рейтингу']].map(([value,label])=><button type="button" className={sort===value?'selected':''} key={value} onClick={()=>{set({sort:value});setOpen(null)}}>{label}</button>)}</div>}
    <div className="search-suggestion-block"><h2>Предложения</h2><div className="search-suggestion-row">{suggestionsData.map(item=><button type="button" className="search-suggestion" key={item.label} onClick={()=>{setQuery(item.label);commitQuery(item.label)}}><img src={item.src} alt=""/><span>{item.label}</span></button>)}</div></div>
    <div className="search-quick-tags" aria-label="Быстрые теги">{['Фотограф','Фотостудия','Фотосъёмка','Свадьба','Декорация','Съёмка','Организация'].map(tag=><button type="button" className="search-quick-tag" key={tag} onClick={()=>{setQuery(tag);commitQuery(tag)}}>{tag}</button>)}</div>
  </div>;
}
