import { Container } from 'pixi.js';
import { IMT } from '../const/index.js';
import SceneObject from './objects.js';
import SceneCamera from './camera.js';
import take from './take.js';

/**
 * @typedef {import('../object/index.js').default} IObject
 */

export class Scene {

  #ws;

  #app;

  #container = new Container();

  #current;

  object;

  camera;

  take = take;

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
    this.camera = new SceneCamera(this.#app, this.#container);
    this.object = new SceneObject(this.#app);

    this.#ws.addEventListener('message', async (ev) => {
      const message = JSON.parse(ev.data);
      switch (message.type) {
        case IMT.SCENE.LOAD: {
          this.#load(message.data);
          break;
        }
        case IMT.SCENE.TAKE: {
          const key = message.data.key;
          await take.get(key)(this);
          this.#ws.send(JSON.stringify({
            type: IMT.SCENE.TAKEN,
            data: {
              key,
            },
          }));
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
    const objects = await this.object.load(data);

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
}
