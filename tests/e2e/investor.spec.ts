import {test,expect} from 'playwright/test';

test('визуал → проект → команда → услуга → локальная заявка',async({page})=>{
 await page.goto('/feed?tab=for-you');
 await page.getByRole('link',{name:'Белый сад',exact:true}).first().click();
 await expect(page.getByRole('heading',{name:'Белый сад'})).toBeVisible();
 await page.getByRole('button',{name:/Открыть кадр 1/}).click();
 for(let i=0;i<3;i++)await page.keyboard.press('ArrowRight');
 await expect(page.getByRole('dialog',{name:'Просмотр проекта'})).toContainText('4/8');
 await page.keyboard.press('Escape');
 await expect(page.locator('#team .credit')).toHaveCount(10);
 await page.locator('#team .credit').filter({hasText:'Елена Соколова'}).click();
 await expect(page.getByRole('heading',{name:'Елена Соколова'})).toBeVisible();
 await expect(page.getByText('Демо-проверка профиля')).toBeVisible();
 await expect(page.getByText(/рейтинг и отметка проверки показаны на demo-данных/i)).toBeVisible();
 await expect(page.getByText('Москва · выезд до 80 км')).toBeVisible();
 await page.getByRole('tab',{name:'Услуги'}).click();
 await expect(page).toHaveURL(/tab=services/);
 await expect(page.getByText('Укладка + проба')).toBeVisible();
 await page.locator('.service-card').filter({hasText:'Укладка + проба'}).getByRole('button',{name:'Записаться'}).click();
 await page.getByRole('textbox',{name:'Ваше имя'}).fill('Тестовый Viewer');
 await page.getByLabel('Предпочтительный канал').selectOption('telegram');
 await page.getByRole('textbox',{name:'Контакт для ответа'}).fill('@demo_chereda');
 await page.getByRole('textbox',{name:'Сообщение'}).fill('Нужна укладка для свадьбы.');
 await page.getByRole('button',{name:'Сохранить demo-заявку'}).click();
 await expect(page.getByRole('button',{name:'Сохраняем заявку…'})).toBeVisible();
 await expect(page.getByText('Demo-заявка сохранена')).toBeVisible();
 const savedRequest=await page.evaluate(()=>JSON.parse(localStorage.getItem('chereda-requests')||'[]').at(-1));
 expect(savedRequest).toMatchObject({profileName:'Елена Соколова',contactName:'Тестовый Viewer',preferredChannel:'telegram',contactValue:'@demo_chereda',serviceName:'Укладка + проба',message:'Нужна укладка для свадьбы.'});
 await page.getByRole('dialog').getByRole('link',{name:'Открыть мои заявки'}).click();
 await expect(page).toHaveURL(/\/me\/?\?tab=requests/);
 await expect(page.getByRole('heading',{name:'Мои demo-заявки'})).toBeVisible();
 const requestCard=page.locator('.viewer-request-card').first();
 await expect(requestCard).toContainText('Елена Соколова');
 await expect(requestCard).toContainText('Укладка + проба');
 await expect(requestCard).toContainText('Нужна укладка для свадьбы.');
 await expect(requestCard).toContainText('@demo_chereda');
 await page.reload();
 await expect(page.locator('.viewer-request-card')).toHaveCount(1);
 await requestCard.getByRole('link',{name:'Открыть профиль'}).click();
 await expect(page.getByRole('heading',{name:'Елена Соколова'})).toBeVisible();
 await page.getByRole('button',{name:'Записаться'}).first().click();
 await expect(page.getByRole('textbox',{name:'Ваше имя'})).toHaveValue('');
 await expect(page.getByRole('textbox',{name:'Контакт для ответа'})).toHaveValue('');
 await expect(page.getByRole('textbox',{name:'Сообщение'})).toHaveValue('');
});

