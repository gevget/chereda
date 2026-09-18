import {Suspense} from 'react';
import {notFound} from 'next/navigation';
import {DemoPage} from '@/components/pages/demo-page';
import {categories} from '@/data/catalog';
import {initialCollections as seedCollections,profiles,projects} from '@/data/seed';

export function generateStaticParams(){
  const base=['feed','search','pro','ratings','collections','favorites','me','notifications','settings','about','demo','register','professional','recommendations','subscriptions','favorites-pro','platform','support','offline','blog','faq','knowledge','video-lessons','webinars','api','complaint','404','error'].map(slug=>({slug:[slug]}));
  const pro=categories.map(category=>({slug:['pro',category.slug]}));
  const people=profiles.map(profile=>({slug:['profiles',profile.slug]}));
  const projectPages=projects.map(project=>({slug:['projects',project.slug]}));
  const collectionPages=seedCollections.map(collection=>({slug:['collections',collection.slug]}));
  return [...base,...pro,...people,...projectPages,...collectionPages];
}
export default async function CatchAll({params}:{params:Promise<{slug:string[]}>}){const {slug}=await params;const path='/'+slug.join('/');const allowed=['feed','search','pro','ratings','collections','favorites','me','notifications','settings','about','demo','register','professional','recommendations','subscriptions','favorites-pro','platform','support','offline','blog','faq','knowledge','video-lessons','webinars','api','complaint','404','error'];if(slug.length===1&&!allowed.includes(slug[0]))notFound();if(slug.length===2&&slug[0]==='pro'&&!categories.some(c=>c.slug===slug[1]))notFound();if(slug.length===2&&slug[0]==='profiles'&&!profiles.some(p=>p.slug===slug[1]))notFound();if(slug.length===2&&slug[0]==='projects'&&!projects.some(p=>p.slug===slug[1]))notFound();if(slug.length>2||slug.length===2&&!['pro','profiles','projects','collections'].includes(slug[0]))notFound();return <Suspense fallback={<main className="container page"><div className="empty">Загрузка…</div></main>}><DemoPage path={path}/></Suspense>}
