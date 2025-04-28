// The entry point that wires everything
import "./style.css";
import { renderRootElements } from "./dom.js";
import { showMainMenu } from "./ui.js";

renderRootElements();
showMainMenu();

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
// DONE: Add Pause Sound
// DONE: Add Resume Sound
// DONE: Add Pause message when paused: two buttons - RESUME and EXIT

// TODO: после нажатия "начать", выводить подсказки:
// "Use arrows or WSAD to control the snake" - если десктоп.
// "Use swipe to control the snake".
// Убирать подсказку по нажатию на одну из упрравляющих клавиш или по свайпу
