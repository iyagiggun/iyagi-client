import global from './global/index.js';
import scene from './scene/index.js';
import take from './scene/take.js';

/**
 * @typedef {import('./object/index.js').default} IObject
 */

/**
 * @typedef {{
 *   container: import('pixi.js').Container
 * }} Controller
 */

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

    // global.ws().addEventListener('message', (msg) => {
    // const { type } = JSON.parse(msg.data);

    // const app = global.app();

    // switch (type) {
    //   case IMT.CONTROLLER.ENABLE: {
    //     const cc = this.#controller().container;
    //     const { width, height } = app.screen;
    //     cc.hitArea = new Rectangle(0, 0, width, height);
    //     app.stage.addChild(cc);
    //     break;
    //   }
    //   case IMT.CONTROLLER.DISABLE: {
    //     app.stage.removeChild(this.#controller().container);
    //   }
    // }
    // });
    // Pixi.js 애플리케이션 자동 리사이즈 처리 (옵션)
    // window.addEventListener('resize', () => {
    //   app.renderer.resize(window.innerWidth, window.innerHeight);
    //   container.width = app.screen.width;
    //   container.height = app.screen.height;
    //   container.hitArea = new PIXI.Rectangle(0, 0, app.screen.width, app.screen.height);
    // });
    scene.init(p.entry);
    scene.play();
  },
  get application() {
    return global.app();
  },
  get take() {
    return take;
  },
};

export default iyagi;
