'use client';
import Link from 'next/link';
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="container page"><h1>Не удалось загрузить Chereda</h1><p>Повторите попытку или вернитесь в ленту.</p><div className="row"><button className="button" onClick={reset}>Повторить</button><Link className="button" href="/feed">В ленту</Link></div></main>}
