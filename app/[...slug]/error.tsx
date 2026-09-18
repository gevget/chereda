'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="container page"><h1>Не удалось открыть страницу</h1><p>Попробуйте ещё раз.</p><button className="button" onClick={reset}>Повторить</button></main>}
