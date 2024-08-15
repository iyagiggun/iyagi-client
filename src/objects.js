/**
 * @typedef {import('./object/index.js').default} IObject
 */

export default class Objects {
  /** @type {{ [key: string]: IObject | undefined }} */
  #map = {};

  /**
   * @param {string} name
   */
  get(name) {
    const obj = this.#map[name];
    if (!obj) {
      throw new Error(`Fail to get object. name: ${name}`);
    }
    return obj;
  }

  /**
   * @param {IObject} obj
   */
  add(obj) {
    if (this.#map[obj.name]) {
      throw new Error('It has been added with the same name.');
    }
    this.#map[obj.name] = obj;
  }

  /**
   * @param {IObject[]} list
   */
  addList(list) {
    list.forEach((obj) => this.add(obj));
  }

}
