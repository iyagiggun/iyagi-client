/**
 * @typedef {() => Promise<void>} TakeItem
 */

/** @type {{ [name: string]: TakeItem | undefined }} */
const takesMap = {};

const take = {
  /**
   * @param {string} key
   */
  get(key) {
    const itema = takesMap[key];
    if (!itema) {
      throw new Error(`Fail to get take. key: ${key}`);
    }
    return itema;
  },
  /**
   * @param {{key: string, take: TakeItem }} p
   */
  add(p) {
    if (takesMap[p.key]) {
      throw new Error('It has been added with the same name.');
    }
    takesMap[p.key] = p.take;
  },
  /**
     * @param {{key: string, take: TakeItem }[]} list
     */
  addAll(list) {
    list.forEach((obj) => this.add(obj));
  },
};

export default take;
