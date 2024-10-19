const MAX_Z_INDEX = 999;

export default class IObjectCoords {
  container;

  z = 1;

  /**
   *
   * @param {import('pixi.js').Container} container
   */
  constructor(container) {
    this.container = container;
  }

  /**
   * @param {{ x?: number, y?: number, z?: number }} p
   * @param {import('../coords/index.js').Position} [offset]
   */
  set({ x, y, z }, offset) {
    // TODO : mod
    if (typeof x === 'number') {
      this.container.x = x - (offset ? offset.x : 0);
    }
    let shouldChangeZ = false;
    if (typeof y === 'number') {
      this.container.y = y - (offset ? offset.y : 0);
      shouldChangeZ = true;
    }
    if (typeof z === 'number') {
      this.z = z;
    }
    if (shouldChangeZ) {
      this.container.zIndex = this.z * (MAX_Z_INDEX + 1) + this.container.y + this.container.height;
    }
  }

  get() {
    return {
      x: this.container.x,
      y: this.container.y,
      z: this.container.zIndex,
    };
  }
}
