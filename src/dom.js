// All functions for creating DOM elements

import { PLAYGROUND_SIZE } from "./state.js";
import { createElement } from "./utils";

export const DOM = {
  app: document.querySelector("#app"),
  playground: null,
  playgroundGrid: null,
  scoreContainer: null,
  currentScore: null,
  bestScore: null,
  snake: null,
  food: null,
  tutorialScreen: null,
  countdown: null,
  pauseOverlay: null,
  gameOverOverlay: null,
};

export function renderRootElements() {
  DOM.playground = createElement("div", {
    className: "playground",
  });
  DOM.playgroundGrid = createElement("div", {
    className: "playground__grid",
  });
  DOM.scoreContainer = createElement("div", {
    className: "score",
  });

  DOM.playgroundGrid.innerHTML = "<div></div>".repeat(
    PLAYGROUND_SIZE * PLAYGROUND_SIZE
  );

  DOM.app.appendChild(DOM.playground);
  DOM.playground.appendChild(DOM.scoreContainer);
  DOM.playground.appendChild(DOM.playgroundGrid);
}
