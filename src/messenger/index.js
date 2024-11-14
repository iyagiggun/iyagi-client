import { Container, Graphics, Sprite, TextStyle, Text } from 'pixi.js';
import global from '../global/index.js';

export const TRANSPARENT_1PX_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH5QkWDxoxGJD3fwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAALSURBVAjXY2AAAgAABQAB4iYFmwAAAABJRU5ErkJggg==';


const container = new Container();

const NAME_STYLE = new TextStyle({
  fontSize: 24,
  fontStyle: 'italic',
  fontWeight: 'bold',
  fill: 0xffffff,
});

/**
 * @param {number} width
 * @returns
 */
const getMessageStyle = (width) => new TextStyle({
  fontFamily: 'Arial',
  fontSize: 24,
  // fontSize: 18,
  wordWrap: true,
  wordWrapWidth: width,
  fill: 0xffffff,
});


/**
 * @typedef {Object} MessageShowParams
 * @property {import('../object/index.js').default} speaker
 * @property {string} text
 */

/**
 * @typedef {Object} Messenger
 * @property {function(MessageShowParams): Promise<void>} show
 */


/**
 * @param {MessageShowParams} p
 */
const show = ({ speaker, text }) => {
  const application = global.app;
  const appWidth = application.screen.width;
  const appHeight = application.screen.height;


  container.width = appWidth;
  container.height = appHeight;

  const bg = new Graphics();
  bg.rect(0, 0, appWidth, appHeight / 2 - 48);
  bg.fill({ color: 0x000000, alpha: 0.7 });
  bg.x = 0;
  bg.y = appHeight - bg.height;
  container.addChild(bg);

  const upper = Sprite.from(TRANSPARENT_1PX_IMG);
  upper.width = appWidth;
  upper.height = appHeight - bg.height;
  upper.x = 0;
  upper.y = 0;
  upper.eventMode = 'static';

  // const { photo } = speaker;
  const photo = undefined;
  const name = new Text({ text: speaker.name, style: NAME_STYLE });
  const token = new Text({ text: '' });

  if (photo) {
    // const photoSize = Math.min(144, Math.min(appWidth, appHeight) / 2);
    // photo.width = photoSize;
    // photo.height = photoSize;
    // photo.x = 12;
    // photo.y = bg.y + bg.height - photoSize - 12;
    // container.addChild(photo);

    // name.x = photo.x + photo.width + 12;
    // name.y = bg.y + 6;
    // container.addChild(name);
    // token.style = getMessageStyle(bg.width - photoSize - 36);
    // token.x = photo.x + photo.width + 12;
    // token.y = name.y + name.height + 6;
    // container.addChild(token);
  } else {
    name.x = 12;
    name.y = bg.y + 6;
    container.addChild(name);

    token.style = getMessageStyle(bg.width - 36);
    token.x = 12;
    token.y = name.y + name.height + 6;
    container.addChild(token);
  }

  const messageIdxLimit = text.length;
  let messageStartIdx = 0;
  let messageEndIdx = 0;
  let isMessageOverflowed = false;

  const heightThreshold = bg.height;
  const showPartedMessage = () => {
    while (messageEndIdx <= messageIdxLimit && !isMessageOverflowed) {
      messageEndIdx += 1;
      token.text = text.substring(messageStartIdx, messageEndIdx);
      if (bg.height > heightThreshold) {
        isMessageOverflowed = true;
        messageEndIdx -= 1;
      }
    }
    isMessageOverflowed = false;
    messageStartIdx = messageEndIdx;
  };

  application.stage.addChild(upper);
  application.stage.addChild(container);

  showPartedMessage();

  return new Promise((resolve) => {
    container.eventMode = 'static';
    container.on('pointertap', (evt) => {
      evt.stopPropagation();
      if (messageEndIdx > messageIdxLimit) {
        application.stage.removeChild(upper);
        application.stage.removeChild(container);
        resolve(undefined);
      } else {
        showPartedMessage();
      }
    });
  });
};

const imessenger = {
  show,
};

export default imessenger;
