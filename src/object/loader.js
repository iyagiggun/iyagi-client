import { AnimatedSprite, Assets, Sprite, Spritesheet } from 'pixi.js';
import { FRAMES_PER_SECOND } from '../const/index.js';
import { getFlipHorizontalSprite } from './util/index.js';

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
 * @property {Area[]} [hitboxes]
 */

/**
 * @typedef Motion
 * @property {SpriteImage} [image]
 * @property {import('../coords/index.js').Position} [offset]
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
 * @property {import('../coords/index.js').Position} [offset]
 * @property {Motion} base
 * @property {{[key: string]: Motion}} [actions]
 */

const DEFAULT_ANIMATION_SPEED = 6 / FRAMES_PER_SECOND; // 10 fps

export default class IObjectLoader {
  key;
  #sprite;
  #frameIdx = 0;
  /** @type {{[key: string]: { [key: string]: Sprite | null}}} */
  #motions = {};

  #loaded = false;

  /**
   * @param {{
   *  key: string;
   *  sprite: SpriteInfo
   * }} p
   */
  constructor(p) {
    this.key = p.key;
    this.#sprite = p.sprite;
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
        [`${this.key}:${this.#frameIdx++}`]: {
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

  async load() {
    if (this.#loaded) {
      return;
    }

    /** @type {{[key: string]: Motion}} */
    const motions = {
      base: this.#sprite.base,
      ...(this.#sprite.actions ?? {}),
    };

    const promises = Object.keys(motions)
      .map(async (action) => {
        const {
          up, down, left, right, image, loop,
        } = motions[action];

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

        this.#motions[action] = {
          up: up_sprite,
          down: down_sprite,
          left: left_sprite ?? left_if_right,
          right: right_sprite ?? right_if_left,
        };
      });

    await Promise.all(promises);
    this.#loaded = true;

    return;
  }

  /**
   * @param {string} motion
   * @param {Direction} dir
   */
  get_sprite(motion, dir) {
    const sprite = this.#motions[motion]?.[dir];
    if (!sprite) {
      throw new Error(`Fail to get sprite. No sprite. - motion: ${motion}, dir: ${dir}`);
    }
    return sprite;
  }

  /**
   * @param {string} motion
   * @param {Direction} dir
   */
  get_offset(motion, dir) {
    const sprite = motion === 'base' ? this.#sprite.base : this.#sprite.actions?.[motion];
    if (!sprite) {
      throw new Error(`Fail to get offset. No the motion. ${motion}`);
    }
    return this.#sprite.offset ?? sprite.offset ?? sprite[dir]?.offset;
  }
}
