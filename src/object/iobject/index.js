import Coordinate from './coordinate.js';
import { getMDKey } from '../texture.js';
import { AnimatedSprite, Container } from 'pixi.js';
import camera from '../../camera/index.js';
import global from '../../global/index.js';
import { DEFAULT_ANIMATION_SPEED } from '../../const/index.js';

/**
 * @typedef {import('../../coords/index.js').Direction} Direction
 * @typedef {import('pixi.js').Sprite} Sprite
 */

const DEFAULT_COMPLETE = () => undefined;

export default class IObject {

  /** @type {Direction} */
  #direction;

  #motion = 'base';

  #coordinate;

  #info;

  #texture;

  #portrait;

  /** @type {Sprite | null} */
  #current = null;

  /**
   * @type {Map<string, Sprite>}
   */
  #cache = new Map();

  #complete = DEFAULT_COMPLETE;

  /**
   * @param {Object} param
   * @param {string=} param.name
   * @param {import('../texture.js').default} param.texture
   * @param {import('../resource.js').SpriteInfo} param.info
   * @param {import('../portrait.js').PortraitType} param.portrait
   */
  constructor({
    name,
    texture,
    portrait,
    info,
  }) {
    this.container = new Container();
    this.name = name;
    this.#texture = texture;
    this.#direction = 'down';
    this.#coordinate = new Coordinate(this.container);
    this.#portrait = portrait;
    this.#info = info;
    this.#set(this.#motion, this.#direction);
  }

  /**
   * @param {string} motion
   * @param {Direction} direction
   */
  #set(motion, direction) {
    const mdKey = getMDKey(motion, direction);
    const next = this.#cache.get(mdKey) ?? this.#texture.createSprite(motion, direction);
    if (!this.#cache.has(mdKey)) {
      this.#cache.set(mdKey, next);
    }
    if (next === this.#current) {
      return;
    };

    if (this.#current) {
      if (this.#current instanceof AnimatedSprite && next instanceof AnimatedSprite) {
        next.animationSpeed = this.#current.animationSpeed;
        if (this.#current.playing) {
          this.#current.stop();
          next.play();
        }
      }
      this.container.removeChild(this.#current);
    }
    this.container.addChild(next);
    this.#current = next;
    if (this.#info.motions[motion].playing) {
      this.play();
    }
  }

  /**
   * @param {number} x
   */
  set x(x) {
    this.#coordinate.set({ x }, this.#getOffset());
  }

  /**
   * @param {number} y
   */
  set y(y) {
    this.#coordinate.set({ y }, this.#getOffset());
  }

  /**
   * @param {{x? : number, y?: number}} xy
   */
  set xy(xy) {
    this.#coordinate.set(xy, this.#getOffset());
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
    this.#coordinate.set(xyz, this.#getOffset());
  }

  /**
   * @return {{ x: number, y: number, z: number }}
   */
  get xyz() {
    const offset = this.#getOffset();
    const { x, y, z } = this.#coordinate.get();
    return {
      x: offset ? x + offset.x : x,
      y: offset ? y + offset.y : y,
      z,
    };
  }

  /**
   * @param {Direction} dir
   */
  set direction(dir) {
    switch (dir) {
      case 'up':
      case 'down':
      case 'left':
      case 'right':
        if (this.#direction === dir) {
          return;
        }
        this.#direction = dir;
        this.#set(this.#motion, this.#direction);
        break;
      default:
        throw new Error(`Fail to change direction. Invalid value. value: ${dir}`);
    }
  }

  /**
   * @param {import('../../coords/index.js').XY & {
   *  speed?: number;
   * }} p
   */
  move({
    x,
    y,
    speed: _speed,
  }) {
    this.#complete();

    const speed = _speed ?? 1;
    return new Promise((resolve) => {

      this.play();

      const tick = () => {
        const { x: curX, y: curY } = this.xy;

        const diffX = x - curX;
        const diffY = y - curY;
        const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

        const arrived = distance < speed;

        if (arrived) {
          this.xy = { x, y };
        } else {
          const deltaX = Math.round(speed * (diffX / distance));
          const deltaY = Math.round(speed * (diffY / distance));
          this.xy = { x: curX + deltaX, y: curY + deltaY };
          camera.adjust({ x: deltaX, y: deltaY });
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
        global.app.ticker.remove(tick);
        this.stop();
        this.#complete = DEFAULT_COMPLETE;
        // @ts-ignore
        resolve();
      };

      this.stop();
      this.play({
        speed,
      });
      global.app.ticker.add(tick);
    });
  }

  /**
   * @param {string | string[]} message
   * @param {string} [key]
   */
  talk(message, key) {
    return global.messenger.show({ name: this.name, message, portrait: this.#portrait.get(key) });
  }

  /**
   * @param {{
   *   speed: number
   * }} options
   */
  play({
    speed,
  } = {}) {
    if ((this.#current instanceof AnimatedSprite) === false) {
      return;
    }
    if (speed > 0) {
      this.#current.animationSpeed = speed * DEFAULT_ANIMATION_SPEED;
    }
    this.#current.play();
  }

  /**
   * @param {number=} frameIdx
   */
  stop(frameIdx) {
    if ((this.#current instanceof AnimatedSprite) === false) {
      return;
    }
    if (typeof frameIdx === 'number') {
      this.#current.gotoAndStop(frameIdx);
    } else {
      this.#current.stop();
    }
  }

  #getOffset() {
    const motion = this.#motion;
    const dir = this.#direction;
    const sprite = this.#info.motions?.[motion];
    if (!sprite) {
      throw new Error(`Fail to get offset. No the motion. ${motion}`);
    }
    return this.#info.offset ?? sprite.offset ?? sprite[dir]?.offset;
  }
}
