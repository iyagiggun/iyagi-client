/**
 * @typedef {import('../object/index.js').default} IObject;
 */

/** @type {{ [name: string]: IObject | undefined }} */
const objectsMap = {};

const resource = {
  objects: {
    /**
     * @param {string} name
     */
    contains(name) {
      return !!objectsMap[name];
    },
    /**
     * @param {string} name
     */
    get(name) {
      const obj = objectsMap[name];
      if (!obj) {
        throw new Error(`Fail to get object. name: ${name}`);
      }
      return obj;
    },
    /**
     * @param {IObject} obj
     */
    add(obj) {
      if (objectsMap[obj.name]) {
        throw new Error(`Fail to add resource. Duplicated name(${obj.name}).`);
      }
      objectsMap[obj.name] = obj;
    },
    /**
     * @param {IObject[]} list
     */
    addAll(list) {
      list.forEach((obj) => this.add(obj));
    },
  },
};

export default resource;
