
/**
 * @typedef {import('../object/index.js').default} IObject;
 */

import resource from '../resource/index.js';

export default class SceneCamera {
  #app;

  #container;

  /**
   * @param {import('pixi.js').Application} application;
   * @param {import('pixi.js').Container} container;
   */
  constructor(application, container) {
    this.#app = application;
    this.#container = container;
  }

  /**
   * @param {string} name
   */
  point(name) {
    const target = resource.objects.get(name);

    const { x, y } = target.xy;
    const { width, height } = this.#app.screen;

    this.#container.x = Math.round(width / 2 - x);
    this.#container.y = Math.round(height / 2 - y);
  }
}
