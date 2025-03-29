import { IMT } from '../../const/index.js';
import global from '../../global/index.js';

const sender = {
  /**
   * @param {*} data
   */
  move(data) {
    global.ws.send(JSON.stringify({
      key: global.key,
      type: IMT.OBJECT_MOVE,
      data,
    }));
  },
  /**
   * @param {import('../../object/index.js').IObject} target
   */
  interact(target) {
    global.ws.send(JSON.stringify({
      key: global.key,
      type: IMT.OBJECT_INTERACT,
      data: {
        target: target.serial,
      },
    }));
  },
  shard_load() {
    global.ws.send(JSON.stringify({
      key: global.key,
      type: IMT.SHARD_LOAD,
    }));
  },
  /**
   * @param {*} data
   */
  shard_loaded(data) {
    global.ws.send(JSON.stringify({
      key: global.key,
      type: IMT.SHARD_LOADED,
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
