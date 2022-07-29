import "./style.css";
import logoImg from "./snake.svg";
import preCountAudio from "./audio/mp3/pre-count.mp3";
import startAudio from "./audio/mp3/start.mp3";
import menuHoverAudio from "./audio/mp3/mixkit-quick-jump-arcade-game-239.mp3";
import eatAudio from "./audio/mp3/mixkit-arcade-game-jump-coin-216.mp3";
import gameOverAudio from "./audio/mp3/mixkit-arcade-retro-game-over-213.mp3";
import bestScoreAudio from "./audio/mp3/mixkit-arcade-magic-notification-2342.mp3";

let playgroundSize = 9,
   snakeCellCoordinates, // set by snakeInit() function
   foodCoordinates = null, // [top, left] is generated randomly
   gameLevel = null, // "easy", "medium" or "hard" will be selected on the main screen
   gameSpeed = null, // assigned from an array below
   speed = {
      easy: 400,
      medium: 250,
      hard: 125,
   },
   gameIsRunning = false, // game is in progress state
   gameIsPaused = false, // pause state
   direction = null, // start moving down by default
   lastDirection = null,
   moveInterval = null, // setInterval will be assigned to this variable
   isGameOver = false;

const preCountSound = new Audio(preCountAudio);
const startSound = new Audio(startAudio);
const menuHoverSound = new Audio(menuHoverAudio);
const eatSound = new Audio(eatAudio);
const gameOverSound = new Audio(gameOverAudio);
const bestScoreSound = new Audio(bestScoreAudio);

menuHoverSound.volume = 0.25;
gameOverSound.volume = 0.425;

const app = document.querySelector("#app");
app.setAttribute("tabIndex", 1);

// playground
const playground = document.createElement("div");
playground.classList.add("playground");
playground.style.setProperty("--playground-size", playgroundSize);

// playgroundGrid
const playgroundGrid = document.createElement("div");
playgroundGrid.classList.add("playground__grid");
for (let i = 0; i < playgroundSize * playgroundSize; i++) {
   const gridCell = document.createElement("div");
   playgroundGrid.appendChild(gridCell);
}

// score
const scoreContainer = document.createElement("div");
scoreContainer.classList.add("score");

app.appendChild(playground);
playground.appendChild(scoreContainer);
playground.appendChild(playgroundGrid);

const showScoreElements = () => {
   const currentScore = document.createElement("div"),
      bestScore = document.createElement("div");

   currentScore.classList.add("score__current");
   bestScore.classList.add("score__best");

   currentScore.textContent = 0;
   bestScore.textContent = `${gameLevel}: ${JSON.parse(localStorage.getItem(gameLevel)) || 0}`;

   scoreContainer.appendChild(currentScore);
   scoreContainer.appendChild(bestScore);
};

const hideScoreElements = () => {
   while (scoreContainer.firstChild) scoreContainer.removeChild(scoreContainer.firstChild);
};

const updateScore = () => {
   scoreContainer.querySelector(".score__current").textContent = snakeCellCoordinates.length - 3;
};

const updateBestScore = (level, gameScore) => {
   scoreContainer.querySelector(".score__best").textContent = `${level}: ${gameScore}`;
};

// Main Screen
const showMainScreen = () => {
   const mainScreen = document.createElement("div"),
      logo = document.createElement("img"),
      mainTitle = document.createElement("h1"),
      mainDescr = document.createElement("h3"),
      easyLevelBtn = document.createElement("button"),
      mediumLevelBtn = document.createElement("button"),
      hardLevelBtn = document.createElement("button");

   mainScreen.classList.add("main-screen");
   logo.classList.add("main-screen__logo");
   mainTitle.classList.add("main-screen__title");
   mainDescr.classList.add("main-screen__descr");

   logo.src = logoImg;
   mainTitle.textContent = "Snake Game";
   mainDescr.textContent = "Choose Level";
   easyLevelBtn.textContent = "easy";
   mediumLevelBtn.textContent = "medium";
   hardLevelBtn.textContent = "hard";

   mainScreen.appendChild(logo);
   mainScreen.appendChild(mainTitle);
   mainScreen.appendChild(mainDescr);
   mainScreen.appendChild(easyLevelBtn);
   mainScreen.appendChild(mediumLevelBtn);
   mainScreen.appendChild(hardLevelBtn);

   playground.appendChild(mainScreen);

   mainScreen.onmouseover = (e) => {
      if (e.target.matches("button")) playSound(menuHoverSound);
   };

   mainScreen.onclick = (e) => {
      if (!e.target.matches("button")) return;

      const gameLevel = e.target.textContent;

      prepareGame(gameLevel);
      mainScreen.remove();
      app.focus();
   };
};

