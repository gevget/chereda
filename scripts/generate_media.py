from pathlib import Path
import json
from datetime import date

root=Path(__file__).resolve().parents[1]/'public'/'media'
for sub in ('projects','avatars','covers'):(root/sub).mkdir(parents=True,exist_ok=True)
palette=['#d9dfd7','#eadfce','#d9d7d2','#cdd6da','#e4d7d3','#d8e0dc','#dedbd3','#d9d4df']
ink=['#527066','#8a6f61','#596777','#555d5c','#8c6b74','#627d78','#8a8068','#706887']
manifest=[]
project_slugs=['white-garden-wedding','neon-garden-launch','quiet-shore-dinner','city-pulse-forum','assembly-point-team','northern-light-awards','desert-bloom-dinner','new-classic-wedding','signal-music-night','paper-moon-kids']+[f'project-{i}' for i in range(11,31)]
event_types=['свадьба','презентация бренда','частный ужин','форум','тимбилдинг','премия','частное событие','свадьба','концерт','детское событие']+[['свадьба','корпоратив','презентация бренда','форум','частный ужин'][i%5] for i in range(20)]
project_media_sets={
 'свадьба':[1,2,3,4,13,14,16,10], 'презентация бренда':[5,6,7,9,11,12,15,8],
 'частный ужин':[1,3,4,13,14,16,10,2], 'форум':[5,8,9,11,15,6,10,12],
 'тимбилдинг':[5,8,9,10,11,15,6,3], 'премия':[4,5,6,7,8,11,12,15],
 'частное событие':[1,2,3,4,10,13,14,16], 'концерт':[6,7,8,11,12,15,5,9],
 'детское событие':[1,2,3,13,14,16,10,4], 'корпоратив':[5,8,9,10,11,15,6,3]
}
project_additions={
 2:dict(file='stock/project-01-02.webp',sourceUrl='https://unsplash.com/photos/a-table-set-for-a-formal-dinner-with-white-flowers-and-greenery-ufpn_xkqlss',author='Thomas Beaman',authorUrl='https://unsplash.com/@paunveiled',width=1800,height=1200,alt='Светлый зал, длинные столы и белая с зеленью цветочная композиция',recognizablePeople=False),
 3:dict(file='stock/project-01-03.webp',sourceUrl='https://unsplash.com/photos/bohemian-wedding-reception-decor-with-hanging-lights-and-plants-kDcSx6Cqs0w',author='Andreea Avramescu',authorUrl='https://unsplash.com/@minakko',width=1800,height=2700,alt='Зал для ужина с подвесными светильниками и зеленью',recognizablePeople=False),
 4:dict(file='stock/project-01-04.webp',sourceUrl='https://unsplash.com/photos/bride-getting-hair-styled-before-wedding-oJ9JC4wwFBY',author='Alexander Mass',authorUrl='https://unsplash.com/@alexandermassph',width=1800,height=2700,alt='Стилист помогает невесте подготовиться к свадебной церемонии',recognizablePeople=True),
 5:dict(file='stock/project-01-05.webp',sourceUrl='https://unsplash.com/photos/a-large-bouquet-of-flowers-on-a-table-qoEl30StL3A',author='Karen Cann',authorUrl='https://unsplash.com/@karenjac',width=1800,height=2400,alt='Нежная цветочная композиция под светлым тканевым шатром',recognizablePeople=False),
 6:dict(file='stock/project-01-06.webp',sourceUrl='https://unsplash.com/photos/a-wedding-arch-with-flowers-and-greenery-on-it-0UFg3dkJVCU',author='Khrystyna Shevtsiv',authorUrl='https://unsplash.com/@chriswind',width=1800,height=1200,alt='Свадебная церемония под деревянной аркой с цветами и белой тканью',recognizablePeople=False),
 7:dict(file='stock/project-01-07.webp',sourceUrl='https://unsplash.com/photos/wedding-table-setting-with-floral-arrangements-and-candles-IAXH4tMEx_s',author='Jen Vazquez',authorUrl='https://unsplash.com/@jenvazquezmedia',width=1800,height=1198,alt='Стол для церемонии с зелёными свечами и цветочной композицией',recognizablePeople=False)
}
used_photos=set()
for i in range(30):
 photo=next((n for n in project_media_sets[event_types[i]] if n not in used_photos),None)
 if photo is not None: used_photos.add(photo)
 for j in range(8):
  n=i*8+j; bg=palette[(i+j)%8]; fg=ink[(i*3+j)%8];
  x=70+(n*53)%350;y=220+(n*29)%130
  extra=project_additions.get(j+1) if i==0 else None
  svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900"><rect width="1200" height="900" fill="{bg}"/><path d="M0 610 Q300 {450+n%80} 600 600 T1200 540 V900 H0Z" fill="{fg}" opacity=".23"/><rect x="{x}" y="{y}" width="{420+n%140}" height="410" rx="12" fill="#fff" opacity=".42"/><path d="M{x+25} 590 L{x+205} {260+n%120} L{x+420} 590Z" fill="{fg}" opacity=".38"/><circle cx="{800+n%150}" cy="{250+n%120}" r="{110+n%60}" fill="#fff" opacity=".5"/><path d="M0 730 H1200" stroke="{fg}" stroke-width="10" opacity=".25"/><text x="60" y="830" fill="{fg}" font-family="Arial,sans-serif" font-size="30" letter-spacing="4">CHEREDA · ДЕМО-ВИЗУАЛ</text></svg>'''
  name=f'project-{i+1:02d}-{j+1:02d}.svg'
  if extra is None:(root/'projects'/name).write_text(svg,encoding='utf8')
  if j==0 and photo is not None:
   manifest.append(dict(id=f'media-{i+1}-{j+1}',file=f'stock/project-{photo:02d}.webp',source='existing-local-stock',sourceUrl='',author='Source metadata unavailable',licenseUrl='not-recorded',downloadedAt='',mediaType='photograph',width=1600,height=1200,alt=f'Демонстрационная фотография события «{event_types[i]}»',projectId=project_slugs[i],isDemoStock=True,isDemoContent=True))
  elif extra is not None:
   manifest.append(dict(id=f'media-{i+1}-{j+1}',source='unsplash',licenseUrl='https://unsplash.com/license',downloadedAt='2026-11-13',mediaType='photograph',projectId=project_slugs[i],isDemoStock=True,isDemoContent=True,recognizableBrands=False,**extra))
  else:
   manifest.append(dict(id=f'media-{i+1}-{j+1}',file=f'projects/{name}',source='local-generated',sourceUrl='',author='Chereda demo',licenseUrl='project-local',downloadedAt='',mediaType='illustration',width=1200,height=900,alt=f'Локальная демо-иллюстрация проекта {i+1}, кадр {j+1}',projectId=project_slugs[i],isDemoStock=False,isDemoContent=True))
for i in range(72):
 bg=palette[i%8];fg=ink[i%8]
 avatar=f'''<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320"><rect width="320" height="320" fill="{bg}"/><circle cx="{145+i%31}" cy="{113+i%19}" r="{57+i%21}" fill="{fg}" opacity=".6"/><path d="M{25+i%29} 320 Q40 {195+i%27} 160 205 T{275+i%27} 320" fill="{fg}" opacity=".6"/></svg>'''
 (root/'avatars'/f'avatar-{i+1:02d}.svg').write_text(avatar,encoding='utf8')
 cover=f'''<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="600"><rect width="1600" height="600" fill="{bg}"/><path d="M0 500 Q400 {80+i%180} 800 370 T1600 190 V600 H0" fill="{fg}" opacity=".5"/><circle cx="{1050+(i*37)%300}" cy="200" r="120" fill="#fff" opacity=".45"/><text x="60" y="540" fill="{fg}" font-family="Arial,sans-serif" font-size="32" letter-spacing="4">CHEREDA · ДЕМО-ПРОФИЛЬ</text></svg>'''
 (root/'covers'/f'cover-{i+1:02d}.svg').write_text(cover,encoding='utf8')
(root/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf8')
