'use client';

import Link from 'next/link';
import {useCallback,useEffect,useMemo,useRef,useState,type MouseEvent,type TouchEvent} from 'react';
import {profiles,projects,mediaById} from '@/data/seed';
import {LucideArrowLeft,LucideArrowRight,LucidePause,LucidePlay,LucideX} from '@/components/icons/lucide';
import {withReturnTo} from '@/components/navigation/return-context';

const topics=[
  {name:'Свадьба',projects:['white-garden-wedding','new-classic-wedding','project-11','project-16']},
  {name:'Editorial',projects:['white-garden-wedding','new-classic-wedding','northern-light-awards','project-11']},
  {name:'Площадки',projects:['quiet-shore-dinner','desert-bloom-dinner','assembly-point-team','project-12']},
  {name:'Beauty',projects:['white-garden-wedding','new-classic-wedding','paper-moon-kids','project-15']},
  {name:'Форум',projects:['city-pulse-forum','assembly-point-team','northern-light-awards','project-14']},
  {name:'Декор',projects:['white-garden-wedding','neon-garden-launch','new-classic-wedding','desert-bloom-dinner']},
  {name:'Музыка',projects:['signal-music-night','neon-garden-launch','city-pulse-forum','project-18']},
  {name:'Кейтеринг',projects:['quiet-shore-dinner','desert-bloom-dinner','white-garden-wedding','project-15']},
];

const reelStories=topics.map(topic=>({
  name:topic.name,
  frames:topic.projects.map(slug=>projects.find(project=>project.slug===slug)).filter((project):project is (typeof projects)[number]=>Boolean(project)).map(project=>({
    project,
    media:mediaById(project.mediaIds[0]),
    lead:profiles.find(profile=>profile.id===project.leadProfileId),
  })),
})).filter(story=>story.frames.length>0);

const duration=6500;

