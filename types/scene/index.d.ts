/**
 * @typedef {import('../object').default} IObject
 */
export class Scene {
    /**
     * @param {Object} p
     * @param {WebSocket} p.websocket
     * @param {import('pixi.js').Application} p.application
     * @param {{ [key:string]: () => IObject }} p.objectGetterMap
     */
    constructor({ websocket, application, objectGetterMap, }: {
        websocket: WebSocket;
        application: import('pixi.js').Application;
        objectGetterMap: {
            [key: string]: () => IObject;
        };
    });
    /**
     * @param {string} id
     */
    request(id: string): void;
    #private;
}
export type IObject = import('../object').default;
