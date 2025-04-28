// Food logic

import { state, PLAYGROUND_SIZE } from "./state.js";
import { setCellPosition, isSamePosition } from "./utils";
import { createElement } from "./utils";
import { DOM } from "./dom.js";

export function newFoodElement() {
  // If food doesn't exist yet, create and append it
  if (!DOM.food) {
    DOM.food = createElement("div", { className: "food" });
    DOM.playground.appendChild(DOM.food);
  }

  // Find a free position not occupied by the snake
  do {
    state.foodPosition = getRandomCoords();
  } while (
    state.snakeCoordinates.some((c) => isSamePosition(c, state.foodPosition))
  );

  // Move food to new position
  setCellPosition(DOM.food, ...state.foodPosition);
}

export function foodIsEaten() {
  return isSamePosition(state.snakeCoordinates[0], state.foodPosition);
}

function getRandomCoords() {
  const top = Math.floor(Math.random() * PLAYGROUND_SIZE);
  const left = Math.floor(Math.random() * PLAYGROUND_SIZE);

  return [top, left];
}
