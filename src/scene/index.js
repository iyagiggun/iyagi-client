import { IMT } from '../const';

/**
 * @typedef {import('../object').default} IObject
 */

export class Scene {

  #ws;

  #app;

  #objectGetterMap;

  /**
   * @param {Object} p
   * @param {WebSocket} p.websocket
   * @param {import('pixi.js').Application} p.application
   * @param {{ [key:string]: () => IObject }} p.objectGetterMap
   */
  constructor({
    websocket,
    application,
    objectGetterMap,
  }) {
    this.#ws = websocket;
    this.#app = application;
    this.#objectGetterMap = objectGetterMap;

    this.#ws.addEventListener('message', (msg) => {
      const { type, data } = JSON.parse(msg.data);

      switch (type) {
        case IMT.SCENE_LOAD: {
          this.#load(data);
        }
      }

    });
  }

  /**
   * @param {{
   *  objects: {
   *    key: string;
   *    pos?: { x?: number, y?: number, z?: number}
   *  }[]
   * }} data
   */
  #load(data) {
    data.objects.map(async (info) => {
      const getter = this.#objectGetterMap[info.key];
      if (!getter) {
        throw new Error(`Fail to load the scene. No object. ${info.key}`);
      }
      const object = await getter().load();
      this.#app.stage.addChild(object.container);

      if (info.pos) {
        console.error(info);
        object.xyz = info.pos;
      }
    });
  }

  /**
   * @param {string} id
   */
  request(id) {
    this.#ws.send(JSON.stringify({
      type: IMT.SCENE_LOAD,
      data: {
        id,
      },
    }));
  }
}
