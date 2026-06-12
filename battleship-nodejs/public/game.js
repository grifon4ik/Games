const socket = io();
const SHIP_SIZES = [5, 4, 3, 3, 2];
const GRID_SIZE = 10;

const state = {
  sessionId: null,
  playerId: null,
  gameState: 'lobby',
  currentTurn: null,
  ships: [],
  ownGrid: createEmptyGrid(),
  enemyGrid: createEmptyGrid(),
  placementConfirmed: false
};

const els = {
  lobby: document.getElementById('lobby'),
  game: document.getElementById('game'),
  placement: document.getElementById('placement'),
  sessionList: document.getElementById('sessionList'),
  status: document.getElementById('status'),
  currentSession: document.getElementById('currentSession'),
  currentPlayer: document.getElementById('currentPlayer'),
  gameState: document.getElementById('gameState'),
  currentTurn: document.getElementById('currentTurn'),
  ownGrid: document.getElementById('ownGrid'),
  enemyGrid: document.getElementById('enemyGrid'),
  playerName: document.getElementById('playerName'),
  sessionName: document.getElementById('sessionName'),
  sessionPassword: document.getElementById('sessionPassword'),
  createSessionBtn: document.getElementById('createSessionBtn'),
  refreshSessionsBtn: document.getElementById('refreshSessionsBtn'),
  randomPlacementBtn: document.getElementById('randomPlacementBtn'),
  confirmPlacementBtn: document.getElementById('confirmPlacementBtn')
};

els.createSessionBtn.addEventListener('click', createSession);
els.refreshSessionsBtn.addEventListener('click', () => socket.emit('requestSessions'));
els.randomPlacementBtn.addEventListener('click', randomPlacement);
els.confirmPlacementBtn.addEventListener('click', confirmPlacement);

socket.on('sessionList', renderSessionList);
socket.on('sessionCreated', onSessionCreated);
socket.on('sessionJoined', onSessionJoined);
socket.on('playerJoined', (data) => setStatus(`Players in session: ${data.playerCount}`));
socket.on('shipsPlaced', () => setStatus('Ships placed. Waiting for opponent...'));
socket.on('gameStarted', onGameStarted);
socket.on('moveResult', onMoveResult);
socket.on('moveTimeout', (data) => {
  state.currentTurn = data.currentTurn;
  updateMeta();
});
socket.on('gamePaused', (data) => setStatus(`Game paused by ${data.pausedBy}`));
socket.on('gameResumed', (data) => {
  state.currentTurn = data.currentTurn;
  updateMeta();
  setStatus('Game resumed');
});
socket.on('error', (message) => setStatus(message));

function createEmptyGrid() {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
}

function setStatus(message) {
  els.status.textContent = message;
}

function playerName() {
  return els.playerName.value.trim() || 'Player';
}

function createSession() {
  socket.emit('createSession', {
    playerName: playerName(),
    sessionName: els.sessionName.value.trim() || undefined,
    password: els.sessionPassword.value || null
  });
}

function joinSession(sessionId, hasPassword) {
  let password = null;
  if (hasPassword) {
    password = prompt('Enter session password:');
    if (password === null) {
      return;
    }
  }

  socket.emit('joinSession', {
    sessionId,
    playerName: playerName(),
    password
  });
}

function onSessionCreated(data) {
  state.sessionId = data.sessionId;
  state.playerId = data.playerId;
  showGame();
  setStatus('Game created. Share this page URL with another player to join.');
}

function onSessionJoined(data) {
  state.sessionId = data.sessionId;
  state.playerId = data.playerId;
  showGame();
  setStatus(`Joined as player ${data.playerNumber}`);
}

function showGame() {
  els.lobby.classList.add('hidden');
  els.game.classList.remove('hidden');
  els.placement.classList.remove('hidden');
  els.currentSession.textContent = state.sessionId;
  els.currentPlayer.textContent = playerName();
  state.gameState = 'placing';
  updateMeta();
  renderGrids();
}

function updateMeta() {
  els.gameState.textContent = state.gameState;
  els.currentTurn.textContent = state.currentTurn === state.playerId ? 'You' : 'Opponent';
}

