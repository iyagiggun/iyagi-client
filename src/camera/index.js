
import global from '../global/index.js';
import scene from '../scene/index.js';
import { FRAMES_PER_SECOND } from '../const/index.js';

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

export default {
  /**
   * @param {import('../coords/index.js').XY} xy
   */
  point(xy) {
    const { x: destX, y: destY } = getContainerPos(xy);
    scene.container.x = destX;
    scene.container.y = destY;
  },
  /**
   * @param {XY & { speed: 1 | 2 | 3 }} info
   */
  move(info) {
    const container = scene.container;
    const speed = info.speed * 300 / FRAMES_PER_SECOND;
    const { x: destX, y: destY } = getContainerPos(info);
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
          const deltaX = speed * (diffX / distance);
          const deltaY = speed * (diffY / distance);
          container.x += Math.round(deltaX);
          container.y += Math.round(deltaY);
          if (Number.isNaN(deltaX) || Number.isNaN(deltaY)) {
            ticker.remove(tick);
            reject(new Error('delta is NaN'));
          }
        }
      };
      ticker.add(tick);
    });
  },
  /**
   * @param {XY} xy
   */
  adjust({ x: deltaX, y: deltaY }) {
    scene.container.x -= deltaX;
    scene.container.y -= deltaY;
  },
};
