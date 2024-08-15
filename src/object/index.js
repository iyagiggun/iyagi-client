import { Container } from 'pixi.js';
import IObjectLoader from './loader.js';
import IObjectCoords from './coords.js';

/**
 * @typedef IObjectParams
 * @property {string} key If there is no name, the key is used as the name.
 * @property {string} [name]
 * @property {import('./loader.js').SpriteInfo} sprite
 */

class IObject {
  container = new Container();

  #loader;

  #coords;

  #name;

  /**
   * @param {IObjectParams} params
   */
  constructor(params) {
    this.#name = params.name ?? params.key;
    this.#loader = new IObjectLoader({
      container: this.container,
      key: params.key,
      sprite: params.sprite,
    });
    this.#coords = new IObjectCoords(this.container);
  }

  async load() {
    await this.#loader.load();
    return this;
  }

  /**
   * @param {number} x
   */
  set x(x) {
    this.#coords.set({ x });
  }

  /**
   * @param {number} y
   */
  set y(y) {
    this.#coords.set({ y });
  }

  /**
   * @param {{x? : number, y?: number}} xy
   */
  set xy(xy) {
    this.#coords.set(xy);
  }

  /**
   * @param {{x?: number, y?: number, z?: number}} xyz
   */
  set xyz(xyz) {
    this.#coords.set(xyz);
  }
}

export class IObjectMono extends IObject {
  /**
   * @param {{
   *  key: string;
   *  image: string,
   *  frames: import('../coords/index.js').Area[];
   * }} p
   */
  constructor(p) {
    super({
      key: p.key,
      sprite: {
        image: {
          url: p.image,
        },
        base: {
          down: {
            frames: p.frames,
          },
        },
      },
    });
  }
}


export default IObject;
