import application from '../global/index.js';
import { IMT } from '../const/index.js';
import resource from '../resource/index.js';
import take from './take.js';
import global from '../global/index.js';

/** @type { string | undefined } */
let current;

/**
 * @param {{
 *  objects: {
 *    name: string;
 *    pos?: { x?: number, y?: number, z?: number}
 *  }[]
 * }} data
 */
const load = async (data) => {
  const loaded = await Promise.all(data.objects.map(async (info) => {
    const object = await resource.objects.get(info.name).load();
    if (info.pos) {
      object.xyz = info.pos;
    }
    return object;
  }));

  const stage = application.app().stage;

  loaded.forEach((obj) => {
    stage.addChild(obj.container);
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
          data: {
            key,
          },
        }));
      }
    }
  });
};

export default {
  init,
  play,
  load,
};
