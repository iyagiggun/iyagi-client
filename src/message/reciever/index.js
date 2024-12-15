import { Rectangle } from 'pixi.js';
import { IMT } from '../../const/index.js';
import global from '../../global/index.js';
import resource from '../../resource/index.js';

/**
 * @typedef Message
 * @property {string} type
 * @property {*} data
 */

/** @type {((msg: Message) => void)[]} */
const recieve_list = [];

/**
 * @param {(msg: Message) => void} recieve
 */
const add = (recieve) => {
  if (recieve_list.includes(recieve)) {
    return;
  }
  recieve_list.push(recieve);
};

/**
 * @param {WebSocket} ws
 */
const init = (ws) => {

  const app = global.app;

  ws.addEventListener('message', (msg) => {
    const { type, data } = JSON.parse(msg.data);

    switch (type) {

      // case IMT.CONTROLLER_ENABLE: {
      //   const controller = global.controller;
      //   if (!controller) {
      //     throw new Error('No controller.');
      //   }
      //   const { width, height } = app.screen;
      //   if (data.target) {
      //     controller.target = resource.objects.find(data.target);
      //   } else {
      //     controller.target = null;
      //   }
      //   const cc = controller.container;
      //   cc.hitArea = new Rectangle(0, 0, width, height);
      //   app.stage.addChild(cc);
      //   break;
      // }

      case IMT.CONTROLLER_DISABLE: {
        if (global.controller) {
          app.stage.removeChild(global.controller.container);
        }
        break;
      }

      default:
        recieve_list.forEach((recieve) => {
          try {
            recieve({ type, data });
          } catch (e) {
            throw new Error(`Fail to excute recieve. ${type}  ${data}`);
          }
        });
    }
  });
};


export default {
  init,
  add,
};
