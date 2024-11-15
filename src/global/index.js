import { Application } from 'pixi.js';

/**
 * @typedef {{
*  container: import('pixi.js').Container;
*  target: import('../object/index.js').default | null;
* }} Controller
*/

/** @type { Application= } */
let app;
/** @type { WebSocket= } */
let ws;
/** @type { string= } */
let key;
/** @type { Controller | null } */
let controller = null;
/** @type {import('../imessenger/index.js').Messenger} */
let messenger;

const ERR_NOT_INITED = 'client has not been initialized yet.';

export default {
  get app() {
    if (!app) {
      throw new Error(ERR_NOT_INITED);
    }
    return app;
  },
  get ws() {
    if (!ws) {
      throw new Error(ERR_NOT_INITED);
    }
    return ws;
  },
  get key() {
    if (!key) {
      throw new Error(ERR_NOT_INITED);
    }
    return key;
  },
  get controller() {
    return controller;
  },
  /**
   * @type {Controller} _
   */
  set controller(_) {
    controller = _;
  },
  get messenger() {
    if (!messenger) {
      throw new Error(ERR_NOT_INITED);
    }
    return messenger;
  },
  /**
   * @param {Object} p
   * @param {WebSocket} p.websocket
   * @param {string} p.key
   * @param {import('../imessenger/index.js').Messenger} p.messenger
   */
  async init({
    websocket,
    key: _key,
    messenger: _messenger,
  }) {
    app = new Application();
    await app.init({
      backgroundColor: 0x000000,
      resizeTo: window,
    });
    ws = websocket;
    key = _key;
    document.body.appendChild(app.canvas);
    messenger = _messenger;
  },
};
