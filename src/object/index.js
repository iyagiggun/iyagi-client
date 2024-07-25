import IObjectBase from './base';

/**
 * @typedef IObjectParams
 * @property {string} id If there is no name, id is used as the name.
 * @property {string} [name]
 * @property {import('./base').SpriteInfo} sprite
 */

class IObject extends IObjectBase {
  #name;

  /**
   * @param {IObjectParams} params
   */
  constructor(params) {
    super(params.id, params.sprite);
    this.#name = params.name ?? params.id;

    console.error(params, this.#name);
  }
}


export default IObject;
