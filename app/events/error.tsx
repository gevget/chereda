'use client';

export default function Error({reset}:{error:Error&{digest?:string};reset:()=>void}){
  return <main className="container page"><div className="empty" role="alert"><h1>Не удалось открыть раздел событий</h1><p>Попробуйте загрузить страницу ещё раз.</p><button className="button primary" onClick={()=>reset()}>Повторить</button></div></main>
}
