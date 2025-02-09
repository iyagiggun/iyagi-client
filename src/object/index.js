import ObjectResource from './resource.js';
import IObject from './iobject/index.js';
import { IMT } from '../const/index.js';
import global from '../global/index.js';
import { Rectangle } from 'pixi.js';

/**
 * @type {IObject[]}
 */
export const objects = [];

/**
 * @param {string} key
 */
const find = (key) => {
  const obj = objects.find((obj) => obj.name === key);
  if (!obj) {
    throw new Error('Fail to find object.');
  }
  return obj;
};

const move = (data) => {
  const target = find(data.target);
  const direction = data.direction;
  if (direction) {
    target.direction = direction;
  }
  return target.move(data);
};

const talk = (data) => {
  const target = find(data.target);
  return target.talk(data.message);
};

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

/**
 * @param {Message} msg
 * @return {Promise<void>}
 */
export const recieve_object_event = (msg) => {
  switch(msg.type) {
    case IMT.OBJECT_MOVE:
      return move(msg.data);
    case IMT.OBJECT_TALK:
      return talk(msg.data);
    case IMT.OBJECT_CONTROL:
      return control(msg.data);
    default:
      return Promise.resolve();
  }
};

export { ObjectResource, IObject };
