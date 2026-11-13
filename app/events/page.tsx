import {Suspense} from 'react';
import {EventsPage} from '@/components/pages/events-page';
export default function Page(){return <Suspense fallback={<main className="container page"><div className="empty">Загружаем афишу…</div></main>}><EventsPage/></Suspense>}
