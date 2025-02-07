import { Container, Rectangle } from 'pixi.js';
import { IMT } from '../const/index.js';
import reciever from '../message/reciever/index.js';
import sender from '../message/sender/index.js';
import resource from '../resource/index.js';
import camera from '../camera/index.js';
import global from '../global/index.js';
import { ObjectResource } from '../object/index.js';

/**
 * @typedef {import('../message/reciever/index.js').Message} Message
 */

const container = new Container();

/** @type { string | undefined } */
let current;

/** @type {import('../object/index.js').IObject[]} */
const objects = [];

const clear = () => {
  container.removeChildren();
};

/**
 * @param {{
 *  objects: {
 *    key: string;
 *    position?: { x?: number, y?: number, z?: number };
 *  }[]
 * }} data
 */
const load = async (data) => {
  clear();
  await Promise.all(data.objects.map(async (info) => {
    if (!resource.objects.contains(info.key)) {
      resource.objects.add(new ObjectResource(info));
    }
    const object_resrouce = resource.objects.find(info.key);
    const obj = (await object_resrouce.load()).stamp(info.key);
    if (info.position) {
      obj.xyz = info.position;
    }
    container.addChild(obj.container);
    objects.push(obj);
    return obj;
  }));

  sender.scene_loaded({
    scene: current,
  });
};

/**
 * @param {*} data
 */
const move = (data) => {
  const target = objects.find((sprite) => sprite.name === data.target);
  if (!target) {
    throw new Error(`Fail to move. No target. ${data.target}`);
  }
  const direction = data.direction;
  if (direction) {
    target.direction = direction;
  }
  return target.move(data);
};

/**
 * @param {*} data
 */
const talk = (data) => {
  const target = resource.objects.find(data.target);
  return target.talk(data.message);
};

/**
 * @param {*} data
 */
const focus = async (data) => {
  const position = (() => {
    if (typeof data.target === 'string') {
      const target = objects.find((obj) => obj.name === data.target);
      if (!target) {
        throw new Error(`Fail to focus. No target. ${data.target}`);
      }
      return target.xy;
    }
    if (typeof data.target === 'object' && typeof data.target.x === 'number' && typeof data.target.y === 'number') {
      return data.target;
    }
    throw new Error('Fail to focus in the scene');
  })();
  if (data.options?.speed > 0) {
    await camera.move(position, data.options.speed);
  } else {
    camera.point(position);
  }
};

/**
 * @param {*} data
 */
const control = (data) => {
  const { controller, app } = global;
  if (!controller) {
    throw new Error('No controller.');
  }
  const { width, height } = app.screen;
  if (data.target) {
    controller.target = objects.find((obj) => obj.name === data.target) ?? null;
  } else {
    controller.target = null;
  }
  const cc = controller.container;
  cc.hitArea = new Rectangle(0, 0, width, height);
  app.stage.addChild(cc);

  return Promise.resolve();
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

    case IMT.SCENE_MOVE:
      return move(msg.data);

    case IMT.SCENE_TALK:
      return talk(msg.data);

    case IMT.SCENE_FOCUS:
      return focus(msg.data);

    case IMT.SCENE_CONTROL:
      return control(msg.data);
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
