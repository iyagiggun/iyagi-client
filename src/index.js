import { Application } from 'pixi.js';

let inited = false;
const application = new Application();

const client = {
  init() {
    return application.init({
      backgroundColor: 0x000000,
      resizeTo: window,
    })
  },
  get application() {
    if (!inited) {
      throw new Error('client is not inited.')
    }
    return application;
  },
}

export default client;
