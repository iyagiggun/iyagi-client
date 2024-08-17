
/**
 * @typedef {{
 *  container: import('pixi.js').Container;
 *  start: import('../coords/index.js').Position;
 *  pointerId: number;
 * }} JoystickInfo
 */

import { throttle } from 'lodash-es';

export default class Joystick {

  #container;

  #et;

  #pointerId = -1;

  #activateTime = -1;

  #start = { x: 0, y: 0 };

  #onTouchMove;

  /**
   * @param {{
   *  container: import('pixi.js').Container;
   *  rate: number;
   *  eventTarget: EventTarget;
   * }} p
   */
  constructor({
    container,
    rate,
    eventTarget,
  }) {
    this.#container = container;
    this.#et = eventTarget;

    this.#onTouchMove = throttle((evt) => {
      if (evt.pointerId !== this.#pointerId) {
        return;
      }

      const { x, y } = evt.global;
      // const { player } = info;
      const deltaX = x - this.#start.x;
      const deltaY = y - this.#start.y;
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
      this.#et.dispatchEvent(
        new CustomEvent('move',
          {
            detail:{
              delta: {
                x: deltaX,
                y: deltaY,
              },
              distance,
            },
          }
        ));
      // if (distance === 0) {
      //   return;
      // }
      // const speed = calcSpeed(distance);
      // if (speed === 0) {
      //   this.#deltaX = 0;
      //   this.#deltaY = 0;
      //   // player.stop();
      //   return;
      // }
      // this.#deltaX = Math.round((diffX * speed) / distance);
      // this.#deltaY = Math.round((diffY * speed) / distance);

      // console.error(this.#deltaX, this.#deltaY);
      // player.play({ speed });
    }, rate, {
      trailing: false,
    });
  }

  /**
   * @param {number} x
   */
  isIn(x) {
    return x < window.innerWidth / 2;
  }

  /**
   * @param {{
   *  pointerId: number;
   *  start: import('../coords/index.js').Position;
   * }} p
   */
  activate({
    pointerId,
    start,
  }) {
    this.#pointerId = pointerId;
    this.#start = start;
    this.#container.addEventListener('touchmove', this.#onTouchMove);
    this.#activateTime = performance.now();
    // player.application.ticker.add(tick);
  }

  /**
   * @param {number} pointerId
   * @returns
   */
  release(pointerId) {
    if (pointerId !== this.#pointerId) {
      return;
    }
    if (performance.now() - this.#activateTime < 200) {
      this.#et.dispatchEvent(new CustomEvent('interact'));
    }
    this.#container.removeEventListener('touchmove', this.#onTouchMove);
    // player.application.ticker.remove(tick);
    this.#activateTime = -1;
    this.#pointerId = -1;
  }
}
