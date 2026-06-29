# Як користуватись MVC та API

Цей проєкт має простий MVC-приклад у папці `src/mvc` і готовий API-шар у
папці `src/api`.

## Структура MVC

MVC розділяє код на три частини:

- Model зберігає стан і працює з даними.
- View відповідає за HTML, кнопки та відображення даних.
- Controller зв'язує Model і View.

У цьому проєкті приклад складається з трьох файлів:

- `src/mvc/example.model.ts` - дані, стан і API-запити.
- `src/mvc/example.view.ts` - розмітка, рендер і події кнопок.
- `src/mvc/example.controller.ts` - запуск прикладу та реакція на дії.

`src/mvc-example.ts` створює всі три частини та запускає контролер:

```ts
const model = new ExampleModel();
const view = new ExampleView(mainElement);
const controller = new ExampleController(model, view);

controller.init();
```

`src/test-components.html` має контейнер для прикладу:

```html
<div class="container" data-mvc-example></div>
```

`src/test-components.html` підключає `src/mvc-example.ts`:

```html
<script type="module" src="./mvc-example.ts"></script>
```

`src/index.html` і `src/favorites.html` підключають основний entrypoint
`src/main.ts`. MVC-приклад у нього не імпортується.

## Як працює Model

Model імпортує функції та типи з `src/api`:

```ts
import {
  getFilters,
  getExercises,
  getExerciseById,
  addExerciseRating,
  getQuoteOfTheDay,
  subscribeToNewsletter,
} from '../api';
```

У `ExampleModel` є `state`, який зберігає дані для View:

```ts
interface ExampleState {
  filters: FilterItem[];
  exercises: ExerciseResponse[];
  selectedExercise: ExerciseDetails | null;
  quote: QuoteResponse | null;
  ratingResult: ExerciseRatingResponse | null;
  subscriptionResult: SubscriptionResponse | null;
  status: string;
}
```

Коли треба отримати дані з API, Controller викликає метод Model:

```ts
await this.model.loadReadExamples();
```

Цей метод робить GET-запити:

- `getFilters(params)` - отримує список фільтрів.
- `getExercises(params)` - отримує список вправ.
- `getExerciseById(id)` - отримує деталі однієї вправи.
- `getQuoteOfTheDay()` - отримує цитату дня.

PATCH і POST запити винесені в окремі методи:

- `rateSelectedExercise()` викликає `addExerciseRating(id, payload)`.
- `subscribe()` викликає `subscribeToNewsletter(payload)`.

## Як працює View

View створює HTML всередині `main`:

```ts
this.root.innerHTML = `
  <section class="mvc-example">
    ...
  </section>
`;
```

Метод `render(state)` бере поточний стан із Model і показує його на сторінці:

```ts
this.statusElement.textContent = state.status;
```

View також реєструє події кнопок:

```ts
onLoad(handler: () => void): void {
  this.loadButton.addEventListener('click', handler);
}
```

View не робить API-запити напряму. Вона тільки показує дані та повідомляє
Controller, що користувач натиснув кнопку.

## Як працює Controller

Controller запускає початковий рендер:

```ts
this.view.render(this.model.getState());
```

Потім підписується на події View:

```ts
this.view.onLoad(() => {
  void this.loadApiData();
});
```

Коли користувач натискає кнопку, Controller викликає потрібний метод Model,
а потім оновлює View:

```ts
await request();
this.view.render(this.model.getState());
```

Controller не зберігає дані самостійно. Дані живуть у Model.

## API-шар

API-код лежить у `src/api`.

Основні файли:

- `your-energy.client.ts` - налаштування Axios і helper `buildParams`.
- `your-energy.types.ts` - enum-и, параметри, payload-и та response-типи.
- `your-energy.api.ts` - готові функції для HTTP-запитів.
- `index.ts` - re-export, щоб імпортувати все з `../api`.

Базовий Axios-клієнт:

