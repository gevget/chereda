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
 await expect(page.getByText('Москва · выезд до 80 км')).toBeVisible();
 await page.getByRole('tab',{name:'Услуги'}).click();
 await expect(page).toHaveURL(/tab=services/);
 await expect(page.getByText('Укладка + проба')).toBeVisible();
 await page.getByRole('button',{name:'Выбрать услугу'}).first().click();
 await page.getByRole('textbox',{name:'Ваше имя'}).fill('Тестовый Viewer');
 await page.getByRole('textbox',{name:'Контакт для demo'}).fill('viewer@example.com');
 await page.getByRole('textbox',{name:'Сообщение'}).fill('Нужна укладка для свадьбы.');
 await page.getByRole('button',{name:'Сохранить demo-заявку'}).click();
 await expect(page.getByText('Demo-заявка сохранена')).toBeVisible();
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
 await page.getByRole('button',{name:'Открыть меню'}).click();
 await expect(page.getByRole('dialog',{name:'Меню Chereda'})).toBeVisible();
 await expect(page.getByRole('dialog',{name:'Меню Chereda'}).getByRole('link',{name:'Настройки'})).toBeVisible();
 await page.getByRole('button',{name:'Закрыть'}).click();
 await expect(page.getByRole('dialog',{name:'Меню Chereda'})).toHaveCount(0);
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
