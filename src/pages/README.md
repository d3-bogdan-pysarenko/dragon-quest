# src/pages

TS-логіка окремих сторінок без API.

Приклади:

- `home.ts`
- `favorites.ts`

Кожен файл експортує `init...Page` функцію і перевіряє, чи є на поточній
сторінці потрібний `data-*` контейнер.

```ts
export const initFavoritesPage = (): void => {
  const page = document.querySelector<HTMLElement>('[data-page="favorites"]');

  if (!page) {
    return;
  }
};
```