function renderSessionList(sessions) {
  els.sessionList.innerHTML = '';
  sessions.forEach((session) => {
    const li = document.createElement('li');
    const info = document.createElement('span');
    info.textContent = `${session.name || session.id.slice(0, 8)} — ${session.playerCount}/2 — ${session.gameState}${session.hasPassword ? ' 🔒' : ''}`;

    const joinBtn = document.createElement('button');
    joinBtn.type = 'button';
    joinBtn.textContent = 'Join';
    joinBtn.disabled = session.playerCount >= 2;
    joinBtn.addEventListener('click', () => joinSession(session.id, session.hasPassword));

    li.appendChild(info);
    li.appendChild(joinBtn);
    els.sessionList.appendChild(li);
  });
}

function randomPlacement() {
  state.ships = [];
  const occupied = createEmptyGrid();

  for (const size of SHIP_SIZES) {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 200) {
      attempts += 1;
      const horizontal = Math.random() > 0.5;
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);
      const positions = [];

      for (let i = 0; i < size; i += 1) {
        const r = horizontal ? row : row + i;
        const c = horizontal ? col + i : col;
        if (r >= GRID_SIZE || c >= GRID_SIZE || occupied[r][c]) {
          positions.length = 0;
          break;
        }
        positions.push({ row: r, col: c });
      }

      if (positions.length === size) {
        positions.forEach(({ row, col: c }) => {
          occupied[row][c] = 1;
        });
        state.ships.push({ positions });
        placed = true;
      }
    }
  }

  state.ownGrid = occupied.map((row) => row.slice());
  renderGrids();
  setStatus('Random fleet placed. Confirm when ready.');
}

function confirmPlacement() {
  if (state.ships.length !== SHIP_SIZES.length) {
    setStatus('Place ships first (use Random placement).');
    return;
  }

  socket.emit('placeShips', {
    sessionId: state.sessionId,
    playerId: state.playerId,
    ships: state.ships
  });

  state.placementConfirmed = true;
  els.placement.classList.add('hidden');
}

function onGameStarted(data) {
  state.gameState = 'playing';
  state.currentTurn = data.currentTurn;
  updateMeta();
  setStatus('Battle started!');
  renderGrids();
}

function onMoveResult(data) {
  if (data.hit) {
    state.enemyGrid[data.row][data.col] = 2;
  } else {
    state.enemyGrid[data.row][data.col] = 3;
  }

  state.currentTurn = data.currentTurn;
  state.gameState = data.gameOver ? 'finished' : 'playing';
  updateMeta();
  renderGrids();

  if (data.gameOver) {
    const winnerText = data.winner === state.playerId ? 'You won!' : 'You lost!';
    setStatus(`${winnerText} Game over.`);
  } else {
    setStatus(data.hit ? 'Hit!' : 'Miss!');
  }
}

function renderGrids() {
  renderGrid(els.ownGrid, state.ownGrid, false);
  const canFire = state.gameState === 'playing' && state.currentTurn === state.playerId;
  renderGrid(els.enemyGrid, state.enemyGrid, canFire);
}

function renderGrid(container, grid, clickable) {
  container.innerHTML = '';

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      const value = grid[row][col];

      if (value === 1) {
        cell.classList.add('ship');
      } else if (value === 2) {
        cell.classList.add('hit');
      } else if (value === 3) {
        cell.classList.add('miss');
      }

      if (clickable && value === 0) {
        cell.classList.add('clickable');
        cell.addEventListener('click', () => fire(row, col));
      }

      container.appendChild(cell);
    }
  }
}

function fire(row, col) {
  if (state.gameState !== 'playing' || state.currentTurn !== state.playerId) {
    return;
  }

  socket.emit('makeMove', {
    sessionId: state.sessionId,
    playerId: state.playerId,
    row,
    col
  });
}

const params = new URLSearchParams(window.location.search);
const sessionFromUrl = params.get('session');
if (sessionFromUrl) {
  const password = params.get('password') || null;
  socket.emit('joinSession', {
    sessionId: sessionFromUrl,
    playerName: playerName(),
    password
  });
}
