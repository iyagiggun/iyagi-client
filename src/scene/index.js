import { Container } from 'pixi.js';
import { IMT } from '../const/index.js';
import resource from '../resource/index.js';

/**
 * @typedef {import('../object/index.js').default} IObject
 */

export class Scene {

  #ws;

  #app;

  #container = new Container();

  #current;

  /**
   * @param {{
   *  websocket: WebSocket;
   *  application: import('pixi.js').Application;
   *  entry: string;
   * }} p
   */
  constructor({
    websocket,
    application,
    entry,
  }) {
    this.#ws = websocket;
    this.#app = application;
    this.#current = entry;

    this.#ws.addEventListener('message', (ev) => {
      const message = JSON.parse(ev.data);
      switch (message.type) {
        case IMT.SCENE.LOAD: {
          this.#load(message.data);
          break;
        }
        case IMT.SCENE.MOVE: {
          this.#move({
            name: message.data.name,
            position: message.data.position,
          });
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
      const object = await resource.objects.get(info.name).load();
      if (info.pos) {
        object.xyz = info.pos;
      }
      return object;
    }));

    objects.forEach((obj) => {
      this.#container.addChild(obj.container);
    });

    this.#app.stage.addChild(this.#container);

    this.#ws.send(JSON.stringify({
      type: IMT.SCENE.LOADED,
      data: {
        scene: this.#current,
      },
    }));
  }

  play() {
    this.#ws.send(JSON.stringify({
      type: IMT.SCENE.LOAD,
      data: {
        scene: this.#current,
      },
    }));
  }

  /**
   * @param {{
   *  name: string;
   *  position: import('../coords/index.js').Position
   * }} p
   */
  #move({
    name,
    position,
  }) {
    console.error(name, position);
    // const object = this.#objects.get(name);
    console.error('move!!');
    // object.xy = position;
  }
}
