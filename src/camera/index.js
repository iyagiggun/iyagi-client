
/**
 * @typedef {import('../object/index.js').default} IObject;
 */

import application from '../global/index.js';
import resource from '../resource/index.js';

export default {
  /**
   * @param {string | import('../object/index.js').default} target
   */
  point(target) {
    const app = application.app();
    const object = (() => {
      if (typeof target === 'string') {
        return resource.objects.get(target);
      }
      return target;
    })();

    const { x, y } = object.xy;
    const { width, height } = app.screen;

    app.stage.x = Math.round(width / 2 - x);
    app.stage.y = Math.round(height / 2 - y);
  },
};
