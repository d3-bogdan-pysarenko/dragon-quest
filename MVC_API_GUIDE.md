# MVC and API Guide

This project uses a small MVC-style structure for features that combine state,
API calls, loading/error handling, and DOM rendering.

## Active Structure

- `src/api` contains the API client, request functions, and shared API types.
- `src/mvc/exercises` contains category/exercise list state and rendering.
- `src/mvc/favorites` contains favorites pagination and localStorage-backed state.
- `src/mvc/exercise-modal` contains exercise details and favorite toggling.
- `src/mvc/rating` contains rating modal state and submission.
- `src/mvc/quote` contains quote loading and rendering.
- `src/mvc/subscribe` contains newsletter subscription state and form handling.

The old standalone MVC demo page and `src/mvc/example.*` files have been
removed. Use the active feature folders above as references.

## Responsibility Rules

- Model owns state, persistence, and API calls.
- View owns DOM queries, rendering, and DOM event binding.
- Controller wires model and view together and coordinates user actions.
- Shared DOM helpers belong in `src/utils`.
- Shared browser storage logic belongs in `src/services`.
- API functions and API types belong in `src/api`.

## Adding an API Request

1. Add or update request/response types in `src/api/your-energy.types.ts`.
2. Add the request function in `src/api/your-energy.api.ts`.
3. Use the request from the relevant feature model.
4. Keep request params typed; avoid casting arbitrary strings to API enums.
5. Render loading, success, empty, and error states from the feature view.

## Adding a Feature

Use this structure when a feature has meaningful state or API interaction:

```text
src/mvc/feature-name/
  feature-name.model.ts
  feature-name.view.ts
  feature-name.controller.ts
```

For simple UI-only interactions, use `src/components` instead.

## Entrypoints

- `src/main.ts` is the shared app entrypoint for `index.html` and
  `favorites.html`.
- Each initializer must first check that its root DOM node exists.
- Do not add test/demo HTML files to production entrypoints.

## Checks

Run these before handing off changes:

```bash
npm run typecheck
npm run build
```
