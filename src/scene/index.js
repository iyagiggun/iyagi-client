import { Container, Rectangle } from 'pixi.js';
import { IMT } from '../const/index.js';
import reciever from '../message/reciever/index.js';
import sender from '../message/sender/index.js';
import resource from '../resource/index.js';
import camera from '../camera/index.js';
import global from '../global/index.js';
import { recieve_object_event, objects, ObjectResource } from '../object/index.js';

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
 *    key: string;
 *  }[]
 * }} data
 */
const load = async (data) => {
  clear();
  await Promise.all(data.objects.map(async (info) => {
    if (!resource.objects.contains(info.resource)) {
      resource.objects.add(new ObjectResource(info.resource, info));
    }

    const object_resource = resource.objects.find(info.resource);
    const obj = (await object_resource.load()).stamp(info.serial);
    obj.xyz = info;
    obj.direction = info.direction;
    container.addChild(obj.container);
    objects.push(obj);
    return obj;
  }));

  sender.scene_loaded({
    scene: current,
  });
};

const focus = async (data) => {
  if (data.speed > 0) {
    await camera.move(data);
  } else {
    camera.point(data);
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


const object = (data) => {
  console.error(data);
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

    case IMT.SCENE_FOCUS:
      return focus(msg.data);

    case IMT.SCENE_OBJECT:
      return object(msg.data);

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
  reciever.add(recieve_object_event);
};

export default {
  container,
  init,
  play,
};
