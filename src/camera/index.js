
import global from '../global/index.js';
import scene from '../scene/index.js';
import { FRAMES_PER_SECOND } from '../const/index.js';

/**
 * @param {import('../coords/index.js').Position} position
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
   * @param {import('../coords/index.js').Position} position
   */
  point(position) {
    const { x: destX, y: destY } = getContainerPos(position);
    scene.container.x = destX;
    scene.container.y = destY;
  },
  /**
   * @param {import('../coords/index.js').Position} position
   * @param {1 | 2 | 3} _speed
   */
  move(position, _speed) {
    const container = scene.container;
    const speed = _speed * 100 / FRAMES_PER_SECOND;
    const { x: destX, y: destY } = getContainerPos(position);
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
};
