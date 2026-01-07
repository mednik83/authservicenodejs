# Auth Service NodeJS

Микросервис аутентификации на основе Node.js, Express и PostgreSQL. Реализует современную схему работы с **Access** и **Refresh** токенами, а также ротацию токенов для обеспечения безопасности.

## Технологии

- **Backend:** Node.js, Express
- **Language:** TypeScript
- **Database:** PostgreSQL (pg)
- **Security:** JWT (jsonwebtoken), bcrypt
- **Validation:** Zod
- **Documentation:** Swagger UI

---

## Установка и запуск

### 1. Клонирование репозитория

```bash
git clone <url-вашего-репозитория>
cd authservicenodejs
```

````

### 2. Установка зависимостей

```bash
npm install

```

### 3. Настройка окружения

Создайте файл `.env` в корне проекта и заполните его:

```env
PORT=3000

# JWT Secrets
JWT_ACCESS_SECRET=ваш_секрет_для_access
JWT_REFRESH_SECRET=ваш_секрет_для_refresh

# Database
DB_USER=
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=5432
DB_NAME=auth_db

```

### 4. Запуск проекта

**Режим разработки (с hot-reload):**

```bash
npm run dev

```

**Сборка и запуск в production:**

```bash
npm run build
npm run start

```

---

## Скрипты

- `npm run dev` — запуск сервера для разработки через `ts-node-dev`.
- `npm run build` — компиляция TypeScript в JavaScript (директория `dist`).
- `npm run lint` — проверка кода линтером (запрещены `console.log` и неиспользуемые переменные).
- `npm run format` — автоматическое форматирование кода через Prettier.

---

## API Эндпоинты

Документация доступна по адресу: `http://localhost:3000/api-docs`

| Метод | Эндпоинт         | Описание                                 |
| ----- | ---------------- | ---------------------------------------- |
| POST  | `/auth/register` | Регистрация нового пользователя          |
| POST  | `/auth/login`    | Вход и получение пары токенов            |
| POST  | `/auth/refresh`  | Обновление Access токена через Refresh   |
| GET   | `/auth/me`       | Получение профиля (требует Bearer токен) |
| GET   | `/auth/verify`   | Проверка валидности текущего сеанса      |


````
