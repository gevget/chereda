import {Suspense} from 'react';
import {EventsCategoryPage} from '@/components/pages/events-page';
import {eventCategories} from '@/data/event-categories';
export function generateStaticParams(){return eventCategories.map(({slug})=>({slug}))}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <Suspense fallback={<main className="container page"><div className="empty">Загружаем категорию…</div></main>}><EventsCategoryPage slug={slug}/></Suspense>}
