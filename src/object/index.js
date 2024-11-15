import { AnimatedSprite, Container } from 'pixi.js';
import IObjectLoader from './loader.js';
import IObjectCoords from './coords.js';
import application from '../global/index.js';
import camera from '../camera/index.js';
import { getDirectionByDelta } from '../coords/index.js';
import global from '../global/index.js';
import { Portrait } from './portrait.js';

const DEFAULT_COMPLETE = () => undefined;

/**
 * @typedef IObjectParams
 * @property {string} name
 * @property {import('./loader.js').SpriteInfo} sprite
 * @property {import('./portrait.js').PortraitParams=} portraits
 */

class IObject {
  #params;

  #loader;

  #coords;

  #name;

  #complete = DEFAULT_COMPLETE;

  #motion = 'base';

  /** @type { import('../coords/index.js').Direction } */
  #dir = 'down';

  /** @type { import('pixi.js').Sprite | null } */
  #sprite = null;

  /**
   * @param {IObjectParams} params
   */
  constructor(params) {
    this.container = new Container();

    this.#params = params;
    this.#name = params.name;
    this.#loader = new IObjectLoader({
      key: params.name,
      sprite: params.sprite,
    });
    this.#coords = new IObjectCoords(this.container);

    this.portrait = new Portrait(params.portraits);
  }

  async load() {
    await Promise.all([this.#loader.load(), this.portrait.load()]);
    this.#sprite = this.#loader.get_sprite(this.#motion, this.#dir);
    this.container.addChild(this.#sprite);
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
    this.#coords.set({ x }, this.#loader.get_offset(this.#motion, this.#dir));
  }

  /**
   * @param {number} y
   */
  set y(y) {
    this.#coords.set({ y }, this.#loader.get_offset(this.#motion, this.#dir));
  }

  /**
   * @param {{x? : number, y?: number}} xy
   */
  set xy(xy) {
    this.#coords.set(xy, this.#loader.get_offset(this.#motion, this.#dir));
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
    this.#coords.set(xyz, this.#loader.get_offset(this.#motion, this.#dir));
  }

  /**
   * @return {{ x: number, y: number, z: number }}
   */
  get xyz() {
    const offset = this.#loader.get_offset(this.#motion, this.#dir);
    const { x, y, z } = this.#coords.get();
    return {
      x: offset ? x + offset.x : x,
      y: offset ? y + offset.y : y,
      z,
    };
  }

  /**
   * @param {import('../coords/index.js').Direction} dir
   */
  set direction(dir) {
    switch (dir) {
      case 'up':
      case 'down':
      case 'left':
      case 'right':
        this.#dir = dir;
        this.#change_sprite();
        break;
      default:
        throw new Error(`Fail to change direction. Invalid value. value: ${dir}`);
    }
  }

  get direction() {
    return this.#dir;
  }

  #change_sprite() {
    if (this.#sprite) {
      this.container.removeChild(this.#sprite);
    }
    this.#sprite = this.#loader.get_sprite(this.#motion, this.#dir);
    this.container.addChild(this.#sprite);
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
    this.#complete();

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
          this.direction = getDirectionByDelta({ x: deltaX, y: deltaY });
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
          this.#complete();
        }
      };

      this.#complete = () => {
        application.app.ticker.remove(tick);
        this.stop();
        this.#complete = DEFAULT_COMPLETE;
        // @ts-ignore
        resolve();
      };

      application.app.ticker.add(tick);
    });
  }

  /**
   * @param {string} text
   */
  talk(text) {
    return global.messenger.show({ speaker: this, text });
  }

  play() {
    if ((this.#sprite instanceof AnimatedSprite) === false) {
      return;
    }
    this.#sprite.play();
  }


  /**
   * @param {number} [frameIdx]
   */
  stop(frameIdx) {
    const sprite = this.#loader.get_sprite(this.#motion, this.#dir);
    if ((sprite instanceof AnimatedSprite) === false) {
      return;
    }
    if (typeof frameIdx === 'number') {
      sprite.gotoAndStop(frameIdx);
    } else {
      sprite.stop();
    }
  }

  /**
   * @param {string} key
   */
  async clone(key) {
    if (!key) {
      throw new Error('Fail to create clone. No clone value');
    }
    const name = `${this.#name}-clone-${key}`;
    const clone = new IObject(this.#params);
    clone.#name = name;
    return await clone.load();
  }
}

export class IObjectMono extends IObject {
  /**
   * @param {{
   *  name: string;
   *  image: string,
   *  offset?: import('../coords/index.js').Position;
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
        offset: p.offset,
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
