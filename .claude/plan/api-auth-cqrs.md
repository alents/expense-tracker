# План: авторизация и профиль пользователя в API

## Context

В `apps/api` (NestJS 11 + Prisma/PostgreSQL) сейчас нет никакой авторизации: есть только
`PrismaModule` и модель `User` с полями `id`, `email`, `name`. Нужно добавить модуль
авторизации (сущность с хэшем пароля, email и доп. полями), методы `register`
и `login`, возвращающие JWT, а также модуль профиля пользователя.

Решения по итогам уточнений:
- Токены: **только access-JWT** (один токен, срок ~7 дней).
- Хэширование паролей: **bcrypt**.
- Вход и идентификация: **по email**. Отдельного поля `login` нет — email служит
  единственным идентификатором.
- **Взаимодействие между модулями — через CQRS** (`@nestjs/cqrs`): только команды и
  запросы (`CommandBus`/`QueryBus`), **без EventBus/доменных событий**. Сервисы
  (`AuthService`, `UsersService`) **сохраняем** как оркестраторов; канонический CQRS
  (вся логика в handler'ах, контроллер только диспатчит) на этом этапе **не делаем**.
  Ключевое правило: `AuthModule` не инжектит `UsersService` напрямую — обращается к
  модулю Users только через шину (команды/запросы).

## Изменения

### 1. Зависимости (`apps/api/package.json`) ✅
Установить через pnpm (workspace-фильтр):
```
pnpm --filter @expense-tracker/api add @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt @nestjs/config class-validator class-transformer @nestjs/cqrs
pnpm --filter @expense-tracker/api add -D @types/passport-jwt @types/bcrypt
```

### 2. Схема Prisma (`apps/api/prisma/schema.prisma`) ✅
Расширить модель `User`:
```prisma
model User {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String
  name         String?
  role         String    @default("user")   // доп. поле
  isActive     Boolean   @default(true)      // доп. поле
  expenses     Expense[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}
```
Миграция `add_auth_fields` применена, клиент сгенерирован.

### 3. Конфигурация окружения ✅
- `.env.example` и `.env`: добавлены
  ```
  JWT_SECRET="change-me"
  JWT_EXPIRES_IN="7d"
  ```
- `apps/api/src/app.module.ts`: подключён `ConfigModule.forRoot({ isGlobal: true })`,
  а также новые `AuthModule` и `UsersModule`.

### 4. Глобальная валидация (`apps/api/src/main.ts`) ✅
Добавлен `app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))`.

### 5. Shared-типы (`packages/shared/src/types.ts` + `index.ts`) ✅
Добавлены и экспортированы:
```ts
export interface RegisterDto { email: string; password: string; name?: string; }
export interface LoginDto { email: string; password: string; }
export interface AuthResponseDto { accessToken: string; user: UserDto; }
```
`UserDto` дополнен полем `role`.

### 6. Модуль Users — профиль + CQRS-граница (`apps/api/src/users/`) ✅
- `users.service.ts` — методы: `findById`, `findByEmail`, `create`, `update`.
- CQRS-обёртки:
  - `commands/create-user.command.ts` + `commands/handlers/create-user.handler.ts`
  - `queries/get-user-by-email.query.ts` + handler
  - `queries/get-user-by-id.query.ts` + handler
  - `index.ts` реэкспортит классы команд/запросов.
- `users.controller.ts` — `GET /api/users/me`, `PATCH /api/users/me`.
- `users.module.ts` — `imports: [CqrsModule]`, все handler'ы зарегистрированы.

### 7. Модуль Auth (`apps/api/src/auth/`) ✅
- `dto/register.dto.ts`, `dto/login.dto.ts` с декораторами `class-validator`.
- `auth.service.ts` — общается с Users только через `CommandBus`/`QueryBus`.
- `auth.controller.ts` — `POST /api/auth/register`, `POST /api/auth/login`.
- `strategies/jwt.strategy.ts` — `PassportStrategy(Strategy)`.
- `guards/jwt-auth.guard.ts` — `AuthGuard('jwt')`.
- `decorators/current-user.decorator.ts` — `@CurrentUser()`.
- `auth.module.ts` — импортирует `CqrsModule`, `JwtModule`, `PassportModule`, `UsersModule`.

## Критичные файлы
- `apps/api/prisma/schema.prisma` — поля авторизации
- `apps/api/src/app.module.ts`, `apps/api/src/main.ts` — подключение модулей и ValidationPipe
- `apps/api/src/auth/*`, `apps/api/src/users/*` — новые модули (с `commands/` и `queries/` для CQRS)
- `packages/shared/src/types.ts`, `packages/shared/src/index.ts` — DTO
- `.env` / `.env.example` — JWT-переменные

## Verification ✅
1. ✅ `pnpm install` выполнен.
2. ✅ `prisma generate` + `migrate dev --name add_auth_fields` применены.
3. ✅ `pnpm typecheck` — проходит без ошибок.
4. ✅ API стартует на :3001.
5. ✅ Ручная проверка пройдена:
   - `POST /api/auth/register` → 201, `accessToken` + `user` без хэша.
   - `POST /api/auth/login` → `accessToken`.
   - `GET /api/users/me` с токеном → профиль; без токена → 401.
   - Повторная регистрация с тем же email → 409 Conflict.
