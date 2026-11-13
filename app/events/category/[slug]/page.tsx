import {Suspense} from 'react';
import {EventsCategoryPage} from '@/components/pages/events-page';
export function generateStaticParams(){return [{slug:'art-culture'},{slug:'education'},{slug:'business'}]}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <Suspense fallback={<main className="container page"><div className="empty">Загружаем категорию…</div></main>}><EventsCategoryPage slug={slug}/></Suspense>}