```ts
export const yourEnergyApi = axios.create({
  baseURL: 'https://your-energy.b.goit.study/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

`buildParams` прибирає порожні параметри перед запитом:

```ts
buildParams({
  page: 1,
  limit: 6,
  keyword: '',
});
```

У запит піде тільки `page` і `limit`.

## Приклади API-запитів

Отримати фільтри:

```ts
const filters = await getFilters({
  filter: ExerciseFilter.MUSCLES,
  page: 1,
  limit: 6,
});
```

Отримати вправи:

```ts
const exercises = await getExercises({
  bodypart: BodyPart.BACK,
  muscles: MuscleGroup.LATS,
  equipment: Equipment.BARBELL,
  keyword: 'pull',
  page: 1,
  limit: 6,
});
```

Отримати одну вправу:

```ts
const exercise = await getExerciseById(exerciseId);
```

Додати рейтинг:

```ts
const result = await addExerciseRating(exerciseId, {
  rate: 5,
  email: 'student@example.com',
  review: 'Good exercise',
});
```

Отримати цитату дня:

```ts
const quote = await getQuoteOfTheDay();
```

Підписатись на розсилку:

```ts
const result = await subscribeToNewsletter({
  email: 'student@example.com',
});
```

## Як додати новий API-запит

1. Додай типи в `src/api/your-energy.types.ts`.
2. Додай функцію запиту в `src/api/your-energy.api.ts`.
3. Якщо потрібно, використай цю функцію в `src/mvc/example.model.ts`.
4. Додай поле в `ExampleState`, якщо результат треба показати у View.
5. Онови `render` у `src/mvc/example.view.ts`.
6. Додай дію в `src/mvc/example.controller.ts`, якщо запит має запускатись по
   кнопці.

## Правило для роботи з MVC

Не змішуй відповідальності:

- API-запити робить Model.
- HTML і події кнопок обробляє View.
- Controller вирішує, який метод Model викликати після дії користувача.

## Як створювати компоненти

У цьому проєкті є кілька типів компонентів. Обирай найпростіший тип, який
вирішує задачу.

## Статичний HTML-компонент

Використовуй, коли компоненту не потрібен JavaScript: секція, футер, hero,
картка, блок із текстом.

1. Створи файл у `src/partials`.
2. Додай HTML-розмітку.
3. Підключи partial у потрібну сторінку через `<load>`.

Приклад:

```html
<!-- src/partials/quote.html -->
<section class="quote">
  <div class="container">
    <p class="quote-text">Train your body. Focus your mind.</p>
  </div>
</section>
```

Підключення в `src/index.html`:

```html
<load src="./partials/quote.html" />
```

Такі компоненти вже є в проєкті:

- `src/partials/header.html`
- `src/partials/hero.html`
- `src/partials/footer.html`
- `src/partials/quote.html`
- `src/partials/exercises.html`

## Малий повторюваний компонент

Використовуй папку `src/partials/components`, коли компонент повторюється в
різних місцях: кнопка, input, форма пошуку, socials.

Приклад:

```html
<!-- src/partials/components/button-icon.html -->
<button class="{{class}}" type="{{type}}">
  <span>{{label}}</span>
  <svg>
    <use href="./img/sprite.svg#{{icon-id}}"></use>
  </svg>
</button>
```

Підключення з параметрами:

```html
<load
  src="./partials/components/button-icon.html"
  class="btn light"
  label="Add to favorites"
  type="button"
  icon-id="icon-heart"
/>
```

Такі компоненти вже є в проєкті:

- `src/partials/components/button-icon.html`
- `src/partials/components/input-btn.html`
- `src/partials/components/search-form.html`
- `src/partials/components/socials.html`

## CSS для компонента

Для кожного великого компонента створюй окремий CSS-файл у `src/css`.

Приклад:

```css
/* src/css/quote.css */
.quote {
  padding-top: 40px;
  padding-bottom: 40px;
}

.quote-text {
  font-size: 18px;
}
```

Потім імпортуй файл у `src/css/styles.css`:

```css
@import url('./quote.css');
```

Для малих повторюваних компонентів використовуй `src/css/components`.

Приклад:

```css
@import url('./components/button.css');
```

Правило іменування: використовуй зрозумілі назви класів через дефіс. Не
використовуй подвійне підкреслення у назвах класів.

```css
.search-form {}
.search-form-input {}
.search-form-button {}
```

## Інтерактивний компонент без API

Якщо компоненту потрібна тільки поведінка в браузері, але не потрібні API-запити,
створюй для нього окремий TS-файл. Не пиши логіку компонента прямо в
`src/main.ts`.

Приклад окремого файлу:

```ts
// src/components/menu.ts
export const initMenu = (): void => {
  const button = document.querySelector<HTMLButtonElement>('[data-menu-open]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');

  button?.addEventListener('click', () => {
    menu?.classList.toggle('is-open');
  });
};
```

Підключення в `src/main.ts`:

```ts
import { initMenu } from './components/menu';

