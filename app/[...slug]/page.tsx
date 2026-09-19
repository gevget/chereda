import {Suspense} from 'react';
import {notFound} from 'next/navigation';
import {DemoPage} from '@/components/pages/demo-page';
import {categories} from '@/data/catalog';
import {initialCollections as seedCollections,profiles,projects} from '@/data/seed';

export function generateStaticParams(){
  const base=['feed','search','brief','crew-match','requests','venue-fit','passport','partners','radar','credits','pro','ratings','collections','favorites','me','notifications','settings','about','demo','register','professional','recommendations','subscriptions','favorites-pro','platform','pricing','support','offline','blog','faq','knowledge','video-lessons','webinars','api','complaint','404','error'].map(slug=>({slug:[slug]}));
  const pro=categories.map(category=>({slug:['pro',category.slug]}));
  const people=profiles.map(profile=>({slug:['profiles',profile.slug]}));
  const projectPages=projects.flatMap(project=>[{slug:['projects',project.slug]},{slug:['projects',project.slug,'room']}]);
  const collectionPages=seedCollections.flatMap(collection=>[{slug:['collections',collection.slug]},{slug:['collections',collection.slug,'board']}]);
  const partnerPages=[{slug:['partners','studio-chereda']}];
  const credits=profiles.map(profile=>({slug:['credits',profile.slug]}));
  return [...base,...pro,...people,...projectPages,...collectionPages,...partnerPages,...credits];
}
export default async function CatchAll({params}:{params:Promise<{slug:string[]}>}){const {slug}=await params;const path='/'+slug.join('/');const allowed=['feed','search','brief','crew-match','requests','venue-fit','passport','partners','radar','credits','pro','ratings','collections','favorites','me','notifications','settings','about','demo','register','professional','recommendations','subscriptions','favorites-pro','platform','pricing','support','offline','blog','faq','knowledge','video-lessons','webinars','api','complaint','404','error'];if(slug.length===1&&!allowed.includes(slug[0]))notFound();if(slug.length===2&&slug[0]==='pro'&&!categories.some(c=>c.slug===slug[1]))notFound();if(slug.length===2&&slug[0]==='profiles'&&!profiles.some(p=>p.slug===slug[1]))notFound();if(slug.length===2&&slug[0]==='projects'&&!projects.some(p=>p.slug===slug[1]))notFound();if(slug.length>3||slug.length===3&&!((slug[0]==='projects'&&slug[2]==='room')||(slug[0]==='collections'&&slug[2]==='board'))||slug.length===2&&!['pro','profiles','projects','collections','credits','partners'].includes(slug[0]))notFound();return <Suspense fallback={<main className="container page"><div className="empty">Загрузка…</div></main>}><DemoPage path={path}/></Suspense>}
