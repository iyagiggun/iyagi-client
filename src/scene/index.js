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
        case IMT.SCENE.LOAD: {
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
  async #load(data) {
    const objects = await Promise.all(data.objects.map(async (info) => {
      const getter = this.#objectGetterMap[info.key];
      if (!getter) {
        new Error(`Fail to load the scene. No object. ${info.key}`);
      }
      const object = await getter().load();
      if (info.pos) {
        object.xyz = info.pos;
      }
      return object;
    }));

    objects.forEach((obj) => {
      this.#app.stage.addChild(obj.container);
    });
    console.error('loaded');
  }

  /**
   * @param {string} id
   */
  request(id) {
    this.#ws.send(JSON.stringify({
      type: IMT.SCENE.LOAD,
      data: {
        id,
      },
    }));
  }
}
