import { Application } from 'pixi.js';

/** @type { Application | undefined } */
let app;
/** @type { WebSocket | undefined } */
let ws;

const ERR_NOT_INITED = 'client has not been initialized yet.';

export default {
  app() {
    if (!app) {
      throw new Error(ERR_NOT_INITED);
    }
    return app;
  },
  ws() {
    if (!ws) {
      throw new Error(ERR_NOT_INITED);
    }
    return ws;
  },
  /**
   * @param {{
   *  websocket: WebSocket
   * }} p
   */
  async init({
    websocket,
  }) {
    app = new Application();
    await app.init({
      backgroundColor: 0x000000,
      resizeTo: window,
    });
    ws = websocket;
    document.body.appendChild(app.canvas);
  },
};
