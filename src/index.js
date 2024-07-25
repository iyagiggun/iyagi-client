import { Application } from 'pixi.js';

let inited = false;
const application = new Application();

/**
 * @typedef {Object} InitParams
 * @property {WebSocket} websocket
 */

const client = {
  /**
   * @param {InitParams} p
   * @returns
   */
  async init({
    websocket,
  }) {
    await application.init({
      backgroundColor: 0x000000,
      resizeTo: window,
    });

    document.body.appendChild(application.canvas);
    inited = true;
  },
  get application() {
    if (!inited) {
      throw new Error('client is not inited.');
    }
    return application;
  },
};

export default client;