const mobileControls = () => {
   const controls = document.createElement("div"),
      upBtn = document.createElement("button"),
      downBtn = document.createElement("button"),
      leftBtn = document.createElement("button"),
      rightBtn = document.createElement("button");

   controls.classList.add("controls");

   upBtn.textContent = "▲";
   downBtn.textContent = "▼";
   leftBtn.textContent = "◀";
   rightBtn.textContent = "▶";

   upBtn.style.gridColumnStart = "2";
   leftBtn.style.gridColumnStart = "1";
   rightBtn.style.gridColumnStart = "3";
   downBtn.style.gridColumnStart = "2";

   controls.appendChild(upBtn);
   controls.appendChild(leftBtn);
   controls.appendChild(rightBtn);
   controls.appendChild(downBtn);

   app.appendChild(controls);

   controls.onclick = (e) => {
      if (isGameOver || !gameIsRunning) return;

      const moveUpKey = e.target === upBtn;
      const moveDownKey = e.target === downBtn;
      const moveLeftKey = e.target === leftBtn;
      const moveRightKey = e.target === rightBtn;

      if (moveUpKey && lastDirection !== "down") direction = "up";
      if (moveDownKey && lastDirection !== "up") direction = "down";
      if (moveLeftKey && lastDirection !== "right") direction = "left";
      if (moveRightKey && lastDirection !== "left") direction = "right";
   };
};

const prepareGame = (gameLevel) => {
   setGameLevel(gameLevel);
   snakeInit();
   newFoodElement();
   toggleInactiveClass();
   showScoreElements();

   threeTwoOneGo();
};

const setGameLevel = (level) => {
   gameSpeed = speed[level];
   gameLevel = level;
};

const playSound = (sound) => {
   sound.currentTime = 0;
   sound.pause();
   sound.load();
   sound.play();
};

const threeTwoOneGo = () => {
   const messagesArr = ["3", "2", "1", "GO!"],
      interval = 750;

   const countdownElement = document.createElement("div");
   countdownElement.classList.add("countdown");
   playground.appendChild(countdownElement);

   countdownElement.style.setProperty("--interval", interval + "ms");

   for (let i = 0; i < messagesArr.length; i++) {
      setTimeout(() => {
         countdownElement.textContent = messagesArr[i];
         i < messagesArr.length - 1 ? playSound(preCountSound) : playSound(startSound);
      }, interval * i);
   }

   // after timeout, run the game
   setTimeout(() => {
      startGame();
      countdownElement.remove();
   }, interval * messagesArr.length);
};

// keyboard setting
app.onkeydown = (e) => {
   if (isGameOver || !gameIsRunning) return;

   const moveUpKey = e.key === "ArrowUp" || e.key === "w";
   const moveDownKey = e.key === "ArrowDown" || e.key === "s";
   const moveLeftKey = e.key === "ArrowLeft" || e.key === "a";
   const moveRightKey = e.key === "ArrowRight" || e.key === "d";
   const pauseKey = e.code === "Space";

   if (moveUpKey && lastDirection !== "down") direction = "up";
   if (moveDownKey && lastDirection !== "up") direction = "down";
   if (moveLeftKey && lastDirection !== "right") direction = "left";
   if (moveRightKey && lastDirection !== "left") direction = "right";

   if (pauseKey) gameIsPaused ? startGame() : stopGame();
};

const snakeInit = () => {
   const snake = document.createElement("div");
   snake.classList.add("snake");
   playground.appendChild(snake);

   snakeCellCoordinates = [
      [3, (playgroundSize - 1) / 2],
      [2, (playgroundSize - 1) / 2],
      [1, (playgroundSize - 1) / 2],
   ];
   direction = "down";

   snakeReRenderCells();
};

const snakeMove = () => {
   // unshift new cell towards the moving direction
   // and pop the last element if the food is not eaten
   let [newCellTop, newCellLeft] = snakeCellCoordinates[0];

   if (direction === "up") newCellTop--;
   if (direction === "down") newCellTop++;
   if (direction === "left") newCellLeft--;
   if (direction === "right") newCellLeft++;

   newCellTop = newCellTop < 0 ? playgroundSize - 1 : newCellTop;
   newCellLeft = newCellLeft < 0 ? playgroundSize - 1 : newCellLeft;

   newCellTop = newCellTop > playgroundSize - 1 ? 0 : newCellTop;
   newCellLeft = newCellLeft > playgroundSize - 1 ? 0 : newCellLeft;

   snakeCellCoordinates.unshift([newCellTop, newCellLeft]);

   if (foodIsEaten()) {
      newFoodElement();
      updateScore();
      playSound(eatSound);
   } else {
      snakeCellCoordinates.pop();
   }

   snakeReRenderCells();

   lastDirection = direction;

   isGameOver = gameOverCheck();

   if (isGameOver) return gameOver();
};

