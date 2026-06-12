# Snake

Онлайн-игра «Змейка» в браузере. Два уровня, таблица рекордов, звук и p5.js.

## Запуск

```bash
npm install    # создаёт .env автоматически, если файла нет
npm start      # повторяет setup и запускает сервер
```

Открыть: `http://localhost:1412`

### Режимы

| Режим | Условие | Рекорды |
|---|---|---|
| **Локальный** (по умолчанию) | `.env` пустой | В памяти сервера |
| **Firebase** | заполнены `PROJECT_ID` и `DATABASE_URL` | Firebase Realtime Database |

При первом `npm install` скрипт `scripts/setup.js` копирует `.env.example` → `.env`.

### Firebase (опционально)

1. Создайте проект в [Firebase Console](https://console.firebase.google.com/)
2. Включите **Realtime Database**
3. Скопируйте конфиг веб-приложения в `.env`:

```env
API_KEY=your-api-key
AUTH_DOMAIN=your-project.firebaseapp.com
DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
PROJECT_ID=your-project-id
STORAGE_BUCKET=your-project.appspot.com
MESSAGING_SENDER_ID=123456789
APP_ID=1:123456789:web:abc123
MEASUREMENT_ID=G-XXXXXXXX
PORT=1412
```

4. Запустите `npm start` снова.

## Стек

- [p5.js](https://p5js.org/) — отрисовка и логика
- [Node.js](https://nodejs.org/) + Express — сервер и API рекордов
- Firebase (опционально) — облачные рекорды

Источник: [OutdatedGuy/Outdated-Snake](https://github.com/OutdatedGuy/Outdated-Snake)
