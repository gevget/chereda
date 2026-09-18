from pathlib import Path
import json
from datetime import date

root=Path(__file__).resolve().parents[1]/'public'/'media'
for sub in ('projects','avatars','covers'):(root/sub).mkdir(parents=True,exist_ok=True)
palette=['#d9dfd7','#eadfce','#d9d7d2','#cdd6da','#e4d7d3','#d8e0dc','#dedbd3','#d9d4df']
ink=['#527066','#8a6f61','#596777','#555d5c','#8c6b74','#627d78','#8a8068','#706887']
manifest=[]
project_slugs=['white-garden-wedding','neon-garden-launch','quiet-shore-dinner','city-pulse-forum','assembly-point-team','northern-light-awards','desert-bloom-dinner','new-classic-wedding','signal-music-night','paper-moon-kids']+[f'project-{i}' for i in range(11,31)]
for i in range(30):
 for j in range(8):
  n=i*8+j; bg=palette[(i+j)%8]; fg=ink[(i*3+j)%8];
  x=70+(n*53)%350;y=220+(n*29)%130
  svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900"><rect width="1200" height="900" fill="{bg}"/><path d="M0 610 Q300 {450+n%80} 600 600 T1200 540 V900 H0Z" fill="{fg}" opacity=".23"/><rect x="{x}" y="{y}" width="{420+n%140}" height="410" rx="12" fill="#fff" opacity=".42"/><path d="M{x+25} 590 L{x+205} {260+n%120} L{x+420} 590Z" fill="{fg}" opacity=".38"/><circle cx="{800+n%150}" cy="{250+n%120}" r="{110+n%60}" fill="#fff" opacity=".5"/><path d="M0 730 H1200" stroke="{fg}" stroke-width="10" opacity=".25"/><text x="60" y="830" fill="{fg}" font-family="Arial,sans-serif" font-size="30" letter-spacing="4">CHEREDA · ДЕМО-ВИЗУАЛ</text></svg>'''
  name=f'project-{i+1:02d}-{j+1:02d}.svg';(root/'projects'/name).write_text(svg,encoding='utf8')
  manifest.append(dict(id=f'media-{i+1}-{j+1}',file=f'projects/{name}',source='local-generated',sourceUrl='',author='Chereda demo',licenseUrl='project-local',downloadedAt=str(date.today()),mediaType='illustration',width=1200,height=900,alt=f'Нейтральная демонстрационная композиция проекта {i+1}, кадр {j+1}',projectId=project_slugs[i],isDemoStock=False,isDemoContent=True))
for i in range(72):
 bg=palette[i%8];fg=ink[i%8]
 avatar=f'''<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320"><rect width="320" height="320" fill="{bg}"/><circle cx="{145+i%31}" cy="{113+i%19}" r="{57+i%21}" fill="{fg}" opacity=".6"/><path d="M{25+i%29} 320 Q40 {195+i%27} 160 205 T{275+i%27} 320" fill="{fg}" opacity=".6"/></svg>'''
 (root/'avatars'/f'avatar-{i+1:02d}.svg').write_text(avatar,encoding='utf8')
 cover=f'''<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="600"><rect width="1600" height="600" fill="{bg}"/><path d="M0 500 Q400 {80+i%180} 800 370 T1600 190 V600 H0" fill="{fg}" opacity=".5"/><circle cx="{1050+(i*37)%300}" cy="200" r="120" fill="#fff" opacity=".45"/><text x="60" y="540" fill="{fg}" font-family="Arial,sans-serif" font-size="32" letter-spacing="4">CHEREDA · ДЕМО-ПРОФИЛЬ</text></svg>'''
 (root/'covers'/f'cover-{i+1:02d}.svg').write_text(cover,encoding='utf8')
(root/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf8')
