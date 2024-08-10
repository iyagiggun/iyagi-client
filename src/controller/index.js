import { Container } from 'pixi.js';

export default class IController {

  #ws;

  layer = new Container();

  /**
   * @param {{
   *  websocket: WebSocket;
   * }} p
   */
  constructor({
    websocket,
  }) {
    this.#ws = websocket;

    this.layer.interactive = true;
    this.layer.eventMode = 'static';

    this.layer.on('touchstart', (evt) => {
      console.error('start!!!');
    });
  }
}
