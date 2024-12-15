
/**
 * @typedef {import('../object/resource.js').default} IObject;
 */

import global from '../global/index.js';
import scene from '../scene/index.js';

export default {
  /**
   * @param {import('../coords/index.js').Position} position
   */
  point(position) {
    const { x, y } = position;
    const { width, height } = global.app.screen;

    scene.container.x = Math.round(width / 2 - x);
    scene.container.y = Math.round(height / 2 - y);
  },
};