const snakeReRenderCells = () => {
   const snake = document.querySelector(".snake");

   // remove all cells (children divs)
   while (snake.firstChild) snake.removeChild(snake.firstChild);

   // render each cell
   for (let i = 0; i < snakeCellCoordinates.length; i++) {
      const snakeCell = document.createElement("div");
      const [top, left] = snakeCellCoordinates[i];
      setCellPosition(snakeCell, top, left);
      snake.appendChild(snakeCell);
   }
};

const startGame = () => {
   gameIsPaused = false;
   gameIsRunning = true;
   toggleInactiveClass();

   //snakeMove();
   moveInterval = setInterval(snakeMove, gameSpeed);
};

const stopGame = () => {
   gameIsPaused = true;

   clearInterval(moveInterval);
   moveInterval = null;

   toggleInactiveClass();
};

const getRandomCoordinates = () => {
   let top = Math.floor(Math.random() * playgroundSize);
   let left = Math.floor(Math.random() * playgroundSize);

   return [top, left];
};

const setCellPosition = (cellSelector, top, left) => {
   cellSelector.style.setProperty("--top", top);
   cellSelector.style.setProperty("--left", left);
};

const newFoodElement = () => {
   let foodElement = document.querySelector(".food");

   if (document.querySelector(".food") === null) {
      foodElement = document.createElement("div");
      foodElement.classList.add("food");
      document.querySelector(".playground").appendChild(foodElement);
   }

   do {
      foodCoordinates = getRandomCoordinates();
   } while (snakeCellCoordinates.some((cell) => cell.join() === foodCoordinates.join()));

   let [foodTop, foodLeft] = foodCoordinates;

   setCellPosition(foodElement, foodTop, foodLeft);
};

const foodIsEaten = () => {
   return snakeCellCoordinates[0].join() === foodCoordinates.join();
};

const toggleInactiveClass = () => {
   const snakeSelector = document.querySelector(".snake"),
      foodSelector = document.querySelector(".food");

   snakeSelector?.classList.toggle("inactive");
   foodSelector?.classList.toggle("inactive");
};

const gameOverCheck = () => {
   for (let i = 1; i < snakeCellCoordinates.length; i++) {
      const currentCell = snakeCellCoordinates[i];

      if (currentCell.join() === snakeCellCoordinates[0].join()) {
         return true;
      }
   }
};

const gameOver = () => {
   stopGame();
   gameIsRunning = false;

   const gameScore = parseInt(document.querySelector(".score__current").textContent);
   const bestScore = JSON.parse(localStorage.getItem(gameLevel)) || 0;

   const gameOverElement = document.createElement("div");
   gameOverElement.classList.add("game-over");

   if (gameScore > bestScore) {
      playSound(bestScoreSound);
      updateBestScore(gameLevel, gameScore);
      localStorage.setItem(gameLevel, gameScore);
      gameOverElement.textContent = "Best Score!";
   } else {
      playSound(gameOverSound);
      gameOverElement.textContent = "Game Over!";
   }

   document.querySelector(".playground").appendChild(gameOverElement);

   gameOverElement.onclick = () => {
      document.querySelector(".snake").remove();
      document.querySelector(".food").remove();
      gameLevel = null;
      gameSpeed = null;
      isGameOver = false;
      hideScoreElements();
      showMainScreen();
      gameOverElement.remove();
   };
};

const isTouchDevice = () => {
   return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
};

showMainScreen();
if (isTouchDevice()) mobileControls();
//snakeInit();
//newFoodElement();

// DONE:
// Для змейки создать массив координат каждой клетки
// на основе массива, рендерить div'ы каждой клетки
// в начало массива (начало dom'а .snake) делать prependChild на основе direction
// а с конца убирать элемент
// с каждым ходом

// DONE: запрет на движение в обратную сторону
// DONE: змейка сама движется (setInterval), а не просто по клику стрелок
// DONE: добавить скругление
// DONE: если змейка врезается в еду, не делать .pop() на массиве ячеек змейки
// DONE: если змейка врезается в саму себя (проверка двух одинаковых ячеек), то гейм овер
// DONE: нажатие стрелочки меняет траекторию
// DONE: свайпы на мобилке
// DONE: пробел - пауза (прозрачность на паузе)

// DONE: сделать счетчик на Score

// DONE: начальный экран, кнопка "начать",
// DONE: сохранять лучший счет в localStorage

// TODO: после нажатия "начать", выводить подсказки:
// "Use arrows or WSAD to control the snake" - если десктоп.
// "Use swipe to control the snake".
// Убирать подсказку по нажатию на одну из упрравляющих клавиш или по свайпу

// TODO: Оптимизация: что если делать не ре-рендер всех клеток, а рендерить переднюю, и убирать последнюю, если мы не съели еду?

// TODO: Add Sounds
