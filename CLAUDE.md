# CLAUDE.md

Инструкции для Claude Code в этом репозитории.

## Менеджер пакетов

Только **pnpm** (никогда npm/yarn).

## Язык

Все комментарии в коде — на русском языке.

## Команды

```bash
pnpm install                                            # установить зависимости
pnpm dev                                                # все приложения в dev-режиме
pnpm build                                               # собрать все приложения
pnpm typecheck                                           # проверить типы во всех пакетах
pnpm --filter @expense-tracker/api dev                   # только API
pnpm --filter @expense-tracker/web dev                   # только web
pnpm --filter @expense-tracker/api exec prisma generate            # Prisma Client после правок схемы
pnpm --filter @expense-tracker/api exec prisma migrate dev --name <name>  # новая миграция
```

## Архитектура

Монорепо: **pnpm workspaces + Turborepo**.

| Пакет | Роль |
|---|---|
| `apps/api` | Nest.js, порт 3001, префикс `/api`, CQRS (`@nestjs/cqrs`) |
| `apps/web` | Next.js 15, App Router, Feature-Sliced Design |
| `packages/shared` | Общие типы/DTO, импортируются как raw TS (`@expense-tracker/shared`), без сборки |

Важные детали:
- Prisma-схема только в `apps/api/prisma/schema.prisma`. `PrismaService` — глобальный модуль Nest, инжектится напрямую в любой модуль без импорта `PrismaModule`.
- `apps/api`: `module: CommonJS` (нужно для декораторов). `apps/web` и `packages/shared`: `module: ESNext`.
- Переменные окружения — из корневого `.env` (шаблон в `.env.example`). Обязательна только `DATABASE_URL`.
- Новый CQRS-модуль в API повторяет паттерн `apps/api/src/categories/`: `*.module.ts` + `*.controller.ts` (JWT-guard, `@CurrentUser()`) + `*.service.ts` (Prisma + `toDto`) + `commands/`/`queries/` с `*.handler.ts`. Читающий модуль без мутаций (пример: `expenses/`) заводит только `queries/`, без `commands/` и без class-validator DTO для query-параметров.

## Фронтенд: Feature-Sliced Design (`apps/web/src`)

```
app/       — только роутинг Next.js, реэкспорт компонентов из views/
views/     — слой FSD "pages": композиции целых экранов
             (папка называется views/, НЕ pages/ — Next.js App Router
             трактует src/pages/ как Pages Router и ломает build)
widgets/   — крупные самостоятельные блоки UI (nav-bar, transaction-list, …)
features/  — интерактивные пользовательские сценарии (auth, expenses, …)
entities/  — пока не заведён: DTO из @expense-tracker/shared используются
             напрямую как типы сущностей; вводить только когда этого перестанет хватать
shared/    — переиспользуемый код
  api/     — apiFetch, работа с токеном
  ui/      — shadcn-компоненты
  lib/     — утилиты (cn и т.д.)
  config/  — константы окружения
```

Правила:
- Импорты только вниз: `app → views → widgets → features → entities → shared`.
- `app/*/page.tsx` — только `export default XxxPage` из `views/`, без логики.
- shadcn-компоненты — только в `shared/ui/`, ручное размещение (без CLI), стиль `class-variance-authority` + `cn()`.
- Состояние UI фичи — в `features/<name>/model/`.
- **Никогда не создавай `src/pages/`** — конфликтует с Next.js Pages Router и ломает `next build`.

Стек UI: Tailwind CSS v3, shadcn/ui (ручные компоненты), react-hook-form + zod для форм.

## Коммиты

Conventional Commits: `<type>(<scope>): <subject>`.

- Типы: `feat` `fix` `refactor` `chore` `docs` `test` `perf` `ci`.
- Скоупы: `api` `web` `shared` `prisma` `auth` `categories` `transactions`.
- Subject — повелительное наклонение, строчные буквы, без точки: `add jwt auth`.
- Тело коммита объясняет **почему**, а не что.
- Breaking change: `!` после type/scope + футер `BREAKING CHANGE:`.
- Не добавлять футер `Co-Authored-By`.

## Pull request

- Feature-ветки — от `main`, именование `feature/<краткое-имя>`.
- Заголовок PR — по Conventional Commits, как subject коммита: `<type>(<scope>): <subject>`.
- Тело PR — два раздела:
  - `## Summary` — что реализовано, по пунктам; для бэкенда явно перечислять новые/изменённые эндпоинты (метод + путь + краткое назначение).
  - `## Test plan` — чек-лист ручной/автоматической проверки (типчек/билд/сценарии в браузере).
- Перед созданием PR смотреть `git diff main...<branch>`, чтобы описание отражало реальные изменения, а не план.
- Создавать через `gh pr create --title "..." --body "..."`, база — `main`.
