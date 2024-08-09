export default class IObjectLoader {
    /**
     * @param {{
     *  container: import('pixi.js').Container;
     *  key: string;
     *  sprite: SpriteInfo
     * }} p
     */
    constructor(p: {
        container: import('pixi.js').Container;
        key: string;
        sprite: SpriteInfo;
    });
    key: string;
    container: import("pixi.js").Container<import("pixi.js").ContainerChild>;
    load(): Promise<void>;
    #private;
}
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