test('журнал локальных заявок имеет понятное пустое состояние и продолжение пути',async({page})=>{
 await page.goto('/me?tab=requests');
 await expect(page.getByRole('heading',{name:'Мои demo-заявки'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Заявок пока нет'})).toBeVisible();
 await page.getByRole('link',{name:'Открыть PRO-каталог'}).click();
 await expect(page).toHaveURL(/\/pro\/?$/);
});

test('заявки восстанавливаются в мобильной тёмной теме, повреждённый список можно сбросить',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/settings');
 await page.getByRole('button',{name:'Тёмная'}).click();
 await page.evaluate(()=>localStorage.setItem('chereda-requests',JSON.stringify([{profileId:'anna-mironova-photo',profileName:'Анна Миронова',serviceName:'Фотосъёмка события',eventCity:'moscow',contactName:'Демо Viewer',preferredChannel:'email',contactValue:'viewer@example.com',message:'Проверка мобильной заявки.',date:'2026-11-13T09:00:00.000Z'}])));
 await page.goto('/me?tab=requests');
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 const geometry=await page.locator('.viewer-request-card').evaluate(el=>({width:el.getBoundingClientRect().width,scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
 expect(geometry.width).toBeLessThanOrEqual(geometry.viewport);
 expect(geometry.scroll).toBeLessThanOrEqual(geometry.viewport);
 await page.evaluate(()=>localStorage.setItem('chereda-requests','{'));
 await page.reload();
 const recovery=page.getByRole('alert');
 await expect(recovery.getByRole('heading',{name:'Не удалось прочитать локальные заявки'})).toBeVisible();
 await recovery.getByRole('button',{name:'Сбросить повреждённый список'}).click();
 await expect(page.getByRole('heading',{name:'Заявок пока нет'})).toBeVisible();
});

test('ошибка локального сохранения заявки оставляет форму доступной для повтора',async({page})=>{
 await page.addInitScript(()=>{
  const original=Storage.prototype.setItem;
  Storage.prototype.setItem=function(key,value){if(key==='chereda-requests')throw new DOMException('Storage full','QuotaExceededError');return original.call(this,key,value)};
 });
 await page.goto('/profiles/anna-mironova-photo');
 await page.getByRole('button',{name:'Записаться'}).first().click();
 const form=page.getByRole('dialog',{name:'Записаться к специалисту'});
 await form.getByRole('textbox',{name:'Ваше имя'}).fill('Демо Viewer');
 await form.getByRole('textbox',{name:'Контакт для ответа'}).fill('viewer@example.com');
 await form.getByRole('textbox',{name:'Сообщение'}).fill('Проверка восстановления после ошибки.');
 await form.getByRole('button',{name:'Сохранить demo-заявку'}).click();
 await expect(form.getByRole('alert')).toContainText('Не удалось сохранить заявку');
 await expect(form.getByRole('button',{name:'Сохранить demo-заявку'})).toBeEnabled();
});

test('незаполненная до конца заявка просит подтверждение перед закрытием',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/settings');
 await page.getByRole('button',{name:'Тёмная'}).click();
 await page.goto('/profiles/anna-mironova-photo');
 await page.getByRole('button',{name:'Записаться'}).first().click();
 const form=page.getByRole('dialog',{name:'Записаться к специалисту'});
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 const dialogBounds=await form.evaluate(el=>({left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right,scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
 expect(dialogBounds.left).toBeGreaterThanOrEqual(0);
 expect(dialogBounds.right).toBeLessThanOrEqual(dialogBounds.viewport);
 expect(dialogBounds.scroll).toBeLessThanOrEqual(dialogBounds.viewport);
 await form.getByRole('textbox',{name:'Ваше имя'}).fill('Черновик Viewer');
 await form.getByRole('button',{name:'Закрыть'}).click();
 const confirm=page.getByRole('alert').filter({has:page.getByRole('heading',{name:'Отказаться от заполнения?'})});
 await expect(confirm).toBeVisible();
 await expect(confirm.getByRole('button',{name:'Продолжить заполнение'})).toBeFocused();
 await expect(form.getByRole('textbox',{name:'Ваше имя'})).toHaveValue('Черновик Viewer');
 await page.keyboard.press('Escape');
 await expect(confirm).toHaveCount(0);
 await expect(form.getByRole('button',{name:'Закрыть'})).toBeFocused();
 await form.getByRole('textbox',{name:'Сообщение'}).fill('Нужно обсудить дату и условия события.');
 await page.locator('.overlay').click({position:{x:5,y:5}});
 await expect(confirm).toBeVisible();
 await confirm.getByRole('button',{name:'Продолжить заполнение'}).click();
 await expect(form.getByRole('textbox',{name:'Сообщение'})).toHaveValue('Нужно обсудить дату и условия события.');
 await form.getByRole('button',{name:'Закрыть'}).click();
 await form.getByRole('button',{name:'Закрыть без сохранения'}).click();
 await expect(form).toHaveCount(0);
});

test('лента показывает темы по горизонтальной ленте, не растягивая её за контейнер',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/feed');
 const rail=page.locator('.feed-page .story-rail');
 await expect(rail.locator('.story')).toHaveCount(8);
 const projectCards=page.locator('.project-card-visual .media-link');
 await expect(projectCards).toHaveCount(30);
 const projectHrefs=await projectCards.evaluateAll(links=>links.map(link=>link.getAttribute('href')?.split('?')[0]));
 expect(new Set(projectHrefs).size).toBe(projectHrefs.length);
 const geometry=await rail.evaluate(el=>({client:el.clientWidth,scroll:el.scrollWidth,left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right}));
 expect(geometry.scroll).toBeGreaterThan(geometry.client);
 expect(geometry.left).toBeGreaterThanOrEqual(0);
 expect(geometry.right).toBeLessThanOrEqual(390);
 await expect(rail.locator('.story-avatar')).toHaveCount(8);
});

test('поиск использует настоящий заголовок и не обещает неподтверждённый объём каталога',async({page})=>{
 await page.goto('/search');
 await expect(page.getByRole('heading',{name:'Поиск Chereda',level:1})).toBeVisible();
 await expect(page.getByText('Откройте проекты и специалистов творческой индустрии.')).toBeVisible();
 await expect(page.getByText('Более 10 000 проектов из творческой среды')).toHaveCount(0);
});

test('повреждённое сохранённое состояние не ломает профиль и подписку',async({page})=>{
 const pageErrors:string[]=[];
 page.on('pageerror',error=>pageErrors.push(error.message));
 await page.addInitScript(()=>localStorage.setItem('chereda-subscriptions','{'));
 await page.goto('/profiles/anna-mironova-photo');
 await expect(page.getByRole('heading',{name:'Анна Миронова'})).toBeVisible();
 await page.getByRole('button',{name:'Подписаться'}).first().click();
 await expect(page.getByRole('button',{name:'Вы подписаны'})).toBeVisible();
 expect(pageErrors).toEqual([]);
});

test('PRO → площадка → рейтинг → breakdown',async({page})=>{
 await page.goto('/pro/venues');
 await expect(page.getByText(/вариантов/)).toBeVisible();
 await expect(page.getByText('Реклама · платное размещение').first()).toBeVisible();
 await expect(page.getByRole('link',{name:'Лофт «Берег»',exact:true})).toBeVisible();
 await page.goto('/pro/venues?city=moscow&capacity=80-150&priceMax=500000&outsideCatering=1&sort=rating');
 await expect(page.getByText('1 вариантов')).toBeVisible();
 await page.getByRole('link',{name:'Лофт «Берег»',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Лофт «Берег»'})).toBeVisible();
 await page.getByRole('link',{name:/Рейтинг категории/}).click();
 await expect(page.getByRole('heading',{name:'Рейтинг профессионалов'})).toBeVisible();
 await page.locator('.rank-row').filter({hasText:'Лофт «Берег»'}).getByRole('button').click();
 await expect(page.getByRole('dialog',{name:'Как складывается рейтинг'})).toBeVisible();
});

test('период рейтинга меняет score, а пустая география не подменяется чужими профилями',async({page})=>{
 await page.goto('/ratings?period=month&city=moscow');
 await page.keyboard.press('Tab');
 const focusRing=await page.locator(':focus').evaluate(el=>getComputedStyle(el).outlineWidth);
 expect(focusRing).toBe('3px');
 expect(await page.locator('body').evaluate(()=>document.fonts.check('14px "Roboto Flex"'))).toBe(true);
 const monthScore=await page.locator('.rating-top-card .rating-score-line strong').first().innerText();
 await page.goto('/ratings?period=year&city=moscow');
 const yearScore=await page.locator('.rating-top-card .rating-score-line strong').first().innerText();
 expect(yearScore).not.toBe(monthScore);
 const scoreButton=page.getByRole('button',{name:/Состав score/}).first();
 await scoreButton.focus();
 await page.keyboard.press('Enter');
 const scoreDialog=page.getByRole('dialog',{name:'Как складывается рейтинг'});
 await expect(scoreDialog).toContainText('Годовой срез');
 expect(await page.evaluate(()=>Boolean(document.activeElement?.closest('[role=dialog]')))).toBe(true);
 await page.keyboard.press('Shift+Tab');
 expect(await page.evaluate(()=>Boolean(document.activeElement?.closest('[role=dialog]')))).toBe(true);
 await page.keyboard.press('Escape');
 await expect(scoreDialog).toHaveCount(0);
 await expect(scoreButton).toBeFocused();
 await page.goto('/ratings?city=not-a-city');
 await expect(page.getByText(/В выбранном городе и категории пока нет demo-профилей/)).toBeVisible();
 await expect(page.locator('.rating-row')).toHaveCount(0);
});

test('интересы Viewer меняют порядок рекомендаций и объяснение причин',async({page})=>{
 await page.goto('/settings');
 for(const interest of ['Проекты и кейсы','Площадки','Фото и видео','Beauty']){const chip=page.locator('.settings-interest').filter({hasText:interest});if(await chip.getAttribute('aria-pressed')==='true')await chip.click()}
 const editorial=page.locator('.settings-interest').filter({hasText:'Editorial'});
 await editorial.click();
 await expect(editorial).toHaveAttribute('aria-pressed','true');
 await page.goto('/me');
 await expect(page.locator('.viewer-recommendation-reason').filter({hasText:'Editorial'}).first()).toBeVisible();
 await page.goto('/recommendations');
 await expect(page.locator('.recommendation-profile-grid .recommendation-reason').filter({hasText:'Editorial'}).first()).toBeVisible();
});

test('проект → новая коллекция → город → тёмная тема → refresh',async({page})=>{
 await page.goto('/projects/white-garden-wedding');
 await page.getByRole('button',{name:'Сохранить',exact:true}).click();
 await page.getByRole('textbox',{name:'Новая коллекция'}).fill('Сценарий инвестора');
 await page.getByRole('button',{name:'Создать и сохранить'}).click();
 await page.getByRole('status').getByRole('link',{name:'Открыть'}).click();
 await expect(page.getByRole('heading',{name:'Сценарий инвестора'})).toBeVisible();
 await expect(page.getByRole('link',{name:'Белый сад',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Москва'}).click();
 await page.getByRole('dialog',{name:'Выберите город'}).getByRole('button',{name:'Санкт-Петербург'}).click();
 await page.goto('/settings');
 await page.getByRole('button',{name:'Тёмная'}).click();
 await page.reload();
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await expect(page.getByRole('button',{name:'Санкт-Петербург'})).toBeVisible();
});

test('О Chereda → проект → PRO',async({page})=>{
 await page.goto('/about');
 await expect(page.getByRole('heading',{name:/От вдохновения/})).toBeVisible();
 await page.getByRole('link',{name:/Открыть пример/}).click();
 await expect(page.getByRole('heading',{name:'Белый сад'})).toBeVisible();
 await page.goto('/about');
 await page.getByRole('link',{name:'Открыть PRO'}).click();
 await expect(page.getByRole('heading',{name:'Каталог профессионалов'})).toBeVisible();
});

test('onboarding → конструктор → рекомендации и системные разделы',async({page})=>{
 await page.goto('/register');
 await page.getByRole('button',{name:/Профессионал/}).click();
 await page.getByRole('textbox',{name:'Имя или название'}).fill('Demo Studio');
 await page.getByRole('button',{name:'Продолжить'}).click();
 await page.getByRole('button',{name:'Открыть конструктор'}).click();
 await expect(page.getByRole('heading',{name:'Страница профессионала'})).toBeVisible();
 await page.getByRole('textbox',{name:'Имя или название'}).fill('Demo Studio Pro');
 await page.getByRole('button',{name:'Сохранить preview'}).click();
 await expect(page.getByText('Профиль сохранён локально')).toBeVisible();
 await page.goto('/recommendations');
 await expect(page.getByRole('heading',{name:'Рекомендации для вас'})).toBeVisible();
 await page.goto('/subscriptions');
 await expect(page.getByRole('heading',{name:'Подписки'})).toBeVisible();
 await page.goto('/favorites-pro');
 await expect(page.getByRole('heading',{name:'Избранные PRO'})).toBeVisible();
 await page.goto('/platform');
 await expect(page.getByRole('heading',{name:/Все, что нужно/})).toBeVisible();
 await page.goto('/support');
 await expect(page.getByRole('heading',{name:/Поможем разобраться/})).toBeVisible();
 for (const [path,title] of [['/blog','Идеи и практика'],['/faq','Ответы о Chereda'],['/knowledge','Chereda по шагам'],['/video-lessons','Разборы интерфейса'],['/webinars','Живые разборы'],['/api','Данные остаются под контролем'],['/complaint','Сообщить о проблеме']] as const) {
  await page.goto(path);
  await expect(page.getByRole('heading',{name:new RegExp(title)})).toBeVisible();
 }
});

test('карта сайта открывает все зарегистрированные маршруты',async({page,request})=>{
 await page.goto('/settings?tab=sitemap');
 await expect(page.getByRole('heading',{name:'Карта сайта'})).toBeVisible();
 const hrefs=await page.locator('a.sitemap-link').evaluateAll(links=>links.map(link=>(link as HTMLAnchorElement).getAttribute('href')).filter((href):href is string=>Boolean(href)));
 expect(new Set(hrefs).size).toBeGreaterThan(30);
 for(const href of [...new Set(hrefs)]){
  const response=await request.get(new URL(href,'http://127.0.0.1:3000').toString());
  expect(response.ok(),`${href} должен открываться из карты сайта`).toBeTruthy();
 }
});
test('мобильная оболочка → burger-menu → новые страницы и footer',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true});
 const page=await context.newPage();
 for(const route of ['/feed','/search','/pro','/ratings','/register','/professional','/recommendations','/subscriptions','/favorites-pro','/platform','/pricing','/support','/blog','/faq','/knowledge','/settings?tab=sitemap','/brief','/projects/white-garden-wedding/room','/crew-match','/requests','/venue-fit','/collections/wedding-shortlist/board','/credits/anna-mironova-photo','/passport','/partners','/partners/studio-chereda','/radar']){
  await page.goto(route);
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
 }
 await page.goto('/feed');
 const menuTrigger=page.getByRole('button',{name:'Открыть меню'});
 await page.evaluate(()=>window.scrollTo(0,500));
 const previousScroll=await page.evaluate(()=>window.scrollY);
 const previousOverflow=await page.evaluate(()=>document.body.style.overflow);
 await menuTrigger.click();
 const menu=page.getByRole('dialog',{name:'Меню Chereda'});
 await expect(menu).toBeVisible();
 await expect(menu.getByRole('link',{name:'Настройки'})).toBeVisible();
 expect(await page.evaluate(()=>document.body.style.overflow)).toBe('hidden');
 await page.keyboard.press('Shift+Tab');
 await expect(menu.getByRole('button',{name:'Выйти из demo'})).toBeFocused();
 await page.keyboard.press('Tab');
 await expect(menu.getByRole('button',{name:'Закрыть'})).toBeFocused();
 await page.keyboard.press('Escape');
 await expect(menu).toHaveCount(0);
 await expect(menuTrigger).toBeFocused();
 expect(await page.evaluate(()=>document.body.style.overflow)).toBe(previousOverflow);
 expect(await page.evaluate(()=>window.scrollY)).toBe(previousScroll);
 await menuTrigger.click();
 await page.getByRole('button',{name:'Закрыть'}).click();
 await expect(menu).toHaveCount(0);
 await page.getByRole('button',{name:'Открыть меню'}).click();
 await page.getByRole('dialog',{name:'Меню Chereda'}).getByRole('link',{name:'Настройки'}).click();
 await expect(page.getByRole('heading',{name:'Настройки'})).toBeVisible();
 await page.getByRole('tab',{name:'Карта сайта'}).click();
 await expect(page.getByRole('heading',{name:'Карта сайта'})).toBeVisible();
 await context.close();
});


test('growth path: проект → brief → room → crew → requests → partner → radar',async({page})=>{
 await page.goto('/projects/white-garden-wedding');
 await page.getByRole('link',{name:/Сделать brief/}).click();
 await expect(page.getByRole('heading',{name:'Превратите визуал в задачу'})).toBeVisible();
 await expect(page.getByText('Почему мы так решили')).toBeVisible();
 await page.getByRole('button',{name:/Сохранить brief/}).click();
 await page.getByRole('link',{name:/Создать Project Room/}).click();
 await page.getByRole('link',{name:'Бюджет'}).click();
 await expect(page.getByRole('heading',{name:'Площадка'})).toBeVisible();
 await page.goto('/crew-match');
 await expect(page.getByText(/Совместимость/).first()).toBeVisible();
 await page.getByRole('button',{name:/Добавить в room/}).first().click();
 await page.reload();
 await expect(page.getByText('1 добавлено в shortlist')).toBeVisible();
 await page.goto('/requests');
 await page.getByRole('button',{name:'Отправить'}).first().click();
 await expect(page.getByText('Ответ получен').first()).toBeVisible();
 await page.goto('/partners/studio-chereda');
 await expect(page.getByRole('heading',{name:'Studio Chereda / Moscow'})).toBeVisible();
 await page.goto('/radar');
 await page.getByLabel('Период').selectOption('year');
 await expect(page.getByText(/Demo snapshot/)).toContainText('year');
});


test('ноутбучная сетка сохраняет читаемую ширину карточек',async({browser})=>{
 const context=await browser.newContext({viewport:{width:900,height:800}});
 const page=await context.newPage();
 await page.goto('/projects/white-garden-wedding');
 await expect(page.locator('.project-credit-card')).toHaveCount(10);
 await expect(page.locator('.project-credit-card').first()).toBeVisible();
 const projectWidths=await page.locator('.project-credit-card').evaluateAll(cards=>cards.slice(0,4).map(card=>({width:card.getBoundingClientRect().width,display:getComputedStyle(card).display,parent:card.parentElement?.getBoundingClientRect().width,grid:getComputedStyle(card.parentElement!).gridTemplateColumns})));
 expect(Math.min(...projectWidths.map(card=>card.width)),JSON.stringify(projectWidths)).toBeGreaterThan(340);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
 await page.goto('/ratings');
 const ratingWidths=await page.locator('.rating-top-card').evaluateAll(cards=>cards.map(card=>card.getBoundingClientRect().width));
 expect(ratingWidths).toHaveLength(3);
 expect(Math.min(...ratingWidths)).toBeGreaterThan(340);
 expect(Math.max(...ratingWidths)).toBeLessThan(500);
 await page.goto('/search');
 await expect(page.locator('.project-card').first()).toBeVisible();
 const searchWidths=await page.locator('.project-card').evaluateAll(cards=>cards.slice(0,3).map(card=>card.getBoundingClientRect().width));
 expect(Math.min(...searchWidths)).toBeGreaterThan(240);
 await context.close();
});



test('редкая выдача остаётся в сетке, а действия ленты не перекрывают автора на телефоне',async({browser})=>{
 const context=await browser.newContext({viewport:{width:1440,height:900}});
 const page=await context.newPage();
 await page.goto('/feed');
 await page.getByRole('button',{name:'Поставить реакцию'}).first().click();
 await page.getByRole('link',{name:'Избранное'}).first().click();
 const savedCard=page.locator('.favorites-page .project-card').first();
 await expect(savedCard).toBeVisible();
 const savedWidth=await savedCard.evaluate(card=>card.getBoundingClientRect().width);
 expect(savedWidth,`одна карточка избранного не должна растягиваться на весь контейнер (${savedWidth}px)`).toBeLessThan(400);
 await page.setViewportSize({width:390,height:844});
 await page.goto('/feed');
 await expect(page.locator('.project-card-visual').first()).toBeVisible();
 const mobileCards=await page.locator('.project-card-visual').evaluateAll(cards=>cards.slice(0,8).map(card=>{
  const creator=card.querySelector('.visual-card-creator')?.getBoundingClientRect();
  const actions=card.querySelector('.visual-card-actions')?.getBoundingClientRect();
  return {creatorBottom:creator?.bottom,actionsTop:actions?.top,cardRight:card.getBoundingClientRect().right};
 }));
 expect(mobileCards.length).toBeGreaterThan(0);
 for(const card of mobileCards){expect(card.actionsTop! - card.creatorBottom!,JSON.stringify(mobileCards)).toBeGreaterThanOrEqual(9);expect(card.cardRight).toBeLessThanOrEqual(390)}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
 await context.close();
});

test('избранное восстанавливает проекты до показа пустого состояния',async({page})=>{
 await page.goto('/feed');
 await page.evaluate(()=>localStorage.setItem('chereda-demo-v1',JSON.stringify({city:'moscow',theme:'light',collections:[],likes:['white-garden-wedding','neon-garden-launch'],readIds:[]})));
 await page.reload();
 await page.goto('/favorites');
 await expect(page.locator('.favorites-page .project-card')).toHaveCount(2);
 await expect(page.locator('.favorites-page .empty')).toHaveCount(0);
 const widths=await page.locator('.favorites-page .project-card').evaluateAll(cards=>cards.map(card=>Math.round(card.getBoundingClientRect().width)));
 expect(widths).toEqual([278,278]);
});

test('вид PRO-подборки переключается кнопками и сохраняет остальные параметры URL',async({page})=>{
 await page.goto('/pro/venues?sort=rating');
 await page.getByRole('button',{name:'Компактно'}).click();
 await expect(page).toHaveURL(/view=compact/);
 await expect(page.locator('.pro-results')).toHaveClass(/view-compact/);
 await expect(page.getByRole('button',{name:'Компактно'})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Крупно'}).click();
 await expect(page).toHaveURL(/view=visual/);
 await expect(page).toHaveURL(/sort=rating/);
 await expect(page.locator('.pro-results')).toHaveClass(/view-visual/);
 await page.setViewportSize({width:390,height:844});
 const controls=await page.locator('.pro-view-switch button').evaluateAll(buttons=>buttons.map(button=>{const rect=button.getBoundingClientRect();return{left:rect.left,right:rect.right}}));
 expect(controls).toHaveLength(3);
 expect(controls.every(control=>control.left>=0&&control.right<=390)).toBe(true);
 expect(controls[1].left-controls[0].right).toBeGreaterThanOrEqual(9);
 expect(controls[2].left-controls[1].right).toBeGreaterThanOrEqual(9);
});

test('все типы страниц содержательны и не создают горизонтальный скролл',async({browser})=>{
 test.setTimeout(120000);
 const desktop=await browser.newContext({viewport:{width:900,height:800}});
 const index=await desktop.newPage();
 await index.goto('/settings?tab=sitemap');
 const hrefs=await index.locator('a.sitemap-link').evaluateAll(links=>[...new Set(links.map(link=>(link as HTMLAnchorElement).getAttribute('href')).filter((href):href is string=>Boolean(href)))]);
 await index.close();
 for(const width of [900,390]){
  const context=width===900?desktop:await browser.newContext({viewport:{width,height:844},isMobile:true});
  const page=await context.newPage();
  for(const href of hrefs){
   await page.goto(href,{waitUntil:'domcontentloaded'});
   await expect(page.locator('#main h1').first()).toBeVisible();
   await expect(page.locator('#main [aria-busy="true"]')).toHaveCount(0);
   expect((await page.locator('#main').innerText()).length,href+' должен содержать заполненный экран').toBeGreaterThan(80);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),href+' не должен создавать горизонтальный скролл').toBeTruthy();
  }
  await page.close();
  await context.close();
 }
});

test('дополнительные страницы ведут в понятный следующий сценарий',async({page})=>{
 await page.goto('/knowledge');
 await expect(page.getByText('Как использовать Chereda')).toBeVisible();
 await expect(page.getByText('3 простых шага')).toBeVisible();
 await page.goto('/profiles/anna-mironova-photo?tab=services');
 await page.getByRole('button',{name:'Записаться'}).first().click();
 await expect(page.getByRole('dialog',{name:'Записаться к специалисту'})).toBeVisible();
});

test('из карточки профессионала можно сразу подписаться и вернуться к нему',async({page})=>{
 await page.goto('/search?tab=profiles');
 const button=page.locator('.profile-card .subscription-card-button').first();
 await expect(button).toBeVisible();
 await button.click();
 await expect(page.locator('.profile-card .subscription-card-button[aria-pressed="true"]').first()).toBeVisible();
 await page.goto('/subscriptions');
 await expect(page.locator('.profile-card').first()).toBeVisible();
});

test('запрет browser storage не ломает подписку и честно показывает временное состояние',async({page})=>{
 await page.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Storage is unavailable','QuotaExceededError')}});
 const pageErrors:string[]=[];
 page.on('pageerror',error=>pageErrors.push(error.message));
 page.on('console',message=>{if(message.type()==='error')pageErrors.push(message.text())});
 await page.goto('/search?tab=profiles');
 const profileName=await page.locator('.profile-card .profile-card-name a').first().innerText();
 const button=page.locator('.profile-card .subscription-card-button').first();
 await button.click();
 await expect(button).toHaveAttribute('aria-pressed','true');
 await expect(page.getByRole('status')).toContainText('только до закрытия вкладки');
 await page.getByRole('button',{name:'Меню профиля'}).click();
 await page.getByRole('dialog',{name:'Меню Chereda'}).getByRole('link',{name:'Подписки'}).click();
 const subscribedEntry=page.locator('.profile-card').filter({hasText:profileName}).first();
 await expect(subscribedEntry).toBeVisible();
 await subscribedEntry.locator('xpath=..').getByRole('button',{name:'Отписаться',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Подписок пока нет'})).toBeVisible();
 await page.goBack();
 const restoredButton=page.locator('.profile-card').filter({hasText:profileName}).locator('.subscription-card-button');
 await expect(restoredButton).toHaveAttribute('aria-pressed','false');
 expect(pageErrors).toEqual([]);
});

test('визуальная карточка сразу раскрывает автора и подписку',async({page})=>{
 await page.goto('/feed?tab=for-you');
 const card=page.locator('.project-card-visual').first();
 await expect(card.getByRole('link',{name:/Открыть профиль/})).toBeVisible();
 const subscribe=card.locator('button.subscription-card-button');
 await subscribe.click();
 await expect(subscribe).toHaveAttribute('aria-pressed','true');
});

test('поиск применяет сортировку из URL к карточкам результатов',async({page})=>{
 await page.goto('/search?tab=profiles&sort=recommended');
 const recommended=await page.locator('.result-grid .profile-card .card-title').first().textContent();
 await page.goto('/search?tab=profiles&sort=rating');
 const rating=await page.locator('.result-grid .profile-card .card-title').first().textContent();
 expect(recommended).not.toBe(rating);
 await expect(page.locator('select[aria-label="Сортировка поиска"]')).toHaveValue('rating');
});

test('PRO-каталог сохраняет кандидата для возврата к сравнению',async({page})=>{
 await page.goto('/pro/venues');
 const save=page.locator('.pro-catalog-card').filter({hasText:'Лофт «Берег»'}).locator('.pro-catalog-save');
 await save.click();
 await expect(save).toHaveAttribute('aria-pressed','true');
 await page.goto('/favorites-pro');
 await expect(page.getByRole('heading',{name:'Избранные PRO'})).toBeVisible();
 await expect(page.getByRole('link',{name:'Лофт «Берег»',exact:true})).toBeVisible();
});

test('витрина PRO не дублирует профиль и показывает полную цену',async({page})=>{
 await page.goto('/pro');
 const cards=page.locator('.pro-showcase-card');
 const names=await cards.locator('.pro-showcase-name b').allTextContents();
 expect(names.length).toBeGreaterThan(1);
 expect(new Set(names).size).toBe(names.length);
 const requestCard=cards.filter({hasText:'Sever Hall'}).first();
 await expect(requestCard.locator('.pro-showcase-metrics')).toContainText('По запросу');
});

test('быстрые фильтры PRO обновляют выдачу и восстанавливаются из URL',async({page})=>{
 await page.goto('/pro/venues');
 await expect(page.locator('.filter-chip')).toHaveCount(0);
 const verified=page.getByRole('button',{name:'Проверенные',exact:true});
 await verified.focus();
 await page.keyboard.press('Enter');
 await expect(page).toHaveURL(/verified=1/);
 await expect(page.getByRole('button',{name:'Проверенные профили'})).toBeVisible();
 await expect(page.locator('.filter-chip')).toHaveCount(1);
 await page.reload();
 await expect(page.getByRole('button',{name:'Проверенные',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Проверенные',exact:true}).focus();
 await page.keyboard.press('Enter');
 await expect(page).not.toHaveURL(/verified=1/);
});

test('избранное PRO сравнивает условия услуги и передаёт их в локальную заявку',async({page})=>{
 await page.goto('/favorites-pro');
 await page.evaluate(()=>{localStorage.setItem('chereda-favorites-pro',JSON.stringify(['loft-bereg','anna-mironova-photo']));localStorage.removeItem('chereda-profile-comparison-v1')});
 await page.reload();
 await page.getByRole('button',{name:'Сравнить'}).first().click();
 await expect(page.getByRole('button',{name:'В сравнении'})).toHaveCount(1);
 await page.getByRole('button',{name:'Сравнить'}).first().click();
 await expect(page.getByRole('heading',{name:'Сравнение кандидатов'})).toBeVisible();
 await expect(page.locator('.compare-table')).toContainText('Рейтинг');
 await expect(page.locator('.compare-table')).toContainText('Основная услуга');
 await expect(page.locator('.compare-table')).toContainText('Проверка профиля');
 await page.reload();
 await expect(page.getByRole('heading',{name:'Сравнение кандидатов'})).toBeVisible();
 await page.locator('.compare-table').getByRole('button',{name:'Записаться'}).first().click();
 const booking=page.getByRole('dialog',{name:'Записаться к специалисту'});
 await expect(booking).toContainText('Услуга:');
 await booking.getByLabel('Город события').selectOption('saint-petersburg');
 await booking.getByLabel('Дата события').fill('2027-06-19');
 await booking.getByLabel('Количество гостей').fill('120');
 await booking.getByRole('textbox',{name:'Ваше имя'}).fill('Тестовый Viewer');
 await booking.getByRole('textbox',{name:'Контакт для ответа'}).fill('viewer@example.com');
 await booking.getByRole('textbox',{name:'Сообщение'}).fill('Хочу обсудить услугу из сравнения.');
 await booking.getByRole('button',{name:'Сохранить demo-заявку'}).click();
 await expect(booking.getByText('Demo-заявка сохранена')).toBeVisible();
 const request=await page.evaluate(()=>JSON.parse(localStorage.getItem('chereda-requests')||'[]').at(-1));
 expect(request).toMatchObject({profileId:'anna-mironova-photo',serviceId:expect.any(String),serviceName:expect.any(String),eventCity:'saint-petersburg',eventDate:'2027-06-19',guestCount:120});
 await booking.getByRole('button',{name:'Закрыть'}).last().click();
 await page.goto('/subscriptions');
 await expect(page.getByRole('heading',{name:'Сравнение условий'})).toBeVisible();
 await page.locator('.compare-table').getByRole('button',{name:'Записаться'}).first().click();
 await expect(page.getByRole('dialog',{name:'Записаться к специалисту'})).toBeVisible();
});

test('PRO сравнение показывает диапазон, цену по запросу и сохраняет заявку выбранной услуги',async({page})=>{
 await page.goto('/favorites-pro');
 await page.evaluate(()=>{localStorage.setItem('chereda-favorites-pro',JSON.stringify(['daria-volkova-producer','pulse-sound']));localStorage.removeItem('chereda-profile-comparison-v1')});
 await page.reload();
 await page.getByRole('button',{name:'Сравнить'}).first().click();
 await expect(page.getByRole('button',{name:'В сравнении'})).toHaveCount(1);
 await page.getByRole('button',{name:'Сравнить'}).first().click();
 await expect(page.getByRole('heading',{name:'Сравнение кандидатов'})).toBeVisible();
 const table=page.locator('.compare-table');
 await expect(table).toContainText(/180.*280.*₽ \/ проект/);
 await expect(table).toContainText('По запросу');
 await table.locator('tbody tr').last().locator('td').nth(1).getByRole('button',{name:'Записаться'}).click();
 const booking=page.getByRole('dialog',{name:'Записаться к специалисту'});
 await expect(booking).toContainText('Pulse Sound');
 await expect(booking).toContainText('По запросу');
 await booking.getByRole('textbox',{name:'Ваше имя'}).fill('Проверка цены');
 await booking.getByRole('textbox',{name:'Контакт для ответа'}).fill('price-check@example.com');
 await booking.getByRole('textbox',{name:'Сообщение'}).fill('Проверка заявки с услугой по запросу.');
 await booking.getByRole('button',{name:'Сохранить demo-заявку'}).click();
 await expect(booking.getByText('Demo-заявка сохранена')).toBeVisible();
 const request=await page.evaluate(()=>JSON.parse(localStorage.getItem('chereda-requests')||'[]').at(-1));
 expect(request).toMatchObject({profileId:'pulse-sound',serviceId:expect.any(String),serviceName:expect.any(String)});
});

test('непозитивные состояния и диалог сброса дают понятный выход',async({page})=>{
 await page.goto('/feed?state=empty');
 await expect(page.getByRole('heading',{name:'Здесь пока пусто'})).toBeVisible();
 await expect(page.getByRole('link',{name:'Повторить и открыть страницу'})).toHaveAttribute('href',/\/feed\/?$/);
 await page.goto('/search?state=error');
 await expect(page.getByRole('heading',{name:'Не удалось показать данные'})).toBeVisible();
 await page.goto('/settings');
 await page.getByRole('button',{name:'Сбросить demo-state'}).click();
 const dialog=page.getByRole('alertdialog',{name:'Сбросить demo-состояние?'});
 await expect(dialog).toBeVisible();
 await expect(dialog.getByRole('button',{name:'Отмена'})).toBeFocused();
 await page.keyboard.press('Escape');
 await expect(dialog).toHaveCount(0);
});

test('подписки помогают сравнить условия и перейти к локальной записи',async({page})=>{
 await page.goto('/subscriptions');
 await expect(page.getByRole('button',{name:'Сравнить'}).first()).toBeVisible();
 await page.getByRole('button',{name:'Сравнить'}).nth(0).click();
 await page.getByRole('button',{name:'Сравнить'}).nth(0).click();
 await expect(page.getByRole('heading',{name:'Сравнение условий'})).toBeVisible();
 await expect(page.locator('.compare-table')).toContainText('Цена');
 await expect(page.locator('.compare-table')).toContainText('Основная услуга');
 await expect(page.locator('.compare-table')).toContainText('Отзывы и проекты');
 await page.reload();
 await expect(page.getByRole('heading',{name:'Сравнение условий'})).toBeVisible();
 const serviceName=await page.locator('.compare-table tbody tr').filter({hasText:'Основная услуга'}).locator('td').first().locator('b').innerText();
 await page.locator('.compare-table').getByRole('button',{name:'Записаться'}).first().click();
 await expect(page.getByRole('dialog',{name:'Записаться к специалисту'})).toBeVisible();
 await expect(page.getByRole('dialog').locator('.booking-context')).toContainText(serviceName);
});

test('мобильное сравнение и форма записи остаются внутри экрана в тёмной теме',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true});
 const page=await context.newPage();
 await page.goto('/settings');
 await page.getByRole('button',{name:'Тёмная'}).click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await page.goto('/favorites-pro');
 await page.evaluate(()=>{localStorage.setItem('chereda-favorites-pro',JSON.stringify(['loft-bereg','anna-mironova-photo']));localStorage.removeItem('chereda-profile-comparison-v1')});
 await page.reload();
 await page.getByRole('button',{name:'Сравнить'}).first().click();
 await expect(page.getByRole('button',{name:'В сравнении'})).toHaveCount(1);
 await page.getByRole('button',{name:'Сравнить'}).first().click();
 await expect(page.getByRole('heading',{name:'Сравнение кандидатов'})).toBeVisible();
 expect(await page.locator('.compare-table-wrap').evaluate(el=>el.scrollWidth>el.clientWidth)).toBeTruthy();
 const parameterColumn=await page.locator('.compare-table thead th:first-child').evaluate(el=>{const wrap=el.closest('.compare-table-wrap')!;const start=el.getBoundingClientRect().left;wrap.scrollLeft=120;const end=el.getBoundingClientRect().left;return{start,end,scrollLeft:wrap.scrollLeft}});
 expect(parameterColumn.scrollLeft).toBeGreaterThan(0);
 expect(Math.abs(parameterColumn.end-parameterColumn.start)).toBeLessThan(1);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
 await page.locator('.compare-table').getByRole('button',{name:'Записаться'}).first().click();
 const dialog=page.getByRole('dialog',{name:'Записаться к специалисту'});
 await expect(dialog).toBeVisible();
 expect(await dialog.evaluate(el=>el.getBoundingClientRect().width<=window.innerWidth)).toBeTruthy();
 await expect(dialog.getByLabel('Город события')).toBeVisible();
 expect(await dialog.locator('.booking-event-fields').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBeTruthy();
 await expect(dialog.getByLabel('Предпочтительный канал')).toBeVisible();
 await dialog.getByLabel('Количество гостей').fill('80');
 await page.getByRole('textbox',{name:'Ваше имя'}).fill('Мобильный Viewer');
 await page.getByLabel('Предпочтительный канал').selectOption('whatsapp');
 await page.getByRole('textbox',{name:'Контакт для ответа'}).fill('@demo_mobile');
 await page.getByRole('textbox',{name:'Сообщение'}).fill('Нужна консультация по услуге.');
 await page.getByRole('button',{name:'Сохранить demo-заявку'}).click();
 await expect(page.getByText('Demo-заявка сохранена')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
 await context.close();
});

test('offline-экран показывает смену статуса сети и локальные разделы',async({page,context})=>{
 await page.goto('/offline');
 await expect(page.getByRole('status')).toContainText('Подключение активно');
 await expect(page.getByRole('heading',{name:'Локальные разделы'})).toBeVisible();
 await expect(page.locator('.offline-local-data').getByRole('link',{name:/Лента/})).toBeVisible();
 await context.setOffline(true);
 await expect(page.getByRole('status')).toContainText('Устройство сейчас офлайн');
 await expect(page.getByRole('heading',{name:'Нет подключения к сети'})).toBeVisible();
 await expect(page.locator('.offline-local-data').getByRole('link',{name:/Поиск/})).toBeVisible();
 await context.setOffline(false);
 await expect(page.getByRole('status')).toContainText('Подключение активно');
 const feedLink=page.locator('.offline-local-data').getByRole('link',{name:/Лента/});
 await feedLink.focus();
 await page.keyboard.press('Enter');
 await expect(page).toHaveURL(/\/feed\/?$/);
});

test('профиль сохраняет сетку и контраст доверительных данных на мобильном и в темах',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/profiles/anna-mironova-photo');
 await expect(page.locator('.profile-title-line')).toBeVisible();
 await page.evaluate(()=>document.fonts.ready.then(()=>true));
 const desktopProfileGap=await page.evaluate(()=>document.querySelector('.profile-facts')!.getBoundingClientRect().top-document.querySelector('.profile-title-line')!.getBoundingClientRect().bottom);
 expect(desktopProfileGap,`имя профиля и параметры должны быть разнесены на desktop (${desktopProfileGap}px)`).toBeGreaterThanOrEqual(10);
 await page.setViewportSize({width:360,height:800});
 await page.goto('/profiles/anna-mironova-photo');
 await expect(page.locator('.profile-title-line')).toBeVisible();
 await page.evaluate(()=>document.fonts.ready.then(()=>true));
 const mobileProfileGap=await page.evaluate(()=>document.querySelector('.profile-facts')!.getBoundingClientRect().top-document.querySelector('.profile-title-line')!.getBoundingClientRect().bottom);
 expect(mobileProfileGap,`имя профиля и параметры должны быть разнесены на mobile (${mobileProfileGap}px)`).toBeGreaterThanOrEqual(10);
 await expect(page.getByText('Демо-проверка профиля')).toBeVisible();
 const profileActions=page.locator('.profile-sticky-actions');
 await expect(profileActions).toHaveCount(0);
 const introBottom=await page.locator('.profile-intro').evaluate(el=>el.getBoundingClientRect().bottom+window.scrollY);
 await page.evaluate(bottom=>window.scrollTo(0,bottom+30),introBottom);
 await page.waitForTimeout(100);
 await expect(profileActions).toBeVisible();
 const actionGeometry=await page.evaluate(()=>{const actions=document.querySelector('.profile-sticky-actions')!.getBoundingClientRect();const nav=document.querySelector('.mobile-nav')!.getBoundingClientRect();return{actionBottom:actions.bottom,navTop:nav.top}});
 expect(actionGeometry.actionBottom).toBeLessThanOrEqual(actionGeometry.navTop);
 const mobileHero=await page.locator('.profile-cover').boundingBox();
 const mobileName=await page.locator('.profile-heading h1').boundingBox();
 expect(mobileHero&&mobileName&&mobileName.y).toBeGreaterThanOrEqual(mobileHero!.y+mobileHero!.height-1);
 const widths=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,content:document.documentElement.scrollWidth}));
 expect(widths.content).toBeLessThanOrEqual(widths.viewport);
 const lightSurface=await page.locator('.profile-trust-note').evaluate(el=>getComputedStyle(el).backgroundColor);
 await page.evaluate(()=>document.documentElement.dataset.theme='dark');
 const darkSurface=await page.locator('.profile-trust-note').evaluate(el=>getComputedStyle(el).backgroundColor);
 expect(darkSurface).not.toBe(lightSurface);
 expect(await page.locator('body').evaluate(()=>document.fonts.check('14px "Roboto Flex"'))).toBe(true);
 await page.goto('/pro/venues');
 const actions=await page.locator('.growth-pro-links>.button').evaluateAll(els=>els.map(el=>{const rect=el.getBoundingClientRect();return{x:rect.x,right:rect.right,y:rect.y,bottom:rect.bottom}}));
 expect(actions).toHaveLength(3);
 expect(actions.every(action=>action.x>=0&&action.right<=360&&action.bottom<=800)).toBe(true);
 expect(Math.abs(actions[0].y-actions[1].y)).toBeLessThan(4);
});

test('плашки реакций и просмотров следуют активной теме',async({page})=>{
 await page.goto('/feed');
 const getSurfaces=()=>page.locator('.visual-card-actions,.visual-card-inside-stats').evaluateAll(elements=>elements.map(element=>getComputedStyle(element).backgroundColor));
 const isSurface=(color:string,theme:'light'|'dark')=>{const values=color.match(/[\d.]+/g)!.slice(0,3).map(Number).map(value=>value<=1?value*255:value);return theme==='light'?values.every(value=>value>200):values.every(value=>value<80)};
 const lightSurfaces=await getSurfaces();
 expect(lightSurfaces.length).toBeGreaterThan(1);
 expect(lightSurfaces.every(color=>isSurface(color,'light'))).toBe(true);
 await page.evaluate(()=>document.documentElement.dataset.theme='dark');
 const darkSurfaces=await getSurfaces();
 expect(darkSurfaces.every(color=>isSurface(color,'dark'))).toBe(true);
});

test('мобильные действия проекта появляются после ухода галереи и не перекрывают навигацию',async({page})=>{
 await page.setViewportSize({width:360,height:800});
 await page.goto('/projects/white-garden-wedding');
 await expect(page.locator('.project-actions-mobile')).toHaveCount(0);
 const gallery=page.locator('.project-gallery');
 const galleryRect=await gallery.boundingBox();
 expect(galleryRect).toBeTruthy();
 const galleryRail=page.locator('.project-media-rail');
 const railBottom=await galleryRail.evaluate(el=>el.getBoundingClientRect().bottom+window.scrollY);
 await page.evaluate(bottom=>window.scrollTo(0,bottom+30),railBottom);
 await page.waitForTimeout(100);
 const mobileActions=page.locator('.project-actions-mobile');
 await expect(mobileActions).toBeVisible();
 const geometry=await page.evaluate(()=>{const actions=document.querySelector('.project-actions-mobile')!.getBoundingClientRect();const nav=document.querySelector('.mobile-nav')!.getBoundingClientRect();return{actionBottom:actions.bottom,navTop:nav.top}});
 expect(geometry.actionBottom).toBeLessThanOrEqual(geometry.navTop);
});
