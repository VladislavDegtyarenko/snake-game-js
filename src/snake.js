// Snake logic

import { DOM } from "./dom.js";
import { state, PLAYGROUND_SIZE } from "./state.js";
import { setCellPosition } from "./utils/setCellPosition.js";
import { newFoodElement, foodIsEaten } from "./food.js";
import { updateScore } from "./ui.js";
import { playSound } from "./sounds.js";
import { isGameOver, gameOver } from "./ui.js";
import { createElement } from "./utils";

export function snakeInit() {
  const snake = createElement("div", {
    className: "snake",
  });
  DOM.snake = snake;

  DOM.playground.appendChild(snake);

  const middle = (PLAYGROUND_SIZE - 1) / 2;
  state.snakeCoordinates = [
    [3, middle],
    [2, middle],
    [1, middle],
  ];
  state.direction = "down";

  snakeReRenderCells();
}

export function snakeMove() {
  let [top, left] = state.snakeCoordinates[0];

  switch (state.direction) {
    case "up":
      top--;
      break;
    case "down":
      top++;
      break;
    case "left":
      left--;
      break;
    case "right":
      left++;
      break;
  }

  top = (top + PLAYGROUND_SIZE) % PLAYGROUND_SIZE;
  left = (left + PLAYGROUND_SIZE) % PLAYGROUND_SIZE;

  state.snakeCoordinates.unshift([top, left]);

  if (foodIsEaten()) {
    newFoodElement();
    updateScore();
    playSound("eat");
  } else {
    state.snakeCoordinates.pop();
  }

  snakeReRenderCells();
  state.lastDirection = state.direction;

  if (isGameOver()) gameOver();
}

function snakeReRenderCells() {
  DOM.snake.innerHTML = ""; // clear

  for (const [top, left] of state.snakeCoordinates) {
    const cell = createElement("div");
    setCellPosition(cell, top, left);
    DOM.snake.appendChild(cell);
  }
}
