import global from '../global/index.js';
import { Portrait } from './portrait.js';
import IObject from './iobject/index.js';
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
 * @property {import('../coords/index.js').Position} [offset]
 * @property {Area[]} frames
 */

/**
 * @typedef Motion
 * @property {SpriteImage} [image]
 * @property {import('../coords/index.js').Position} [offset]
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
 * @property {import('../coords/index.js').Position} [offset]
 * @property {{[key: string]: Motion}} [motions]
 */

/**
 * @typedef IObjectParams
 * @property {string} key
 * @property {SpriteInfo} sprite
 * @property {import('./portrait.js').PortraitParams=} portraits
 */

class ObjectResource {
  #params;

  #texture;

  #key;

  /**
   * @param {IObjectParams} params
   */
  constructor(params) {
    this.#params = params;
    this.#key = params.key;
    this.#texture = new ITexture(params.sprite);

    this.portrait = new Portrait(params.portraits);
  }

  async load() {
    await Promise.all([this.#texture.load(), this.portrait.load()]);
    return this;
  }

  /**
   * @param {string=} name
   * @returns
   */
  stamp(name) {
    return new IObject({
      name,
      texture: this.#texture,
      info: this.#params.sprite,
    });
  }

  set name(_) {
    throw new Error('The name cannot be edited');
  }

  get name() {
    return this.#key;
  }

  /**
   * @param {string | string[]} message
   */
  talk(message) {
    return global.messenger.show({ speaker: this, message });
  }
}

export default ObjectResource;
