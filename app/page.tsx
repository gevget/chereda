import {Suspense} from 'react';
import {DemoPage} from '@/components/pages/demo-page';

export default function Home(){return <Suspense fallback={<main className="container page"><div className="empty">Загрузка…</div></main>}><DemoPage path="/feed"/></Suspense>}
