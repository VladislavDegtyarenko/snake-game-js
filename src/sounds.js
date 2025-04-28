import preCountAudio from "../audio/mp3/pre-count.mp3";
import startAudio from "../audio/mp3/start.mp3";
import menuHoverAudio from "../audio/mp3/mixkit-quick-jump-arcade-game-239.mp3";
import eatAudio from "../audio/mp3/mixkit-arcade-game-jump-coin-216.mp3";
import gameOverAudio from "../audio/mp3/mixkit-arcade-retro-game-over-213.mp3";
import bestScoreAudio from "../audio/mp3/mixkit-arcade-magic-notification-2342.mp3";
import unpauseAudio from "../audio/mp3/pause-89443.mp3";
import pauseAudio from "../audio/mp3/unpause-106278.mp3";

const sounds = {
  preCount: new Audio(preCountAudio),
  start: new Audio(startAudio),
  menuHover: new Audio(menuHoverAudio),
  eat: new Audio(eatAudio),
  gameOver: new Audio(gameOverAudio),
  bestScore: new Audio(bestScoreAudio),
  pause: new Audio(pauseAudio),
  unpause: new Audio(unpauseAudio),
};

sounds.menuHover.volume = 0.25;
sounds.gameOver.volume = 0.425;

export const playSound = (soundKey) => {
  try {
    const sound = sounds[soundKey];
    if (sound) {
      sound.currentTime = 0;
      sound.pause();
      sound.play();
    }
  } catch (error) {
    console.warn(error);
  }
};
