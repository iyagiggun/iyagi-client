export default IObject;
export type IObjectParams = {
    /**
     * If there is no name, the key is used as the name.
     */
    key: string;
    name?: string | undefined;
    sprite: import('./loader').SpriteInfo;
};
/**
 * @typedef IObjectParams
 * @property {string} key If there is no name, the key is used as the name.
 * @property {string} [name]
 * @property {import('./loader').SpriteInfo} sprite
 */
declare class IObject {
    /**
     * @param {IObjectParams} params
     */
    constructor(params: IObjectParams);
    container: Container<import("pixi.js").ContainerChild>;
    load(): Promise<this>;
    /**
     * @param {number} x
     */
    set x(x: number);
    /**
     * @param {number} y
     */
    set y(y: number);
    /**
     * @param {{x? : number, y?: number}} xy
     */
    set xy(xy: {
        x?: number | undefined;
        y?: number | undefined;
    });
    /**
     * @param {{x?: number, y?: number, z?: number}} xyz
     */
    set xyz(xyz: {
        x?: number | undefined;
        y?: number | undefined;
        z?: number | undefined;
    });
    #private;
}
import { Container } from 'pixi.js';
