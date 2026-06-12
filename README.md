# Games

Коллекция браузерных игр и мини-приложений для курса DevOps.

**Репозиторий:** [github.com/grifon4ik/Games](https://github.com/grifon4ik/Games)

```bash
git clone https://github.com/grifon4ik/Games.git
cd Games
```

---

## Список проектов

| Игра | Папка | Язык / стек | Тип | Порт (локально) |
|---|---|---|---|---|
| **Battleship** | [battleship-nodejs/](battleship-nodejs/) | Node.js, Express, Socket.io | Multiplayer (WebSocket) | 3000 |
| **Pac-Man** | [pacman2.0/](pacman2.0/) | JavaScript (Vanilla JS + Next.js) | Single-player arcade | 8080 / 3000 |
| **Dad Jokes** | [deadjokes/](deadjokes/) | HTML, CSS, JavaScript | Static + REST API | 8080 |

---

## battleship-nodejs

Мультиплеерный «Морской бой» в браузере. Два игрока, сессии, расстановка кораблей, ходы в реальном времени.

| | |
|---|---|
| **Backend** | Node.js, Express |
| **Realtime** | Socket.io |
| **Frontend** | HTML, CSS, Vanilla JS |

### Запуск локально

```bash
cd battleship-nodejs
npm install
npm start
```

Открыть: `http://localhost:3000` (два окна/вкладки = два игрока).

### DevOps (Lesson 6)

Деплой через Ansible: `git clone` → `npm install` → systemd + nginx (80 → 3000).

Источник: [jaydio/battleship-nodejs](https://github.com/jaydio/battleship-nodejs)

---

## pacman2.0

Классический Pac-Man в браузере. Оригинальная логика на Vanilla JavaScript; в репозитории также есть обёртка Next.js.

| | |
|---|---|
| **Игра** | Vanilla JavaScript, Canvas |
| **Сборка (опционально)** | Next.js 13 |
| **Инфра (опционально)** | Docker, Kubernetes manifests в `k8s/` |

### Запуск (простой способ)

```bash
cd pacman2.0
python3 -m http.server 8080
```

Открыть: `http://localhost:8080`

### Запуск через Next.js

```bash
cd pacman2.0
npm install
npm run build
npm start
```

Открыть: `http://localhost:3000`

Источник: [grifon4ik/pacman2.0](https://github.com/grifon4ik/pacman2.0) (форк [masonicGIT/pacman](https://github.com/masonicGIT/pacman))

---

## deadjokes

Генератор случайных dad jokes через публичное API.

| | |
|---|---|
| **Frontend** | HTML, CSS, Vanilla JavaScript |
| **API** | [icanhazdadjoke.com](https://icanhazdadjoke.com) |

### Запуск

```bash
cd deadjokes
python3 -m http.server 8080
```

Открыть: `http://localhost:8080`

> Не открывайте `index.html` через `file://` — fetch к API может не работать. Нужен HTTP-сервер.

Источник: [femiakinola/deadjokes](https://github.com/femiakinola/deadjokes)

---

## Структура репозитория

```text
Games/
├── README.md
├── .gitignore
├── battleship-nodejs/     # Node.js + Socket.io
├── pacman2.0/             # Vanilla JS (+ Next.js)
└── deadjokes/             # Static HTML + external API
```

---

## Что не коммитится

См. [.gitignore](.gitignore): `node_modules/`, `.next/`, `.env`, `*.pem`, runtime-файлы игр.

---

## DevOps-уроки

| Урок | Игра | Инструменты |
|---|---|---|
| Lesson 5 | nginx + static page | Terraform + Ansible |
| Lesson 6 | Battleship | Terraform + Ansible + `git clone` |

Playbook Lesson 6 клонирует этот репозиторий на EC2:

```yaml
git_repo: "https://github.com/grifon4ik/Games.git"
app_dir: /opt/Games/battleship-nodejs
```
