// Score, Menus, Game over, Pause

import logoImg from "../snake.svg";
import { DOM } from "./dom.js";
import { state, resetState, STATUS, SPEED } from "./state.js";
import { snakeInit, snakeMove } from "./snake.js";
import { newFoodElement } from "./food.js";
import { playSound } from "./sounds.js";
import { createElement } from "./utils";
import { getBestScoreLabel } from "./utils/getBestScoreLabel.js";
import { handleGameplayControls } from "./controls.js";

export function showScoreElements() {
  const currentScore = createElement("div", {
    className: "score__current",
    text: "0",
  });

  const bestScore = createElement("div", {
    className: "score__best",
    text: getBestScoreLabel(
      state.level,
      localStorage.getItem(state.level) || 0
    ),
  });

  DOM.currentScore = currentScore;
  DOM.bestScore = bestScore;

  DOM.scoreContainer.append(currentScore, bestScore);
}

export function updateScore() {
  if (DOM.currentScore) {
    const score = state.snakeCoordinates.length - 3;
    DOM.currentScore.textContent = score;
  }
}

export function updateBestScore(score) {
  if (DOM.bestScore) {
    DOM.bestScore.textContent = getBestScoreLabel(state.level, score);
  }
}

export function removeScoreElements() {
  DOM.currentScore?.remove();
  DOM.bestScore?.remove();

  DOM.currentScore = null;
  DOM.bestScore = null;
}

export function toggleInactiveClass() {
  DOM.snake?.classList.toggle("inactive");
  DOM.food?.classList.toggle("inactive");
}

export function isGameOver() {
  const [head, ...body] = state.snakeCoordinates;
  return body.some((cell) => cell[0] === head[0] && cell[1] === head[1]);
}

export function gameOver() {
  clearInterval(state.moveInterval);

  document.removeEventListener("keydown", handleGameplayControls);
  state.gameStatus = STATUS.GAME_OVER;

  const score = parseInt(DOM.currentScore?.textContent || "0");
  const best = parseInt(localStorage.getItem(state.level)) || 0;

  DOM.gameOverOverlay = createElement("div", {
    className: "game-overlay",
    text: score > best ? "Best Score!" : "Game Over!",
  });

  if (score > best) {
    localStorage.setItem(state.level, score);
    playSound("bestScore");
    updateBestScore(score);
  } else {
    playSound("gameOver");
  }

  DOM.playground.appendChild(DOM.gameOverOverlay);

  const restart = () => {
    document.removeEventListener("click", restart);
    document.removeEventListener("keydown", restart);

    DOM.snake?.remove();
    DOM.snake = null;

    DOM.food?.remove();
    DOM.food = null;

    DOM.gameOverOverlay.remove();
    DOM.gameOverOverlay = null;

    resetState();
    removeScoreElements();
    showMainMenu();
  };

  document.addEventListener("click", restart);
  document.addEventListener("keydown", restart);
}

export function showMainMenu() {
  const mainScreen = createElement("div", { className: "main-screen" });

  const logo = createElement("img", {
    className: "main-screen__logo",
    attrs: { src: logoImg },
  });

  const mainTitle = createElement("h1", {
    className: "main-screen__title",
    text: "Snake Game",
  });

  const mainDescr = createElement("h3", {
    className: "main-screen__descr",
    text: "Choose Level",
  });

  const levels = ["easy", "medium", "hard"];
  const levelButtons = levels.map((level) =>
    createElement("button", {
      className: "button",
      text: level,
    })
  );

  mainScreen.append(logo, mainTitle, mainDescr, ...levelButtons);
  DOM.playground.appendChild(mainScreen);

  let activeButton = levelButtons[0];
  activeButton.focus();

  const handleButtonHover = (e) => {
    if (levelButtons.includes(e.target)) {
      activeButton = e.target;
      activeButton.focus();
      playSound("menuHover");
    } else {
      activeButton?.blur();
      activeButton = null;
    }
  };

  const handleTabPress = (e) => {
    const isLeft = e.key === "ArrowLeft" || (e.key === "Tab" && e.shiftKey);
    const isRight = e.key === "ArrowRight" || e.key === "Tab";

    if (!isLeft && !isRight) return;

    e.preventDefault();
    playSound("menuHover");

    requestAnimationFrame(() => {
      const index = levelButtons.indexOf(document.activeElement);
      const nextIndex = isLeft
        ? (index - 1 + levelButtons.length) % levelButtons.length
        : (index + 1) % levelButtons.length;

      activeButton = levelButtons[nextIndex];
      activeButton.focus();
    });
  };

  const handleLevelSelect = (e) => {
    if (!e.target.matches("button")) return;

    const selectedLevel = e.target.textContent;

    document.removeEventListener("keydown", handleTabPress);
    mainScreen.removeEventListener("mouseover", handleButtonHover);
    mainScreen.remove();

    document.addEventListener("keydown", handleGameplayControls);

    prepareGame(selectedLevel);
  };

  document.addEventListener("keydown", handleTabPress);
  mainScreen.addEventListener("mouseover", handleButtonHover);
  mainScreen.addEventListener("click", handleLevelSelect);
}

