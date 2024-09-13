
export default class IObjectCoords {
  container;

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
    if (typeof y === 'number') {
      this.container.y = y - (offset ? offset.y : 0);
    }
    if (typeof z === 'number') {
      this.container.zIndex = 1000 * z;
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
