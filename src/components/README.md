# src/components

TS-логіка маленьких інтерактивних компонентів без API.

Приклади:

- `burger-menu.ts`
- `modal.ts`
- `tabs.ts`
- `search-form.ts`

Кожен файл експортує `init...` функцію, а `src/main.ts` тільки імпортує й
запускає її.

```ts
export const initBurgerMenu = (): void => {
  const button = document.querySelector<HTMLButtonElement>('[data-burger-open]');

  if (!button) {
    return;
  }
};
```

