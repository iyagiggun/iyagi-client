
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
   * @param {{ x?: number, y?: number, z?: number }} param0
   */
  set({ x, y, z }) {
    // TODO : mod
    if (typeof x === 'number') {
      this.container.x = x;
    }
    if (typeof y === 'number') {
      this.container.y = y;
    }
    if (typeof z === 'number') {
      this.container.zIndex = 1000 * z;
    }

  }
}
