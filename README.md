# Games

Browser games and mini-apps for the DevOps course.

**Repository:** [github.com/grifon4ik/Games](https://github.com/grifon4ik/Games)

```bash
git clone https://github.com/grifon4ik/Games.git
cd Games
```

---

## Projects

| Game | Folder | Stack | Type | Local port |
|---|---|---|---|---|
| **Battleship** | [battleship-nodejs/](battleship-nodejs/) | Node.js, Express, Socket.io | Multiplayer (WebSocket) | 3000 |
| **Pac-Man** | [pacman2.0/](pacman2.0/) | Vanilla JavaScript (+ optional Next.js) | Single-player arcade | 8080 / 3000 |
| **Dad Jokes** | [deadjokes/](deadjokes/) | HTML, CSS, JavaScript | Static + REST API | 8080 |
| **Snake** | [snake/](snake/) | Node.js, Express, p5.js | Single-player + high scores | 1412 |

---

## battleship-nodejs

Multiplayer Battleship in the browser. Two players, ship placement, real-time turns.

| | |
|---|---|
| **Backend** | Node.js, Express |
| **Realtime** | Socket.io |
| **Frontend** | HTML, CSS, Vanilla JS |

### Run locally

```bash
cd battleship-nodejs
npm install
npm start
```

Open: `http://localhost:3000` (two tabs = two players).

### AWS / DevOps (Lesson 6)

Ansible: `git clone` → `npm install` → systemd + nginx (`80 → 3000`, WebSocket enabled).

Source: [jaydio/battleship-nodejs](https://github.com/jaydio/battleship-nodejs)

---

## pacman2.0

Classic Pac-Man in the browser. Vanilla JavaScript core; optional Next.js wrapper in the repo.

| | |
|---|---|
| **Game** | Vanilla JavaScript, Canvas |
| **Build (optional)** | Next.js 13 |
| **Infra (optional)** | Docker, Kubernetes manifests in `k8s/` |

### Run (simple)

```bash
cd pacman2.0
python3 -m http.server 8080
```

Open: `http://localhost:8080`

### Run via Next.js

```bash
cd pacman2.0
npm install
npm run build
npm start
```

Open: `http://localhost:3000`

### AWS / DevOps (Lesson 6)

Ansible serves static files with nginx from `/opt/Games/pacman2.0` on port 80.

Source: [grifon4ik/pacman2.0](https://github.com/grifon4ik/pacman2.0) (fork of [masonicGIT/pacman](https://github.com/masonicGIT/pacman))

---

## deadjokes

Random dad jokes via a public API.

| | |
|---|---|
| **Frontend** | HTML, CSS, Vanilla JavaScript |
| **API** | [icanhazdadjoke.com](https://icanhazdadjoke.com) |

### Run locally

```bash
cd deadjokes
python3 -m http.server 8080
```

Open: `http://localhost:8080`

> Do not open `index.html` via `file://` — the API fetch may fail. Use an HTTP server.

### AWS / DevOps (Lesson 6)

Ansible serves static files with nginx on port 80. Outbound HTTPS to the joke API must be allowed (default EC2 egress).

Source: [femiakinola/deadjokes](https://github.com/femiakinola/deadjokes)

---

## snake

Classic Snake in the browser with two levels and a high-score table.

| | |
|---|---|
| **Game** | p5.js, Canvas |
| **Backend** | Node.js, Express |
| **Scores** | In-memory (default) or Firebase |

### Run locally

```bash
cd snake
npm install
npm start
```

Open: `http://localhost:1412`

> `npm install` creates `.env` from `.env.example` automatically. Firebase is optional — without it, scores are stored in server memory.

### AWS / DevOps (Lesson 6)

Ansible: `git clone` → `npm install` → systemd + nginx (`80 → 1412`). Local score mode works out of the box on EC2.

Source: [OutdatedGuy/Outdated-Snake](https://github.com/OutdatedGuy/Outdated-Snake)

---

## Repository layout

```text
Games/
├── README.md
├── .gitignore
├── battleship-nodejs/     # Node.js + Socket.io
├── pacman2.0/             # Vanilla JS (+ Next.js)
├── deadjokes/             # Static HTML + external API
└── snake/                 # Node.js + p5.js
```

---

## Ignored files

See [.gitignore](.gitignore): `node_modules/`, `.next/`, `.env`, `*.pem`, game runtime files.

---

## DevOps lessons

| Lesson | Game | Tools |
|---|---|---|
| Lesson 5 | nginx + static page | Terraform + Ansible |
| Lesson 6 | Any game from this repo | Terraform + Ansible + `git clone` |

Lesson 6 deploys a **Game Hub** on one EC2 instance:

```text
http://PUBLIC_IP/              → hub menu
http://PUBLIC_IP/battleship/   → Battleship
http://PUBLIC_IP/snake/        → Snake
http://PUBLIC_IP/pacman/       → Pac-Man
http://PUBLIC_IP/jokes/        → Dad Jokes
```

```bash
ansible-playbook -i ../hosts ansible-playbook-gamehub.yaml
```

See `DevOps_2026_May_18/Practice/Lesson_6/ansible/` in the course repo.
