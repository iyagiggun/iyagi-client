import { Container } from 'pixi.js';
import IObjectLoader from './loader';
import IObjectCoords from './coords';

/**
 * @typedef IObjectParams
 * @property {string} key If there is no name, the key is used as the name.
 * @property {string} [name]
 * @property {import('./loader').SpriteInfo} sprite
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


    this.container.interactive = true;
    this.container.eventMode = 'static';
    this.container.addEventListener('touch', () => {
      console.error('ffffffffffff');
    });
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


export default IObject;
