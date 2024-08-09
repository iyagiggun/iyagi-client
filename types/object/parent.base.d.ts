export default IObjectBase;
export type Area = import('../coords').Area;
export type Direction = 'up' | 'down' | 'left' | 'right';
export type SpriteImage = {
    url: string;
    scale?: number | undefined;
};
export type ActionArea = {
    image?: SpriteImage | undefined;
    frames: Area[];
    hitboxes?: import("../coords").Area[] | undefined;
};
export type Motion = {
    image?: SpriteImage | undefined;
    loop?: boolean | undefined;
    hitboxes?: import("../coords").Area[] | undefined;
    up?: ActionArea | undefined;
    down?: ActionArea | undefined;
    left?: ActionArea | undefined;
    right?: ActionArea | undefined;
};
export type SpriteInfo = {
    image?: SpriteImage | undefined;
    base: Motion;
    actions?: {
        [key: string]: Motion;
    } | undefined;
};
declare class IObjectBase {
    /**
     * @param {string} key
     * @param {SpriteInfo} sprite
     */
    constructor(key: string, sprite: SpriteInfo);
    key: string;
    container: Container<import("pixi.js").ContainerChild>;
    load(): Promise<this>;
    #private;
}
import { Container } from 'pixi.js';