function prepareGame(level) {
  state.level = level;
  snakeInit();
  newFoodElement();
  toggleInactiveClass();
  showScoreElements();
  beforeStart();
}

function beforeStart() {
  tutorialScreen(countdownBeforeStart);
}

function tutorialScreen(callback) {
  DOM.tutorialScreen = createElement("div", {
    className: "game-overlay",
  });

  const heading = createElement("h2", {
    text: "Tutorial",
  });

  const p1 = createElement("p", {
    html: "Use <strong>↑↓←→</strong> or <strong>WASD</strong> to move the snake.",
  });

  const p2 = createElement("p", {
    html: "Hit <strong>Space bar</strong> to pause the game.",
  });

  const p3 = createElement("p", {
    text: "Press any key to continue",
  });

  DOM.tutorialScreen.appendChild(heading);
  DOM.tutorialScreen.appendChild(p1);
  DOM.tutorialScreen.appendChild(p2);
  DOM.tutorialScreen.appendChild(p3);

  DOM.playground.appendChild(DOM.tutorialScreen);

  const pressAnyKey = (e) => {
    if (e.key) {
      DOM.tutorialScreen.remove();
      DOM.tutorialScreen.null;
      document.removeEventListener("keydown", pressAnyKey);
      callback();
    }
  };

  document.addEventListener("keydown", pressAnyKey);
}

function countdownBeforeStart() {
  const messages = ["3", "2", "1", "GO!"];
  const interval = 700;

  DOM.countdown = createElement("div", {
    className: "countdown",
  });
  DOM.countdown.style.setProperty("--interval", `${interval}ms`);

  const inner = createElement("span", {
    className: "countdown__inner",
  });

  DOM.countdown.appendChild(inner);

  DOM.playground.appendChild(DOM.countdown);

  messages.forEach((m, i) => {
    setTimeout(() => {
      DOM.countdown.children[0].textContent = m;
      playSound(i < 3 ? "preCount" : "start");
    }, interval * i);
  });

  setTimeout(() => {
    DOM.countdown.remove();
    DOM.countdown = null;

    startGame();
  }, interval * messages.length);
}

function startGame() {
  state.gameStatus = STATUS.RUNNING;
  toggleInactiveClass();
  state.moveInterval = setInterval(() => snakeMove(), SPEED[state.level]);
}

export function togglePause() {
  if (state.gameStatus === STATUS.RUNNING) {
    state.gameStatus = STATUS.PAUSED;
    clearInterval(state.moveInterval);
    toggleInactiveClass();
    showPauseOverlay();
    playSound("pause");
  } else if (state.gameStatus === STATUS.PAUSED) {
    state.gameStatus = STATUS.RUNNING;
    toggleInactiveClass();
    hidePauseOverlay();
    playSound("unpause");
    state.moveInterval = setInterval(() => snakeMove(), SPEED[state.level]);
  }
}

export function showPauseOverlay() {
  // Prevent duplicates
  if (DOM.pauseOverlay) return;

  const overlay = createElement("div", {
    className: "game-overlay",
  });

  const title = createElement("h2", {
    text: "Paused",
  });

  const resumeBtn = createElement("button", {
    className: ["button", "button-resume"],
    text: "Resume",
    on: {
      click: () => {
        hidePauseOverlay();
        togglePause();
      },
    },
  });

  const exitBtn = createElement("button", {
    className: ["button", "button-exit"],
    text: "Exit",
    on: {
      click: () => {
        hidePauseOverlay();
        exitToMainMenu();
      },
    },
  });

  overlay.append(title, resumeBtn, exitBtn);
  DOM.playground.appendChild(overlay);
  DOM.pauseOverlay = overlay;

  // Focus Trap
  const btns = [resumeBtn, exitBtn];
  let activeBtn = btns[0];
  activeBtn.focus();

  const handleTabPress = (e) => {
    const isPrev = e.key === "ArrowLeft" || (e.key === "Tab" && e.shiftKey);
    const isNext = e.key === "ArrowRight" || e.key === "Tab";

    if (!isPrev && !isNext) return;

    e.preventDefault();
    playSound("menuHover");

    requestAnimationFrame(() => {
      const index = btns.indexOf(document.activeElement);
      const nextIndex = isPrev
        ? (index - 1 + btns.length) % btns.length
        : (index + 1) % btns.length;

      activeBtn = btns[nextIndex];
      activeBtn.focus();
    });
  };

  DOM.pauseOverlay.addEventListener("keydown", handleTabPress);
}

function hidePauseOverlay() {
  DOM.pauseOverlay?.remove();
  DOM.pauseOverlay = null;
}

function exitToMainMenu() {
  clearInterval(state.moveInterval);
  document.removeEventListener("keydown", handleGameplayControls);

  DOM.snake?.remove();
  DOM.snake = null;

  DOM.food?.remove();
  DOM.food = null;

  resetState();
  removeScoreElements();
  showMainMenu();
}

// window.addEventListener("blur", () => {
//   if (state.gameStatus === STATUS.RUNNING) {
//     togglePause();
//   }
// });
