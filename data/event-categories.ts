export type EventCategory = {name:string;slug:string;icon:string};

// The category directory follows the demo's Russian event taxonomy. Counts in
// the UI are derived from the actual local event list, never market estimates.
export const eventCategories:EventCategory[]=[
  {name:'Концерты',slug:'koncerty',icon:'music-2'},
  {name:'Искусство и культура',slug:'art-culture',icon:'palette'},
  {name:'Экскурсии и путешествия',slug:'excursions-travel',icon:'map-pinned'},
  {name:'Вечеринки',slug:'vecherinki',icon:'party-popper'},
  {name:'Для детей',slug:'dlya-detey',icon:'baby'},
  {name:'Театры',slug:'teatry',icon:'drama'},
  {name:'Бизнес',slug:'business',icon:'briefcase-business'},
  {name:'Психология и самопознание',slug:'psychology-self-discovery',icon:'brain'},
  {name:'Наука',slug:'science',icon:'atom'},
  {name:'ИТ и интернет',slug:'it-internet',icon:'laptop'},
  {name:'Другие события',slug:'other-events',icon:'calendar-days'},
  {name:'Спорт',slug:'sport',icon:'trophy'},
  {name:'Выставки',slug:'exhibitions',icon:'images'},
  {name:'Интеллектуальные игры',slug:'quiz-games',icon:'puzzle'},
  {name:'Хобби и творчество',slug:'hobbies-creativity',icon:'paintbrush'},
  {name:'Кино',slug:'kino',icon:'clapperboard'},
  {name:'Другие развлечения',slug:'other-entertainment',icon:'sparkles'},
  {name:'Красота и здоровье',slug:'beauty-health',icon:'heart-pulse'},
  {name:'Еда',slug:'food',icon:'utensils'},
  {name:'Иностранные языки',slug:'foreign-languages',icon:'languages'},
  {name:'Гражданские проекты',slug:'civic-projects',icon:'hand-heart'},
  {name:'Образование',slug:'education',icon:'graduation-cap'},
];
