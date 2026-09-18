import type {Metadata} from 'next';
import type {CSSProperties} from 'react';
import Script from 'next/script';
import './globals.css';
import {AppShell} from '@/components/navigation/app-shell';
export const metadata:Metadata={title:'Chereda — визуальный поиск событий',description:'Демонстрация платформы Chereda: проекты, команды и специалисты событий.'};
const themeScript="try{var s=JSON.parse(localStorage.getItem('chereda-demo-v1')||'{}');var t=s.theme||'system';document.documentElement.dataset.theme=t==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t}catch(e){}";
const mediaBasePath=process.env.NEXT_PUBLIC_BASE_PATH??'';
const bodyStyle={'--hero-media':`url('${mediaBasePath}/media/projects/project-01-03.svg')`} as CSSProperties;
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru" data-scroll-behavior="smooth" suppressHydrationWarning><body style={bodyStyle}><Script id="chereda-theme" strategy="beforeInteractive">{themeScript}</Script><AppShell>{children}</AppShell></body></html>}
