import { AnimatedSprite, Container } from 'pixi.js';
import IObjectLoader from './loader.js';
import IObjectCoords from './coords.js';
import application from '../global/index.js';
import camera from '../camera/index.js';

/**
 * @typedef IObjectParams
 * @property {string} name
 * @property {import('./loader.js').SpriteInfo} sprite
 */

class IObject {
  container = new Container();

  #params;

  #loader;

  #coords;

  #name;

  /**
   * @param {IObjectParams} params
   */
  constructor(params) {
    this.#params = params;
    this.#name = params.name;
    this.#loader = new IObjectLoader({
      container: this.container,
      key: params.name,
      sprite: params.sprite,
    });
    this.#coords = new IObjectCoords(this.container);
  }

  async load() {
    await this.#loader.load();
    return this;
  }

  set name(_) {
    throw new Error('The name cannot be edited');
  }

  get name() {
    return this.#name;
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
   * @return {{ x: number, y: number }};
   */
  get xy() {
    const { x, y } = this.xyz;
    return { x, y };
  }

  /**
   * @param {{x?: number, y?: number, z?: number}} xyz
   */
  set xyz(xyz) {
    this.#coords.set(xyz);
  }

  /**
   * @return {{ x: number, y: number, z: number }}
   */
  get xyz() {
    return this.#coords.get();
  }

  /**
   * @param {{
   *  position: import('../coords/index.js').Position;
   *  speed?: number;
   * }} p
   */
  move({
    position,
    speed: _speed,
  }) {
    const speed = _speed ?? 1;
    return new Promise((resolve) => {

      this.play();

      const tick = () => {
        const { x: curX, y: curY } = this.xy;

        const diffX = position.x - curX;
        const diffY = position.y - curY;
        const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

        const arrived = distance < speed;

        if (arrived) {
          this.xy = position;
        } else {
          const deltaX = speed * (diffX / distance);
          const deltaY = speed * (diffY / distance);
          this.xy = { x: curX + deltaX, y: curY + deltaY };
          camera.point(this);
          // if (camera) {
          //   camera.point(name);
          // }
          // scene.objects.move(this, { x: deltaX, y: deltaY });
          // const { camera } = scene;
          // if (options?.trace) {
          //   camera.point(this);
          // }
        }
        if (arrived) {
          this.stop(0);
          application.app().ticker.remove(tick);
          // @ts-ignore
          resolve();
        }
      };
      application.app().ticker.add(tick);
    });
  }

  play() {
    const sprite = this.#loader.get_sprite();
    if ((sprite instanceof AnimatedSprite) === false) {
      return;
    }
    sprite.play();
  }


  /**
   * @param {number} [frameIdx]
   */
  stop(frameIdx) {
    const sprite = this.#loader.get_sprite();
    if ((sprite instanceof AnimatedSprite) === false) {
      return;
    }
    if (typeof frameIdx === 'number') {
      sprite.gotoAndStop(frameIdx);
    } else {
      sprite.stop();
    }
  }

  async clone() {
    const clone = new IObject(this.#params);
    return await clone.load();
  }
}

export class IObjectMono extends IObject {
  /**
   * @param {{
   *  name: string;
   *  image: string,
   *  frames: import('../coords/index.js').Area[];
   * }} p
   */
  constructor(p) {
    super({
      name: p.name,
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
