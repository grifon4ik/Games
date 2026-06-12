# Games

DevOps course game projects.

## Projects

| Game | Stack | Path |
|---|---|---|
| Battleship | Node.js, Express, Socket.io | [battleship-nodejs/](battleship-nodejs/) |
| Pac-Man | Next.js, static build | [pacman2.0/](pacman2.0/) |

## battleship-nodejs

Multiplayer Battleship in the browser.

```bash
cd battleship-nodejs
npm install
npm start
# http://localhost:3000
```

Deployed via Ansible Lesson 6: `git clone` → `npm install` → systemd + nginx.

## pacman2.0

Classic Pac-Man arcade game in the browser.

```bash
cd pacman2.0
npm install
npm run build
npm start
# http://localhost:3000
```

Source: [grifon4ik/pacman2.0](https://github.com/grifon4ik/pacman2.0)