initMenu();
```

Якщо `src/main.ts` підключений на кількох сторінках, логіка компонента має сама
перевіряти, чи є на поточній сторінці потрібна розмітка. Якщо елемента немає,
функція просто завершується.

```ts
// src/components/favorites-list.ts
export const initFavoritesList = (): void => {
  const root = document.querySelector<HTMLElement>('[data-favorites-list]');

  if (!root) {
    return;
  }

  root.textContent = 'Favorites page logic is active';
};
```

Підключення в `src/main.ts`:

```ts
import { initFavoritesList } from './components/favorites-list';
import { initMenu } from './components/menu';

initMenu();
initFavoritesList();
```

Так `initFavoritesList()` відпрацює тільки на сторінці, де є:

```html
<section data-favorites-list></section>
```

Для пошуку елементів краще використовувати `data-*` атрибути, а не CSS-класи.
CSS-класи відповідають за стилі, `data-*` атрибути - за JavaScript.

```html
<button type="button" data-menu-open>Open menu</button>
<div data-menu></div>
```

## Інтерактивний компонент з API

Якщо компонент має свій стан, API-запити або кілька дій користувача, краще
створити MVC-компонент.

Мінімальна структура:

```text
src/mvc/my-feature.model.ts
src/mvc/my-feature.view.ts
src/mvc/my-feature.controller.ts
```

Model:

```ts
export class MyFeatureModel {
  private items = [];

  async load() {
    const response = await getExercises({ page: 1, limit: 6 });
    this.items = response.results;
    return this.items;
  }
}
```

View:

```ts
export class MyFeatureView {
  constructor(private readonly root: HTMLElement) {}

  render(items: Array<{ name: string }>): void {
    this.root.innerHTML = items.map(item => `<p>${item.name}</p>`).join('');
  }
}
```

Controller:

```ts
export class MyFeatureController {
  constructor(
    private readonly model: MyFeatureModel,
    private readonly view: MyFeatureView
  ) {}

  async init(): Promise<void> {
    const items = await this.model.load();
    this.view.render(items);
  }
}
```

Підключення:

```ts
const root = document.querySelector<HTMLElement>('[data-my-feature]');

