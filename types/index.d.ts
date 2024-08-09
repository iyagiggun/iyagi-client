export default IClient;
export type IObject = import('./object').default;
export type InitParams = {
    websocket: WebSocket;
    objectGetterMap: {
        [key: string]: () => IObject;
    };
};
/**
 * @typedef {import('./object').default} IObject
 */
/**
 * @typedef {Object} InitParams
 * @property {WebSocket} websocket
 * @property {{ [key:string]: () => IObject }} objectGetterMap
 */
declare class IClient {
    /**
     * @param {InitParams} p
     */
    constructor(p: InitParams);
    init(): Promise<void>;
    get application(): Application<import("pixi.js").Renderer>;
    get scene(): Scene;
    #private;
}
import { Application } from 'pixi.js';
import { Scene } from './scene';
