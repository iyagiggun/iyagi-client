import { IMT } from '../../const/index.js';

/**
 * @typedef Message
 * @property {string} type
 * @property {*} data
 */

/** @type {((msg: Message) => Promise<void>)[]} */
const recieve_list = [];

/**
 * @param {(msg: Message) => void} recieve
 */
const add = (recieve) => {
  if (recieve_list.includes(recieve)) {
    return;
  }
  recieve_list.push(recieve);
};

const excute = async ({ type, data }) => {
  const promises = recieve_list.map((recieve) => recieve({ type, data }));
  await Promise.all(promises);
};

/**
 * @param {Message} msg
 * @return {Promise<void>}
 */
const default_recieve = (msg) => {
  switch(msg.type) {
    case IMT.LIST: {
      /** @type {Message[]} */
      const list = msg.data.list;
      return list.reduce(
        /**
         * @param {Promise<void>} prev
         * @param {Message} msg
         */
        (prev, msg) => prev.then(() => excute(msg)), Promise.resolve());
    }
    case IMT.WAIT: {
      return new Promise((resolve) => {
        window.setTimeout(() => resolve(), msg.data.delay);
      });
    }
  }
};

add(default_recieve);

/**
 * @param {WebSocket} ws
 */
const init = (ws) => {
  ws.addEventListener('message', (msg) => {
    const { type, data } = JSON.parse(msg.data);
    excute({ type, data });
  });
};


export default {
  init,
  add,
};
