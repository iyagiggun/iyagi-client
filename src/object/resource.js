import IObject from './iobject/index.js';
import { Portrait } from './portrait.js';
import ITexture from './texture.js';

/**
 * @typedef {import('../coords/index.js').Area} Area
 * @typedef {import('../coords/index.js').Direction} Direction
 */

/**
 * @typedef SpriteImage
 * @property {string} url
 * @property {number} [scale]
 */

/**
 * @typedef ActionArea
 * @property {SpriteImage} [image]
 * @property {Area[]} frames
 */

/**
 * @typedef Motion
 * @property {SpriteImage} [image]
 * @property {boolean} [loop]
 * @property {ActionArea} [up]
 * @property {ActionArea} [down]
 * @property {ActionArea} [left]
 * @property {ActionArea} [right]
 * @property {boolean=} playing
 */

/**
 * @typedef SpriteInfo
 * @property {SpriteImage} [image]
 * @property {{[key: string]: Motion}} [motions]
 */

/**
 * @typedef IObjectParams
 * @property {string} key
 * @property {string} [name]
 * @property {SpriteInfo} sprite
 * @property {import('./portrait.js').PortraitParams=} portraits
 */

/**
 * @type {Map<string, IObject>}
 */
const pool = new Map();

class ObjectResource {
  #params;

  #texture;

  #portrait;

  #key;

  /**
   * @param {string} key
   * @param {IObjectParams} params
   */
  constructor(key, params) {
    this.#params = params;
    this.#key = key;
    this.#texture = new ITexture(params.sprite);
    this.#portrait = new Portrait(params.portraits);
  }

  async load() {
    await Promise.all([this.#texture.load(), this.#portrait.load()]);
    return this;
  }

  /**
   * @param {string=} id
   * @returns
   */
  stamp(id) {
    const cached = pool.get(id);
    if (cached) {
      return cached;
    }
    const created = new IObject({
      id,
      name: this.#params.name,
      texture: this.#texture,
      info: this.#params.sprite,
      portrait: this.#portrait,
    });
    pool.set(id, created);
    return created;
  }

  set key(_) {
    throw new Error('The key cannot be edited');
  }

  get key() {
    return this.#key;
  }
}

/**
 * @typedef {ObjectResource} ObjectResourceType
 */

export default ObjectResource;