if (root) {
  const model = new MyFeatureModel();
  const view = new MyFeatureView(root);
  const controller = new MyFeatureController(model, view);

  void controller.init();
}
```

HTML-контейнер:

```html
<section data-my-feature></section>
```

## Коли який компонент створювати

- Якщо потрібна тільки розмітка - створи partial у `src/partials`.
- Якщо компонент повторюється - створи partial у `src/partials/components`.
- Якщо потрібні тільки стилі - створи CSS-файл і імпортуй його в `styles.css`.
- Якщо потрібен клік, toggle або проста DOM-логіка - створи окремий TS-файл без
  MVC, підключи його в entrypoint і перевіряй у ньому наявність свого
  `data-*` контейнера.
- Якщо потрібні API-запити, стан, loading/error або кілька дій - створи MVC.

## Як додавати зміни в MVC

Коли треба змінити існуючий MVC-компонент, спочатку визнач, що саме змінюється:
дані, розмітка чи поведінка.

- Змінюються дані або API - редагуй Model.
- Змінюється HTML або відображення - редагуй View.
- Змінюється реакція на дію користувача - редагуй Controller.

## Додати нове поле в стан

1. Додай поле в інтерфейс стану.
2. Додай початкове значення в `state`.
3. Онови метод Model, який змінює це поле.
4. Покажи поле у View.

Приклад:

```ts
export interface ExampleState {
  status: string;
  totalExercises: number;
}
```

Початковий стан:

```ts
private state: ExampleState = {
  status: 'Ready',
  totalExercises: 0,
};
```

Оновлення після API-запиту:

```ts
this.state = {
  ...this.state,
  exercises: exercisesResponse.results,
  totalExercises: exercisesResponse.results.length,
};
```

Рендер у View:

```ts
this.totalElement.textContent = `Total: ${state.totalExercises}`;
```

## Додати нову кнопку

Кнопка додається у View, а дія підключається через Controller.

У View:

```ts
private readonly refreshButton: HTMLButtonElement;
```

У HTML-розмітці View:

```html
<button type="button" data-action="refresh">Refresh</button>
```

У constructor:

```ts
this.refreshButton = this.getElement('[data-action="refresh"]');
```

Метод для події:

```ts
onRefresh(handler: () => void): void {
  this.refreshButton.addEventListener('click', handler);
}
```

У Controller:

```ts
this.view.onRefresh(() => {
  void this.loadApiData();
});
```

View не має сам вирішувати, що робити після кліку. View тільки повідомляє
Controller про подію.

## Додати новий API-запит в MVC

1. Переконайся, що API-функція існує в `src/api/your-energy.api.ts`.
2. Імпортуй її в Model.
3. Додай метод Model для цього запиту.
4. Збережи результат у `state`.
5. Додай рендер результату у View.
6. Якщо запит запускається по кліку, додай подію у View і обробник у Controller.

Приклад методу в Model:

```ts
async loadQuote(): Promise<ExampleState> {
  const quote = await getQuoteOfTheDay();

  this.state = {
    ...this.state,
    quote,
    status: 'Quote loaded',
  };

  return this.state;
}
```

Підключення в Controller:

```ts
this.view.onLoadQuote(() => {
  void this.runRequest(() => this.model.loadQuote());
});
```

## Додати loading або error

Loading і error краще контролювати в Controller, бо він знає, коли запит
почався і коли завершився.

Приклад:

```ts
private async runRequest(request: () => Promise<unknown>): Promise<void> {
  this.view.setLoading(true);

  try {
    await request();
    this.view.render(this.model.getState());
  } catch (error) {
    this.view.renderError(error);
  } finally {
    this.view.setLoading(false);
  }
}
```

View може вимикати кнопки:

```ts
setLoading(isLoading: boolean): void {
  this.loadButton.disabled = isLoading;
}
```

Model не має працювати з DOM і не має вимикати кнопки напряму.

## Змінити параметри API-запиту

Параметри запиту тримай у Model.

Приклад:

```ts
private readonly exercisesParams: ExercisesListParams = {
  bodypart: BodyPart.BACK,
  muscles: MuscleGroup.LATS,
  equipment: Equipment.BARBELL,
  keyword: 'pull',
  page: 1,
  limit: 6,
};
```

Якщо параметри має змінювати користувач, додай метод:

```ts
setKeyword(keyword: string): void {
  this.exercisesParams.keyword = keyword;
}
```

Потім Controller може викликати:

```ts
this.model.setKeyword(keyword);
void this.loadApiData();
```

## Додати новий MVC-модуль

Якщо нова частина сторінки стає великою, краще не розширювати один файл
нескінченно. Створи окремий набір файлів:

```text
src/mvc/favorites.model.ts
src/mvc/favorites.view.ts
src/mvc/favorites.controller.ts
```

Потім створи окремий entrypoint або підключи модуль у `src/main.ts`:

```ts
const root = document.querySelector<HTMLElement>('[data-favorites]');

if (root) {
  const model = new FavoritesModel();
  const view = new FavoritesView(root);
  const controller = new FavoritesController(model, view);

  controller.init();
}
```

HTML:

```html
<section data-favorites></section>
```

## Типовий порядок зміни MVC

1. Почни з Model: які дані потрібні і звідки вони беруться.
2. Онови `state`, типи і методи Model.
3. Онови View: які елементи потрібні і як показати `state`.
4. Додай методи View для нових подій.
5. Онови Controller: підключи події до методів Model.
6. Перевір, що View не імпортує API, а Model не працює з DOM.
7. Запусти `npm run typecheck`.
8. Запусти `npm run build`.

## Чекліст нового компонента

1. Назви компонент коротко і зрозуміло.
2. Створи HTML у `src/partials` або контейнер з `data-*` атрибутом.
3. Додай CSS у `src/css` або `src/css/components`.
4. Імпортуй CSS у `src/css/styles.css`.
5. Якщо потрібен JavaScript, додай `data-*` атрибути в HTML.
6. Якщо потрібен API, винеси стан і запити в Model.
7. Перевір `npm run typecheck`.
8. Перевір `npm run build`.
