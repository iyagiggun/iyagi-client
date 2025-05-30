import ObjectResource from './resource.js';
import IObject from './iobject/index.js';
import global from '../global/index.js';
import { Rectangle } from 'pixi.js';

/**
 * @type {IObject[]}
 */
export const objects = [];

/**
 * @param {string} id
 */
const find = (id) => {
  const obj = objects.find((obj) => obj.id === id);
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
  controller.target = find(data.target);
  const cc = controller.container;
  cc.hitArea = new Rectangle(0, 0, width, height);
  app.stage.addChild(cc);

  return Promise.resolve();
};

const release = () => {
  const { controller, app } = global;
  if (!controller) {
    throw new Error('No controller.');
  }
  controller.release();
  app.stage.removeChild(controller.container);
};


const remove = (data) => {
  const idx = objects.findIndex((obj) => obj.id === data.id);
  if (idx >= 0) {
    objects.splice(idx, 1).forEach((removed) => {
      const parent = removed.container.parent;
      if (parent){
        parent.removeChild(removed.container);
      }
    });
  }
  return Promise.resolve();
};

const motion = (data) => {
  const target = find(data.target);
  target.set(data.motion);
  return Promise.resolve();
};

export default {
  talk,
  move,
  remove,
  motion,
  control,
  release,
};

export { ObjectResource, IObject };
