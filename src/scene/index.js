import { IMT } from '../const/index.js';
import resource from '../resource/index.js';
import take from './take.js';
import global from '../global/index.js';
import { Container } from 'pixi.js';

const container = new Container();
/** @type { string | undefined } */
let current;

const clear = () => {
  container.removeChildren();
};

/**
 * @param {{
 *  objects: {
 *    name: string;
 *    pos?: { x?: number, y?: number, z?: number};
 *    clone?: boolean;
 *  }[]
 * }} data
 */
const load = async (data) => {
  clear();
  const loaded = await Promise.all(data.objects.map(async (info) => {
    const original = await resource.objects.get(info.name);
    const object = await (info.clone ? (await original.load()).clone() : original.load());
    if (info.pos) {
      object.xyz = info.pos;
    }
    return object;
  }));

  loaded.forEach((obj) => {
    container.addChild(obj.container);
  });

  global.ws().send(JSON.stringify({
    type: IMT.SCENE.LOADED,
    data: {
      scene: current,
    },
  }));
};

const play = () => {
  global.ws().send(JSON.stringify({
    type: IMT.SCENE.LOAD,
    data: {
      scene: current,
    },
  }));
};

/**
 * @param {string} entry
 */
const init = (entry) => {
  const ws = global.ws();
  current = entry;

  ws.addEventListener('message', async (ev) => {
    const message = JSON.parse(ev.data);
    switch (message.type) {
      case IMT.SCENE.LOAD: {
        load(message.data);
        break;
      }
      case IMT.SCENE.TAKE: {
        const key = message.data.key;
        await take.get(key)();
        ws.send(JSON.stringify({
          type: IMT.SCENE.TAKEN,
          data: message.data,
        }));
      }
    }
  });
};

export default {
  container,
  init,
  play,
  load,
};
