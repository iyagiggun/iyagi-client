import { Application } from 'pixi.js';

/**
 * @typedef {Object} InitParams
 * @property {WebSocket} websocket
 */

const application = new Application();

let inited = false;
/** @type {WebSocket | null} */
let ws = null;

const getWs = () => {
  if (!ws) {
    throw new Error('Fail to get a websocket. Inject a websocket through the init function.')
  }
  return ws;
}

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
    ws = websocket;
    inited = true;

    ws.addEventListener('message', (ev) => {
      console.error('client-message-receive', ev.data);
    })
  },
  get application() {
    if (!inited) {
      throw new Error('client is not inited.');
    }
    return application;
  },
  scene: {
    /**
     * @param {string} id
     */
    request(id) {
      getWs().send(JSON.stringify({
        type: 'scene.load',
        data: {
          id,
        },
      }))
      return 1;

    },
  },
};

export default client;
