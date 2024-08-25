import { Application, Rectangle } from 'pixi.js';
import { Scene } from './scene/index.js';
import { IMT } from './const/index.js';

/**
 * @typedef {import('./object/index.js').default} IObject
 */

/**
 * @typedef {{
 *   container: import('pixi.js').Container
 * }} Controller
 */

class IClient {

  #inited = false;

  #app = new Application();

  #ws;

  #scene;

  /**
   * @type {Controller | undefined}
   */
  container;

  /**
   * @param {{
   *  websocket: WebSocket;
   *  controller?: Controller;
   *  entry: string;
   * }} p
   */
  constructor(p) {
    this.#ws = p.websocket;
    this.#scene = new Scene({
      websocket: this.#ws,
      application: this.#app,
      entry: p.entry,
    });
    this.container = p.controller;

    this.#ws.addEventListener('message', (msg) => {
      const { type } = JSON.parse(msg.data);

      switch (type) {
        case IMT.CONTROLLER.ENABLE: {
          const cc = this.#controller().container;
          const { width, height } = this.#app.screen;
          cc.hitArea = new Rectangle(0, 0, width, height);
          this.#app.stage.addChild(cc);
          break;
          // Pixi.js 애플리케이션 자동 리사이즈 처리 (옵션)
          // window.addEventListener('resize', () => {
          //   app.renderer.resize(window.innerWidth, window.innerHeight);
          //   container.width = app.screen.width;
          //   container.height = app.screen.height;
          //   container.hitArea = new PIXI.Rectangle(0, 0, app.screen.width, app.screen.height);
          // });
        }
        case IMT.CONTROLLER.DISABLE: {
          this.#app.stage.removeChild(this.#controller().container);
        }
      }
    });
  }

  async init() {
    await this.#app.init({
      backgroundColor: 0x000000,
      resizeTo: window,
    });
    document.body.appendChild(this.#app.canvas);
    this.#inited = true;

    this.scene.play();
  }

  #checkInit() {
    if (!this.#inited) {
      throw new Error('client is not inited');
    }
  }

  #controller() {
    if (!this.container) {
      throw new Error('no controller');
    }
    return this.container;
  }

  get application() {
    this.#checkInit();
    return this.#app;
  }

  get scene() {
    return this.#scene;
  }
}

export default IClient;
