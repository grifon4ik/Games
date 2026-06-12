# Snake

Online Snake game in the browser. Two levels, high-score table, sound effects, and p5.js graphics.

## Quick start

```bash
npm install    # creates .env automatically if missing
npm start      # runs setup, then starts the server
```

Open: `http://localhost:1412`

### Modes

| Mode | When | High scores |
|---|---|---|
| **Local** (default) | empty `.env` or placeholders | In-memory on server |
| **Firebase** | `PROJECT_ID` + `DATABASE_URL` set in `.env` | Firebase Realtime Database |

On first `npm install`, `scripts/setup.js` copies `.env.example` → `.env`.

### Firebase (optional)

1. Create a project in [Firebase Console](https://console.firebase.google.com/)
2. Enable **Realtime Database**
3. Copy the web app config into `.env`:

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

4. Run `npm start` again.

### AWS / EC2

- Set `HOST=127.0.0.1` and `PORT=1412` when running behind nginx (Lesson 6 Ansible playbook does this via systemd).
- Firebase is not required on EC2; local in-memory scores work by default.

## Stack

- [p5.js](https://p5js.org/) — rendering and game logic
- [Node.js](https://nodejs.org/) + Express — server and score API
- Firebase (optional) — cloud high scores

Source: [OutdatedGuy/Outdated-Snake](https://github.com/OutdatedGuy/Outdated-Snake)
