# Auth Service (Node.js)

Сервис аутентификации на **Node.js + Express + PostgreSQL**.
Реализует регистрацию и аутентификацию пользователей с использованием **Access / Refresh JWT**, включая ротацию refresh-токенов.

Проект подходит как учебный backend, так и как основа для микросервисной архитектуры.

---

## Стек технологий

- **Node.js**, **Express**
- **TypeScript**
- **PostgreSQL** (`pg`)
- **JWT** (`jsonwebtoken`)
- **bcrypt**
- **Zod** — валидация данных
- **Swagger UI** — документация API

---

## Установка и запуск

### 1. Клонирование репозитория

```bash
git clone https://github.com/mednik83/authservicenodejs.git
cd authservicenodejs
```

---

### 2. Установка зависимостей

```bash
npm install
```

---

### 3. Настройка окружения

Создай файл `.env` в корне проекта:

```env
PORT=3000

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Database
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=auth_db
```

---

### 4. Запуск проекта

#### Режим разработки (hot-reload)

```bash
npm run dev
```

#### Production-сборка

```bash
npm run build
npm run start
```

---

## Скрипты

| Команда          | Описание                   |
| ---------------- | -------------------------- |
| `npm run dev`    | Запуск в режиме разработки |
| `npm run build`  | Сборка TypeScript в `dist` |
| `npm run start`  | Запуск production-версии   |
| `npm run lint`   | Проверка кода ESLint       |
| `npm run format` | Форматирование Prettier    |

---

## API

Swagger-документация доступна по адресу:

```
http://localhost:3000/api-docs
```

### Основные эндпоинты

| Метод | URL              | Описание                        |
| ----- | ---------------- | ------------------------------- |
| POST  | `/auth/register` | Регистрация пользователя        |
| POST  | `/auth/login`    | Аутентификация и выдача токенов |
| POST  | `/auth/refresh`  | Обновление Access токена        |
| GET   | `/auth/me`       | Получение данных пользователя   |
| GET   | `/auth/verify`   | Проверка валидности токена      |
