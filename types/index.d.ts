export default client;
export type InitParams = {
    websocket: WebSocket;
};
declare namespace client {
    /**
     * @param {InitParams} p
     * @returns
     */
    function init({ websocket, }: InitParams): Promise<void>;
    const application: Application<import("pixi.js").Renderer>;
}
import { Application } from 'pixi.js';
