import { state, STATUS } from "./state";
import { togglePause } from "./ui";

export function handleGameplayControls(e) {
  const d = state.direction;
  const { key, code } = e;

  if (code === "Space" && state.gameStatus !== STATUS.GAME_OVER) {
    togglePause();
    return;
  }

  if (state.gameStatus !== STATUS.RUNNING) return;

  if ((key === "ArrowUp" || key === "w") && d !== "down")
    state.direction = "up";
  if ((key === "ArrowDown" || key === "s") && d !== "up")
    state.direction = "down";
  if ((key === "ArrowLeft" || key === "a") && d !== "right")
    state.direction = "left";
  if ((key === "ArrowRight" || key === "d") && d !== "left")
    state.direction = "right";
}
