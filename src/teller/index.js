import camera from '../camera/index.js';
import { IMT } from '../const/index.js';
import object, { objects } from '../object/index.js';
import { shard } from '../shard/index.js';

/**
 * @typedef {Object} SubjectData
 * @property {*} message
 * @property {(message: *) => void} reply
 */

/**
 * @param {SubjectData} p
 */
const ask = async ({
  message,
  reply,
}) => {
  const data = message.data;

  switch (message.type) {

    case IMT.WAIT: {
      return new Promise((resolve) => {
        window.setTimeout(resolve, data.delay);
      });
    }

    case IMT.LIST:
      return data.list.reduce(
        /**
         * @param {Promise<void>} prev
         * @param {import('../scene/index.js').Message} msg
         */
        (prev, msg) => prev.then(() => ask({ message: msg, reply })), Promise.resolve());

    case IMT.SHARD_LOAD:
      return shard.load({ message, reply });

    case IMT.CAMERA_FOCUS:
      return camera.move(data);

    case IMT.OBJECT_TALK:
      return object.talk(data);

    case IMT.OBJECT_MOVE:
      return object.move(data);

    case IMT.OBJECT_REMOVE:
      return object.remove(data);

    case IMT.OBJECT_MOTION:
      return object.motion(data);

    case IMT.OBJECT_CONTROL:
      return object.control(data);

    default: {
      console.error(message);
      throw new Error('client recieve unknown message', message);
    }
  }

};

export const teller = {
  ask,
};
