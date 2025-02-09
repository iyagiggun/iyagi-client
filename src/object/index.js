import ObjectResource from './resource.js';
import IObject from './iobject/index.js';
import { IMT } from '../const/index.js';

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
    default:
      return Promise.resolve();
  }
};

export { ObjectResource, IObject };
