# SaaS Frontend Structure

**App root:** `web/`  
**Brand:** CEZCON CRM (`src/assets/logo.png`)  
**Theme:** Ink & Cyan shell · magenta brand CTAs (logo accent)  
**Stack:** Vite + React + TypeScript · Tailwind · React Router · TanStack Query · Zustand  
**Pattern:** Feature modules

## Tree

```
web/src/
  app/           # providers, router, App
  layouts/       # AuthLayout, AppLayout
  features/      # domain modules (auth, dashboard, leads, tasks, …)
    <module>/
      pages/
      components/
      hooks/
      api/
      types/
      index.ts   # public exports only
  shared/        # cross-module UI + utils
  lib/           # api client, queryClient
  stores/        # Zustand (auth, ui)
```

## Rules

- Import features via `@/features/<name>` (`index.ts`), not deep paths.
- Put server state in TanStack Query; light UI/session state in Zustand.
- Keep pages thin; logic in feature hooks/api.
