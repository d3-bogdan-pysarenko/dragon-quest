# Повідомлення для команди

Привіт. Додав у проєкт базову структуру для роботи з API, MVC і компонентами.

Повна інструкція лежить у `MVC_API_GUIDE.md`. Там є приклади коду й детальний
опис, як додавати компоненти, API-запити та зміни в MVC.

## Як запустити

```bash
npm install
npm run dev
```

Після запуску відкрити:

```text
http://localhost:5173
```

## Що де лежить

- `src/index.html` - основна сторінка.
- `src/main.ts` - основний entrypoint для `index.html` і `favorites.html`.
- `src/components` - TS-логіка маленьких інтерактивних компонентів без API.
- `src/pages` - TS-логіка окремих сторінок без API.
- `src/api` - API client, типи й готові запити.
- `src/mvc` - production features у стилі Model/View/Controller.
- `MVC_API_GUIDE.md` - детальна інструкція для роботи.

## Короткі правила

- Компоненти без JS робимо через `src/partials`.
- Повторювані маленькі компоненти кладемо в `src/partials/components`.
- CSS додаємо в `src/css` або `src/css/components` і імпортуємо в
  `src/css/styles.css`.
- У назвах класів використовуємо дефіси, без подвійного підкреслення.
- Інтерактивність без API пишемо тільки в окремому TS-файлі: `src/components`
  для малих компонентів, `src/pages` для сторінок.
- У `main.ts` лише імпортуємо й запускаємо `init...` функції.
- Якщо `main.ts` підключений на кількох сторінках, кожен модуль має перевіряти
  свій `data-*` контейнер і не запускатись на чужій сторінці.
- API-запити додаємо через `src/api`.
- Якщо є стан, API, loading/error або кілька дій користувача - використовуємо
  MVC.

## Toast-сповіщення (notyf)

У проєкт додано готовий компонент для показу toast-сповіщень у правому верхньому
куті.

### Як використовувати

```ts
import { showToast } from './components/toast';

// Успіх
showToast('Done!', 'success');

// Помилка
showToast('Something went wrong. Please try again.', 'error');
```

> Шлях до імпорту залежить від того, де лежить ваш файл. Наприклад, з
> `src/mvc/yourfeature/yourfeature.controller.ts` шлях буде
> `../../components/toast`.

### Де показувати toast

- **Успіх після API-запиту** → закрити модал/форму → показати success toast.
- **Помилка API без повідомлення** → тільки error toast.
- **Помилка API з повідомленням** → показати повідомлення inline у формі + error
  toast.

Стилі toast підключені автоматично через `src/css/components/toast.css` та
імпорт у `styles.css` — нічого додатково підключати не потрібно.

## Перед здачею змін

Запустити перевірки:

```bash
npm run typecheck
npm run build
```

Якщо потрібен приклад реалізації, дивіться активні feature-папки в `src/mvc`.
