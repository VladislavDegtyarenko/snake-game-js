// Holds game state

// src/state.js

export const PLAYGROUND_SIZE = 9;

export const STATUS = {
  RUNNING: "is_running",
  PAUSED: "is_paused",
  GAME_OVER: "is_game_over",
};

export const SPEED = {
  easy: 400,
  medium: 250,
  hard: 125,
};

export const DIRECTION = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
};

export const state = {
  snakeCoordinates: [], // [[row, cell], [row, cell], ...]
  foodPosition: [], // [row, cell] generated randomly
  level: null, // "easy", "medium", "hard", or null
  gameStatus: null, // IS_RUNNING, IS_PAUSED, IS_GAME_OVER or null
  direction: null, // "up", "down", "left" or "right"
  lastDirection: null, // saves previous move direction
  moveInterval: null, // setInterval will be assigned to this variable
};

export function resetState() {
  state.snakeCoordinates = [];
  state.foodPosition = [];
  state.level = null;
  state.gameStatus = null;
  state.direction = null;
  state.lastDirection = null;

  if (state.moveInterval) {
    clearInterval(state.moveInterval);
    state.moveInterval = null;
  }
}
