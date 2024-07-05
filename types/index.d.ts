export default client;
declare namespace client {
    function init(): Promise<void>;
    const application: Application<import("pixi.js").Renderer>;
}
import { Application } from 'pixi.js';
