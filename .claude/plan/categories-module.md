# Plan: Categories Module

## Context

В проекте уже есть модель `Category` в Prisma, но она минимальна (только `id` и `name`, без привязки к пользователю). Нужно расширить её до полноценной сущности с иконкой, цветом и привязкой к пользователю, и реализовать полноценный NestJS-модуль по образцу существующего `users` модуля: CQRS, JWT-защита, class-validator.

## Изменения

### 1. Prisma schema — `apps/api/prisma/schema.prisma`

Обновить модель `Category` (убрать `@unique` на `name`, добавить поля и связь с `User`):

```prisma
model Category {
  id        String    @id @default(cuid())
  name      String
  icon      String
  color     String
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  expenses  Expense[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@unique([userId, name])
  @@index([userId])
}
```

Добавить в `User`: `categories Category[]`

После изменений: `pnpm --filter @expense-tracker/api exec prisma migrate dev --name add-category-user`

### 2. Shared types — `packages/shared/src/types.ts`

- Обновить `CategoryDto`: добавить `icon: string`, `color: string`, `userId: string`
- Добавить `CreateCategoryDto`: `{ name: string; icon: string; color: string }`
- `UpdateCategoryDto` — не добавлять, он выводится через `PartialType` (см. ниже)
- Обновить экспорт в `index.ts`

### 3. Модуль категорий — `apps/api/src/categories/`

Структура (по образцу `users` модуля):

```
categories/
  categories.module.ts
  categories.controller.ts
  categories.service.ts
  dto/
    create-category.dto.ts
    update-category.dto.ts
  commands/
    create-category.command.ts
    update-category.command.ts
    delete-category.command.ts
    handlers/
      create-category.handler.ts
      update-category.handler.ts
      delete-category.handler.ts
  queries/
    get-categories-by-user.query.ts
    get-category-by-id.query.ts
    handlers/
      get-categories-by-user.handler.ts
      get-category-by-id.handler.ts
```

Эндпоинты (`/api/categories`), все под `@UseGuards(JwtAuthGuard)`:
- `POST /` — создать категорию
- `GET /` — все категории текущего пользователя
- `PATCH /:id` — обновить
- `DELETE /:id` — удалить

Сервис кидает `NotFoundException` если категория не найдена / не принадлежит пользователю, `ConflictException` при дублировании имени.

### 4. AppModule — `apps/api/src/app.module.ts`

Добавить `CategoriesModule` в `imports`.

## Переиспользуемые паттерны

- `JwtAuthGuard` — `apps/api/src/auth/guards/jwt-auth.guard.ts`
- `@CurrentUser()` — `apps/api/src/auth/decorators/current-user.decorator.ts`
- `PrismaService` — глобальный модуль, инжектировать напрямую
- CQRS-паттерн — `apps/api/src/users/`

---

## Чек-лист

### Prisma
- [x] Обновить модель `Category` в `schema.prisma` (добавить `icon`, `color`, `userId`, `user`, `createdAt`, `updatedAt`; убрать `@unique` на `name`; добавить `@@unique([userId, name])`, `@@index([userId])`)
- [x] Добавить `categories Category[]` в модель `User`
- [x] Запустить миграцию: `prisma db push --accept-data-loss`
- [x] Регенерировать Prisma-клиент: `prisma generate`

### Shared types
- [x] Обновить `CategoryDto` — добавить `icon`, `color`, `userId`
- [x] Добавить интерфейс `CreateCategoryDto`
- [x] Обновить экспорт в `packages/shared/src/index.ts`

### Зависимость
- [x] Установить `@nestjs/mapped-types`: `pnpm --filter @expense-tracker/api add @nestjs/mapped-types`

### DTO (class-validator)
- [x] `dto/create-category.dto.ts` — `@IsString @IsNotEmpty` на `name`, `icon`; `@Matches(/^#[0-9A-Fa-f]{6}$/)` на `color`
- [x] `dto/update-category.dto.ts` — `export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}` (без дублирования полей)

### Commands
- [x] `commands/create-category.command.ts`
- [x] `commands/update-category.command.ts`
- [x] `commands/delete-category.command.ts`
- [x] `commands/handlers/create-category.handler.ts`
- [x] `commands/handlers/update-category.handler.ts`
- [x] `commands/handlers/delete-category.handler.ts`

### Queries
- [x] `queries/get-categories-by-user.query.ts`
- [x] `queries/get-category-by-id.query.ts`
- [x] `queries/handlers/get-categories-by-user.handler.ts`
- [x] `queries/handlers/get-category-by-id.handler.ts`

### Сервис и контроллер
- [x] `categories.service.ts` — методы `create`, `findAllByUser`, `findById`, `update`, `delete`, маппер `toDto()`
- [x] `categories.controller.ts` — 4 эндпоинта, `@UseGuards(JwtAuthGuard)`, `@CurrentUser()`
- [x] `categories.module.ts` — `CqrsModule`, все хендлеры

### Регистрация
- [x] Добавить `CategoriesModule` в `AppModule`

### Проверка
- [x] `pnpm typecheck` проходит без ошибок
