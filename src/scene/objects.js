/**
 * @typedef {import('../object/index.js').default} IObject
 */

import resource from '../resource/index.js';

export default class SceneObject {
  #app;

  /** @type {IObject[]} */
  list = [];

  /**
   * @param {import('pixi.js').Application} application
   */
  constructor(application) {
    this.#app = application;
  }

  /**
   * @param {{
   *  objects: {
   *    name: string;
   *    pos?: { x?: number, y?: number, z?: number}
   *  }[]
   * }} data
   */
  async load(data) {
    const loaded = await Promise.all(data.objects.map(async (info) => {
      const object = await resource.objects.get(info.name).load();
      if (info.pos) {
        object.xyz = info.pos;
      }
      return object;
    }));
    this.list = loaded;
    return loaded;
  }

  /**
   * @param {{
   *  name: string;
   *  position: import('../coords/index.js').Position;
   *  speed?: number;
   *  camera?: import('./camera.js').default;
   * }} p
   */
  move({
    name,
    position,
    speed: _speed,
    camera,
  }) {
    const target = this.list.find((obj) => obj.name === name);
    if (!target) {
      throw new Error(`Fail to move. No the object. (${name})`);
    }
    const speed = _speed ?? 1;

    target.play();

    const tick = () => {
      const { x: curX, y: curY } = target.xy;

      const diffX = position.x - curX;
      const diffY = position.y - curY;
      const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

      const arrived = distance < speed;

      if (arrived) {
        target.xy = position;
      } else {
        const deltaX = speed * (diffX / distance);
        const deltaY = speed * (diffY / distance);
        target.xy = { x: curX + deltaX, y: curY + deltaY };
        if (camera) {
          camera.point(name);
        }
        // scene.objects.move(this, { x: deltaX, y: deltaY });
        // const { camera } = scene;
        // if (options?.trace) {
        //   camera.point(this);
        // }
      }

      if (arrived) {
        target.stop(0);
        this.#app.ticker.remove(tick);
      }

    };
    return new Promise((resolve) => {
      this.#app.ticker.add(tick);
      resolve(1);
    });
  }
}
