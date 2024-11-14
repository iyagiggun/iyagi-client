import { Container } from 'pixi.js';
import { IMT } from '../const/index.js';
import reciever from '../message/reciever/index.js';
import sender from '../message/sender/index.js';
import resource from '../resource/index.js';
import camera from '../camera/index.js';

/**
 * @typedef {import('../message/reciever/index.js').Message} Message
 */

const container = new Container();
/** @type { string | undefined } */
let current;

const clear = () => {
  container.removeChildren();
};

/**
 * @param {{
 *  objects: {
 *    name: string;
 *    position?: { x?: number, y?: number, z?: number};
 *    clone?: string;
 *  }[]
 * }} data
 */
const load = async (data) => {
  clear();
  const loaded = await Promise.all(data.objects.map(async (info) => {
    const original = await resource.objects.find(info.name);
    const object = await (info.clone ? (await original.load()).clone(info.clone) : original.load());
    if (info.position) {
      object.xyz = info.position;
    }
    return object;
  }));

  loaded.forEach((obj) => {
    container.addChild(obj.container);
  });

  sender.scene_loaded({
    scene: current,
  });
};

/**
 * @param {*} data
 */
const move = (data) => {
  const target = resource.objects.find(data.target);
  return target.move({ position: data.position });
};

/**
 * @param {*} data
 */
const talk = (data) => {
  const target = resource.objects.find(data.target);
  return target.talk(data.text);
};

/**
 * @param {*} data
 */
const focus = (data) => {
  return new Promise((resolve) => {
    camera.point(data.target);
    // @ts-ignore
    resolve();
  });
};


const play = () => {
  sender.scene_load({
    scene: current,
  });
};

/**
 * @param {Message} msg
 * @return {Promise<void>}
 */
const recieve = (msg) => {
  switch(msg.type) {

    case IMT.SCENE_LOAD:
      return load(msg.data);

    case IMT.MOVE:
      return move(msg.data);

    case IMT.SCENE_TALK:
      return talk(msg.data);

    case IMT.SCENE_FOCUS:
      return focus(msg.data);

    case IMT.SCENE_TAKE: {
      const key = msg.data.key;
      if (!key) {
        throw new Error('Invalid "SCENE.TAKE" message. No key.');
      }
      /** @type {Message[]} */
      const list = msg.data.list;
      return list.reduce(
        /**
         * @param {Promise<void>} prev
         * @param {Message} msg
         */
        (prev, msg) => prev.then(() => recieve(msg)), Promise.resolve())
        .then(() => {
          sender.scene_taken({
            scene: current,
            key,
          });
        });
    }
    default:
      return Promise.resolve();
  }
};

/**
 * @param {string} entry
 */
const init = (entry) => {
  current = entry;
  reciever.add(recieve);
};

export default {
  container,
  init,
  play,
};
