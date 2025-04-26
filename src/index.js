import global from './global/index.js';
import imessenger from './imessenger/index.js';
import { teller } from './teller/index.js';
import { shard } from './shard/index.js';

/** @typedef {import('./global/index.js').Controller} Controller */

const iclient = {
  teller,
  async init() {
    await global.init({
      messenger: imessenger,
    });

    const app = global.app;

    // reciever.init(global.ws);

    // Pixi.js 애플리케이션 자동 리사이즈 처리 (옵션)
    // window.addEventListener('resize', () => {
    //   app.renderer.resize(window.innerWidth, window.innerHeight);
    //   container.width = app.screen.width;
    //   container.height = app.screen.height;
    //   container.hitArea = new PIXI.Rectangle(0, 0, app.screen.width, app.screen.height);
    // });
    app.stage.addChild(shard.container);
    // scene.init();
    // scene.play();
    // inited = true;
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
    if (last && this.application.stage.children.includes(last.container)) {
      this.application.stage.removeChild(last.container);
    }
    global.controller = next;
  },

  // get messenger() {
  //   return {
  //     move: sender.move,
  //     interact: sender.interact,
  //   };
  // },
};

export default iclient;
