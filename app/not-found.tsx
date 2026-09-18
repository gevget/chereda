import Link from 'next/link';
export default function NotFound(){return <main className="container page"><h1>Страница не найдена</h1><p>Проверьте адрес или вернитесь в ленту.</p><Link className="button primary" href="/feed">Открыть ленту</Link></main>}
