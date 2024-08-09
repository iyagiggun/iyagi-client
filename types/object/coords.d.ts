export default class IObjectCoords {
    /**
     *
     * @param {import('pixi.js').Container} container
     */
    constructor(container: import('pixi.js').Container);
    container: import("pixi.js").Container<import("pixi.js").ContainerChild>;
    /**
     * @param {{ x?: number, y?: number, z?: number }} param0
     */
    set({ x, y, z }: {
        x?: number;
        y?: number;
        z?: number;
    }): void;
}