export function FeedReels({returnTo='/feed'}:{returnTo?:string}){
  const [activeStory,setActiveStory]=useState<number|null>(null);
  const [frameIndex,setFrameIndex]=useState(0);
  const [paused,setPaused]=useState(false);
  const [reducedMotion,setReducedMotion]=useState(false);
  const overlayRef=useRef<HTMLDivElement>(null);
  const closeButtonRef=useRef<HTMLButtonElement>(null);
  const returnFocusRef=useRef<HTMLElement|null>(null);
  const touchStartX=useRef<number|null>(null);
  const navigationRef=useRef<{next:()=>void;previous:()=>void}>({next:()=>{},previous:()=>{}});
  const currentStory=activeStory===null?undefined:reelStories[activeStory];
  const currentFrame=currentStory?.frames[frameIndex];
  const isOpen=activeStory!==null&&Boolean(currentFrame);

  const close=useCallback(()=>{setActiveStory(null);setFrameIndex(0);setPaused(false)},[]);
  const next=useCallback(()=>{
    if(activeStory===null||!currentStory)return;
    if(frameIndex+1<currentStory.frames.length){setFrameIndex(frameIndex+1);return}
    if(activeStory+1<reelStories.length){setActiveStory(activeStory+1);setFrameIndex(0);return}
    close();
  },[activeStory,currentStory,frameIndex,close]);
  const previous=useCallback(()=>{
    if(activeStory===null||!currentStory)return;
    if(frameIndex>0){setFrameIndex(frameIndex-1);return}
    if(activeStory>0){const previousStory=activeStory-1;setActiveStory(previousStory);setFrameIndex(reelStories[previousStory].frames.length-1)}
  },[activeStory,currentStory,frameIndex]);
  useEffect(()=>{navigationRef.current={next,previous}},[next,previous]);

  const open=(index:number,event:MouseEvent<HTMLButtonElement>)=>{
    returnFocusRef.current=event.currentTarget;
    setActiveStory(index);setFrameIndex(0);setPaused(false);
  };

  useEffect(()=>{
    const query=window.matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>setReducedMotion(query.matches);
    update();query.addEventListener('change',update);
    return()=>query.removeEventListener('change',update);
  },[]);

  useEffect(()=>{
    if(!isOpen)return;
    const oldOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    closeButtonRef.current?.focus();
    const onKeyDown=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){event.preventDefault();close();return}
      if(event.key==='ArrowRight'){event.preventDefault();navigationRef.current.next();return}
      if(event.key==='ArrowLeft'){event.preventDefault();navigationRef.current.previous();return}
      if(event.key==='Tab'&&overlayRef.current){
        const focusable=Array.from(overlayRef.current.querySelectorAll<HTMLElement>('button:not([disabled]),a[href]'));
        const first=focusable[0];const last=focusable[focusable.length-1];
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
      }
    };
    window.addEventListener('keydown',onKeyDown);
    return()=>{
      window.removeEventListener('keydown',onKeyDown);
      document.body.style.overflow=oldOverflow;
      if(returnFocusRef.current?.isConnected)returnFocusRef.current.focus();
    };
  },[isOpen,close]);

  useEffect(()=>{
    if(!isOpen||paused||reducedMotion)return;
    const timer=window.setTimeout(()=>navigationRef.current.next(),duration);
    return()=>window.clearTimeout(timer);
  },[isOpen,activeStory,frameIndex,paused,reducedMotion]);

  const covers=useMemo(()=>reelStories.map(story=>story.frames[0]),[]);
  const handleTouchStart=(event:TouchEvent<HTMLElement>)=>{touchStartX.current=event.changedTouches[0]?.clientX??null};
  const handleTouchEnd=(event:TouchEvent<HTMLElement>)=>{
    if(touchStartX.current===null)return;
    const distance=event.changedTouches[0].clientX-touchStartX.current;
    if(Math.abs(distance)>48){if(distance<0)navigationRef.current.next();else navigationRef.current.previous()}
    touchStartX.current=null;
  };

  return <>
    <div className="story-rail" aria-label="Рилсы по темам">
      {reelStories.map((story,index)=><button className="story" type="button" key={story.name} onClick={event=>open(index,event)} aria-label={`Открыть рилс: ${story.name}`}>
        <span className="story-images"><img src={covers[index]?.media.src} alt="" loading="lazy"/></span>
        <span>{story.name}</span>
      </button>)}
    </div>
    {isOpen&&currentStory&&currentFrame&&<div className="feed-reels-overlay" ref={overlayRef} role="dialog" aria-modal="true" aria-label={`Рилс «${currentStory.name}»`} onMouseDown={event=>{if(event.target===event.currentTarget)close()}}>
      <button className="feed-reel-nav feed-reel-prev" type="button" aria-label="Предыдущий кадр" onClick={previous} disabled={activeStory===0&&frameIndex===0}><LucideArrowLeft size={20}/></button>
      <article className="feed-reel-player" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <img className="feed-reel-image" src={currentFrame.media.src} alt={`${currentStory.name}: ${currentFrame.media.alt}`} />
        <div className="feed-reel-shade" aria-hidden="true"/>
        <header className="feed-reel-topbar">
          <div className="feed-reel-progress" aria-label={`Кадр ${frameIndex+1} из ${currentStory.frames.length}`}>
            {currentStory.frames.map((_,index)=><button type="button" key={index} aria-label={`Перейти к кадру ${index+1}`} aria-current={index===frameIndex?'step':undefined} onClick={()=>setFrameIndex(index)}><span className={index<frameIndex?'complete':index===frameIndex?'playing':''} style={index===frameIndex?{animationDuration:`${duration}ms`,animationPlayState:paused||reducedMotion?'paused':'running'}:undefined}/></button>)}
          </div>
          <div className="feed-reel-top-actions">
            <button type="button" className="feed-reel-control" aria-label={paused?'Продолжить рилс':'Приостановить рилс'} title={paused?'Продолжить':'Пауза'} onClick={()=>setPaused(value=>!value)}>{paused?<LucidePlay size={19}/>:<LucidePause size={19}/>}</button>
            <button ref={closeButtonRef} type="button" className="feed-reel-control" aria-label="Закрыть рилс" title="Закрыть" onClick={close}><LucideX size={20}/></button>
          </div>
        </header>
        <div className="feed-reel-caption" aria-live="polite">
          <span className="feed-reel-topic">#{currentStory.name.toLocaleLowerCase('ru-RU')}</span>
          <h2>{currentFrame.project.title}</h2>
          <p>{currentFrame.media.caption||currentFrame.media.alt}</p>
          {currentFrame.lead&&<Link className="feed-reel-author" href={withReturnTo(`/profiles/${currentFrame.lead.slug}`,returnTo)} onClick={close}><img src={currentFrame.lead.avatar} alt=""/><span>{currentFrame.lead.name}</span></Link>}
          <Link className="feed-reel-project" href={withReturnTo(`/projects/${currentFrame.project.slug}?media=0&from=feed`,returnTo)} onClick={close}>Открыть проект <LucideArrowRight size={17}/></Link>
        </div>
      </article>
      <button className="feed-reel-nav feed-reel-next" type="button" aria-label={activeStory===reelStories.length-1&&frameIndex===currentStory.frames.length-1?'Завершить просмотр':'Следующий кадр'} onClick={next}><LucideArrowRight size={20}/></button>
    </div>}
  </>;
}
