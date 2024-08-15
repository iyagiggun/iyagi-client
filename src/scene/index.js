import { Container } from 'pixi.js';
import { IMT } from '../const/index.js';

/**
 * @typedef {import('../object/index.js').default} IObject
 */

export class Scene {

  #ws;

  #app;

  #objects;

  #container = new Container();

  /**
   * @param {Object} p
   * @param {WebSocket} p.websocket
   * @param {import('pixi.js').Application} p.application
   * @param {import('../objects.js').default} p.objects
   */
  constructor({
    websocket,
    application,
    objects,
  }) {
    this.#ws = websocket;
    this.#app = application;
    this.#objects = objects;

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
   *    name: string;
   *    pos?: { x?: number, y?: number, z?: number}
   *  }[]
   * }} data
   */
  async #load(data) {
    const objects = await Promise.all(data.objects.map(async (info) => {
      const object = await this.#objects.get(info.name).load();
      if (info.pos) {
        object.xyz = info.pos;
      }
      return object;
    }));

    objects.forEach((obj) => {
      this.#container.addChild(obj.container);
    });

    this.#app.stage.addChild(this.#container);
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
