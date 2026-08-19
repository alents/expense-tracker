# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package manager

Always use **pnpm**. Never use npm or yarn.

## Common commands

```bash
# Install all dependencies
pnpm install

# Run all apps in dev mode
pnpm dev

# Build all apps
pnpm build

# Type-check all packages
pnpm typecheck

# Run only the API
pnpm --filter @expense-tracker/api dev

# Run only the web
pnpm --filter @expense-tracker/web dev

# Prisma: generate client after schema changes
pnpm --filter @expense-tracker/api exec prisma generate

# Prisma: create and apply a migration
pnpm --filter @expense-tracker/api exec prisma migrate dev --name <name>
```

## Architecture

Monorepo managed by **pnpm workspaces + Turborepo**.

```
apps/api    — Nest.js backend (port 3001), prefix /api
apps/web    — Next.js 15 frontend (App Router)
packages/shared — shared TypeScript types and DTOs (no build step, imported as raw TS)
```

### Key conventions

- `packages/shared` is consumed as source (`main: ./src/index.ts`), not compiled. Both apps reference it via the `@expense-tracker/shared` workspace alias.
- **Prisma** lives entirely in `apps/api/prisma/schema.prisma`. The `PrismaService` (`apps/api/src/prisma/`) is a global Nest.js module — inject `PrismaService` directly in any feature module without re-importing `PrismaModule`.
- The API's `tsconfig.json` uses `"module": "CommonJS"` + `"emitDecoratorMetadata": true` (required by Nest.js decorators). The web and shared packages use `"module": "ESNext"`.
- Environment variables are loaded from a root `.env` file (copy `.env.example`). Only `DATABASE_URL` is required to start.

## Frontend architecture (FSD)

`apps/web` uses **Feature-Sliced Design** within Next.js 15 App Router.

```
src/
  app/          — Next.js routing only (thin re-exports of FSD pages)
  pages/        — FSD pages layer: full-page compositions
  widgets/      — FSD widgets: complex self-contained UI blocks
  features/     — FSD features: interactive user-facing slices
  entities/     — FSD entities: business objects and their models
  shared/       — FSD shared: reusable cross-layer code
    api/        — base fetch client (apiFetch, token helpers)
    ui/         — shadcn components (button, input, card, form, …)
    lib/        — utilities (cn, etc.)
    config/     — environment constants (NEXT_PUBLIC_API_URL)
```

### FSD rules

- **Imports go downward only**: `app` → `pages` → `widgets` → `features` → `entities` → `shared`. Never import from a higher layer.
- Each slice exports only through its public API (`index.ts`). Do not import internal files of another slice directly.
- `app/` pages are thin wrappers — they only re-export the corresponding FSD page component.
- shadcn components live in `shared/ui/`, not in `components/ui/`.
- UI state colocated with the feature in `features/<name>/model/`.

### UI stack

- **Tailwind CSS v3** — configured in `tailwind.config.ts`, CSS variables in `globals.css`
- **shadcn/ui** components in `shared/ui/` (manually placed, no CLI required)
- **react-hook-form + zod** for form validation in feature UI components
