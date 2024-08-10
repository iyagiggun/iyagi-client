import { Application } from 'pixi.js';
import { Scene } from './scene';
import { IMT } from './const';

/**
 * @typedef {import('./object').default} IObject
 */

/**
 * @typedef {{
 *   layer: import('pixi.js').Container
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
  controller;

  /**
   * @param {{
   *  websocket: WebSocket;
   *  objectGetterMap: { [key:string]: () => IObject };
   *  controller?: Controller
   * }} p
   */
  constructor(p) {
    this.#ws = p.websocket;
    this.#scene = new Scene({ websocket: this.#ws, application: this.#app, objectGetterMap: p.objectGetterMap });
    this.controller = p.controller;

    this.#ws.addEventListener('message', (msg) => {
      const { type, data } = JSON.parse(msg.data);

      switch (type) {
        case IMT.CONTROLLER.ENABLE: {
          const layer = this.#controller().layer;
          layer.width = this.#app.screen.width;
          layer.height = this.#app.screen.height;
          // this.#app.stage.addChild(layer);
          // console.error('controller set');
          break;
        }
        case IMT.CONTROLLER.DISABLE: {
          this.#app.stage.removeChild(this.#controller().layer);
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
    this.#app.stage.sortableChildren = true;
    this.#inited = true;
  }

  #checkInit() {
    if (!this.#inited) {
      throw new Error('client is not inited');
    }
  }

  #controller() {
    if (!this.controller) {
      throw new Error('no controller');
    }
    return this.controller;
  }

  get application() {
    this.#checkInit();
    return this.#app;
  }

  get scene() {
    this.#checkInit();
    return this.#scene;
  }
}

export default IClient;
