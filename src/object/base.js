import { AnimatedSprite, Assets, Container, Sprite, Spritesheet } from 'pixi.js';
import { FRAMES_PER_SECOND } from '../const';
import { getFlipHorizontalSprite } from './util';

/**
 * @typedef {import('../coords').Area} Area
 * @typedef {'up' | 'down' | 'left' | 'right' } Direction
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
 * @property {Area[]} [hitboxes]
 */

/**
 * @typedef Action
 * @property {SpriteImage} [image]
 * @property {boolean} [loop]
 * @property {Area[]} [hitboxes]
 * @property {ActionArea} [up]
 * @property {ActionArea} [down]
 * @property {ActionArea} [left]
 * @property {ActionArea} [right]
 */

/**
 * @typedef SpriteInfo
 * @property {SpriteImage} [image]
 * @property {{[key: string]: Action}} actions
 * @property {string} [base]
 */

const DEFAULT_ANIMATION_SPEED = 6 / FRAMES_PER_SECOND; // 10 fps

class IObjectBase {
  #id;
  #sprite;
  #frameIdx = 0;
  /** @type {{[key: string]: { [key: string]: Sprite | null}}} */
  #actions = {};
  #action;
  #base;

  #loaded = false;
  /** @type {Direction} */
  #dir = 'down';

  container = new Container();

  /**
   * @param {string} id
   * @param {SpriteInfo} sprite
   */
  constructor(id, sprite) {
    this.#id = id;
    this.#sprite = sprite;
    this.#base = sprite.base ?? 'base';
    this.#action = this.#base;
  }

  /**
   * @param {SpriteImage} image
   * @param {Object} options
   * @param {Area[]} [options.frames]
   * @param {boolean} [options.loop]
   * @param {boolean} [options.scale]
   */
  async #create_sprite(image, options) {
    const texture = await Assets.load(image.url);
    if (!options || !options.frames || options.frames.length === 0) {
      return Sprite.from(texture);
    }
    const sheet = {
      frames: options.frames.reduce((acc, frame) => ({
        ...acc,
        [`${this.#id}:${this.#frameIdx++}`]: {
          frame,
        },
      }), {}),
      meta: {
        scale: image.scale ?? 1,
      },
    };
    // @ts-ignore
    const parsed = await new Spritesheet(texture, sheet).parse();
    const textures = Object.values(parsed);
    if (options.frames.length === 1) {
      return new Sprite(textures[0]);
    }
    const sp = new AnimatedSprite(textures);
    sp.loop = options.loop ?? true;
    sp.animationSpeed = 1 * DEFAULT_ANIMATION_SPEED;
    return sp;
  }


  /**
   * @param {Direction} [dir]
   */
  #get_sprite(dir) {
    const d = dir ?? this.#dir;
    // const sprite = this.#get_motion()[d];
    const sprite = this.#actions[this.#action]?.[d];
    if (!sprite) {
      throw new Error(`Fail to get sprite. No sprite. - action: ${this.#action}, dir: ${d}`);
    }
    return sprite;
  }

  async load() {
    if (this.#loaded) {
      return;
    }
    const promises = Object.keys(this.#sprite.actions)
      .map(async (action) => {
        const {
          up, down, left, right, image, loop,
        } = this.#sprite.actions[action];

        const default_image = image ?? this.#sprite.image;

        const promises = [up, down, left, right].map((each) => {
          if (!each) {
            return Promise.resolve(null);
          }
          const image = each.image || default_image;
          if (!image) {
            throw new Error('Fail to create sprite. No Image');
          }
          return this.#create_sprite(image, { frames: each.frames, loop } );
        });

        const [up_sprite, down_sprite, left_sprite, right_sprite] = await Promise.all(promises);

        const right_if_left = left_sprite ? getFlipHorizontalSprite(left_sprite) : null;
        const left_if_right = right_sprite ? getFlipHorizontalSprite(right_sprite) : null;

        this.#actions[action] = {
          up: up_sprite,
          down: down_sprite,
          left: left_sprite ?? left_if_right,
          right: right_sprite ?? right_if_left,
        };

        if (!down) {
          if (up) {
            this.#dir = 'up';
          }
          if (left) {
            this.#dir = 'left';
          }
          if (right) {
            this.#dir = 'right';
          }
        }
      });

    await Promise.all(promises);

    console.error(this.#get_sprite());

    this.container.addChild(this.#get_sprite());
    this.#loaded = true;
  }
}

export default IObjectBase;
