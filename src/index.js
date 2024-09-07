import { Rectangle } from 'pixi.js';
import { IMT } from './const/index.js';
import global from './global/index.js';
import scene from './scene/index.js';
import take from './scene/take.js';
import resource from './resource/index.js';

/**
 * @typedef {{
 *  container: import('pixi.js').Container;
 *  target: import('./object/index.js').default | null;
 * }} Controller
 */

let inited = false;

/** @type { Controller | null } */
let controller = null;

const iyagi = {

  /**
   * @param {{
   *  websocket: WebSocket;
   *  controller?: Controller;
   *  entry: string;
   * }} p
   */
  async init(p) {
    await global.init({
      websocket: p.websocket,
    });

    const app = global.app();

    global.ws().addEventListener('message', (msg) => {
      const { type, data } = JSON.parse(msg.data);

      switch (type) {
        case IMT.CONTROLLER.ENABLE: {
          if (!controller) {
            throw new Error('No controller.');
          }
          const { width, height } = app.screen;
          if (data.target) {
            controller.target = resource.objects.get(data.target);
          } else {
            controller.target = null;
          }
          const cc = controller.container;
          cc.hitArea = new Rectangle(0, 0, width, height);
          app.stage.addChild(cc);
          break;
        }
        case IMT.CONTROLLER.DISABLE: {
          if (this.controller) {
            app.stage.removeChild(this.controller.container);
          }
        }
      }
    });
    // Pixi.js 애플리케이션 자동 리사이즈 처리 (옵션)
    // window.addEventListener('resize', () => {
    //   app.renderer.resize(window.innerWidth, window.innerHeight);
    //   container.width = app.screen.width;
    //   container.height = app.screen.height;
    //   container.hitArea = new PIXI.Rectangle(0, 0, app.screen.width, app.screen.height);
    // });
    app.stage.addChild(scene.container);
    scene.init(p.entry);
    scene.play();
    inited = true;
  },
  get application() {
    return global.app();
  },
  get take() {
    return take;
  },
  get controller() {
    return controller;
  },
  /** @param { Controller | null } next */
  set controller(next) {
    if (inited && !next && controller && this.application.stage.children.includes(controller.container)) {
      this.application.stage.removeChild(controller.container);
    }
    controller = next;
  },
};

export default iyagi;
