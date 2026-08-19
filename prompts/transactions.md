# Новая функциональность
Модуль транзакций

## Контекст (что уже есть)
- NestJS + Next.js + PostgreSQL + Prisma
- Авторизация (JWT), модуль категорий

## Задача
Создай TransactionsModule - центральный модуль приложения для учета доходов и расходов

## Модель данных
Добавь модель Transaction
- id 
- amount
- type (INCOME, EXPENSE)
- description
- date
- categoryId (связь с Category)
- userId (свзяь с User)
- createdAt

Обнови модели User и Category - добавь обратные связи с Transaction 

## Контроллер и эндпоинты
- POST /transactions  - создать транзакцию
- GET /transactions - список с query параметрами dateFrom, dateTo, type, categoryId (по пользователю)
- GET /transactions/:id - одна транзакция
- PATCH /transactions/:id - обновить транзакцию
- DELETE /transactions/:id - удалить транзакцию

## Паттерн
- Следуй структуре модуля из src/modules/categories/
- Взаимодействие через CQRS

## Ограничения
- Не добавлять зависимости, если явно не указано в задаче
- Использовать clss-validator для dto
- После реализации запустить сборку