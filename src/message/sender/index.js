import { IMT } from '../../const/index.js';
import global from '../../global/index.js';

const sender = {
  /**
   * @param {*} data
   */
  move(data) {
    global.ws.send(JSON.stringify({
      key: global.key,
      type: IMT.MOVE,
      data,
    }));
  },
  /**
   * @param {*} data
   */
  scene_load(data) {
    global.ws.send(JSON.stringify({
      key: global.key,
      type: IMT.SCENE_LOAD,
      data,
    }));
  },
  /**
   * @param {*} data
   */
  scene_loaded(data) {
    global.ws.send(JSON.stringify({
      key: global.key,
      type: IMT.SCENE_LOADED,
      data,
    }));
  },
  /**
   * @param {*} data
   */
  scene_taken(data) {
    global.ws.send(JSON.stringify({
      key: global.key,
      type: IMT.SCENE_TAKEN,
      data,
    }));
  },
};

export default sender;
