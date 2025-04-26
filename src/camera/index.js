
import global from '../global/index.js';
import { FRAMES_PER_SECOND } from '../const/index.js';
import { shard } from '../shard/index.js';

/**
 * @param {import('../coords/index.js').XY} xy
 */
const getContainerPos = ({ x, y }) => {
  const { width, height } = global.app.screen;
  return {
    x: Math.round(width / 2 - x),
    y: Math.round(height / 2 - y),
  };
};

/**
 * @param {XY & { speed?: 1 | 2 | 3 }} info
 */
const move = (info) => {
  const container = shard.container;
  const { x: destX, y: destY } = getContainerPos(info);
  if (!info.speed) {
    container.x = destX;
    container.y = destY;
    return Promise.resolve();
  }
  const speed = info.speed * 300 / FRAMES_PER_SECOND;
  const ticker = global.app.ticker;
  return new Promise((resolve, reject) => {
    const tick = () => {
      const curX = container.x;
      const curY = container.y;
      const diffX = destX - curX;
      const diffY = destY - curY;
      const distance = Math.sqrt(diffX ** 2 + diffY ** 2);
      const arrived = distance < speed;
      if (arrived) {
        container.x = destX;
        container.y = destY;
        ticker.remove(tick);
        resolve();
      } else {
        const deltaX = Math.round(speed * (diffX / distance));
        const deltaY = Math.round(speed * (diffY / distance));
        container.x += deltaX;
        container.y += deltaY;
        if (Number.isNaN(deltaX) || Number.isNaN(deltaY)) {
          ticker.remove(tick);
          reject(new Error('delta is NaN'));
        }
      }
    };
    ticker.add(tick);
  });
};

/**
 * @param {XY} xy
 */
const adjust = ({ x: deltaX, y: deltaY }) => {
  shard.container.x -= deltaX;
  shard.container.y -= deltaY;
};

export default {
  move,
  adjust,
};
