import type {SVGProps} from 'react';

type IconProps=SVGProps<SVGSVGElement>&{size?:number};
const Base=({size=20,children,...props}:IconProps)=> <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{children}</svg>;

export const LucideHeart=(props:IconProps)=><Base {...props}><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" /></Base>;
export const LucideUserPlus=(props:IconProps)=><Base {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></Base>;
export const LucideBookmark=(props:IconProps)=><Base {...props}><path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" /></Base>;
export const LucideArrowRight=(props:IconProps)=><Base {...props}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></Base>;
export const LucideBell=(props:IconProps)=><Base {...props}><path d="M10.268 21a2 2 0 0 0 3.464 0" /><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" /></Base>;
export const LucideCalendarPlus=(props:IconProps)=><Base {...props}><path d="M16 18h6M16 2v3M19 15v6" /><path d="M21 11.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.3M3 9h18M8 2v3" /></Base>;
export const LucideArrowLeft=(props:IconProps)=><Base {...props}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></Base>;
export const LucideX=(props:IconProps)=><Base {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></Base>;
export const LucidePause=(props:IconProps)=><Base {...props}><rect x="14" y="3" width="5" height="18" rx="1"/><rect x="5" y="3" width="5" height="18" rx="1"/></Base>;
export const LucidePlay=(props:IconProps)=><Base {...props}><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></Base>;
