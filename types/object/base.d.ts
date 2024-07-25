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
export type Action = {
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
    actions: {
        [key: string]: Action;
    };
    base?: string | undefined;
};
declare class IObjectBase {
    /**
     * @param {string} id
     * @param {SpriteInfo} sprite
     */
    constructor(id: string, sprite: SpriteInfo);
    container: Container<import("pixi.js").ContainerChild>;
    load(): Promise<void>;
    #private;
}
import { Container } from 'pixi.js';
