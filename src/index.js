import global from './global/index.js';
import reciever from './message/reciever/index.js';
import sender from './message/sender/index.js';
import imessenger from './imessenger/index.js';
import scene from './scene/index.js';

/** @typedef {import('./global/index.js').Controller} Controller */

let inited = false;

const iclient = {
  /**
   * @param {{
   *  websocket: WebSocket;
   *  controller?: Controller;
   *  key: string;
   * }} p
   */
  async init(p) {
    await global.init({
      websocket: p.websocket,
      key: p.key,
      messenger: imessenger,
    });

    const app = global.app;

    reciever.init(global.ws);

    // Pixi.js 애플리케이션 자동 리사이즈 처리 (옵션)
    // window.addEventListener('resize', () => {
    //   app.renderer.resize(window.innerWidth, window.innerHeight);
    //   container.width = app.screen.width;
    //   container.height = app.screen.height;
    //   container.hitArea = new PIXI.Rectangle(0, 0, app.screen.width, app.screen.height);
    // });
    app.stage.addChild(scene.container);
    scene.init();
    scene.play();
    inited = true;
  },
  get application() {
    return global.app;
  },
  get controller() {
    return global.controller;
  },
  /** @param { Controller | null } next */
  set controller(next) {
    const last = global.controller;
    if (inited && !next && last && this.application.stage.children.includes(last.container)) {
      this.application.stage.removeChild(last.container);
    }
    global.controller = next;
  },

  get messenger() {
    return {
      move: sender.move,
      interact: sender.interact,
    };
  },
};

export default iclient;
