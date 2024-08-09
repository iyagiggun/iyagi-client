import { Application } from 'pixi.js';
import { Scene } from './scene';

/**
 * @typedef {import('./object').default} IObject
 */

/**
 * @typedef {Object} InitParams
 * @property {WebSocket} websocket
 * @property {{ [key:string]: () => IObject }} objectGetterMap
 */

class IClient {

  #inited = false;

  #app = new Application();

  #ws;

  #scene;

  /**
   * @param {InitParams} p
   */
  constructor(p) {
    this.#ws = p.websocket;
    this.#scene = new Scene({ websocket: this.#ws, application: this.#app, objectGetterMap: p.objectGetterMap });
  }

  async init() {
    await this.#app.init({
      backgroundColor: 0x000000,
      resizeTo: window,
    });
    document.body.appendChild(this.#app.canvas);
    this.#inited = true;
  }

  #checkInit() {
    if (!this.#inited) {
      throw new Error('client is not inited');
    }
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
