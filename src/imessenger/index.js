import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import global from '../global/index.js';

export const TRANSPARENT_1PX_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH5QkWDxoxGJD3fwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAALSURBVAjXY2AAAgAABQAB4iYFmwAAAABJRU5ErkJggg==';

const NAME_STYLE = new TextStyle({
  fontSize: 24,
  fontStyle: 'italic',
  fontWeight: 'bold',
  fill: 0xffffff,
});

const container = new Container();
const bg = new Graphics();
const token = new Text({ text: '' });
const name = new Text({ text: '', style: NAME_STYLE });

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
 * @property {import('../object/resource.js').default} speaker
 * @property {string} text
 * @property {string=} portrait
 */

/**
 * @typedef {Object} Messenger
 * @property {function(MessageShowParams): Promise<void>} show
 */


/**
 * @param {MessageShowParams} p
 */
const show = ({ speaker, text, portrait: pKey }) => {

  const application = global.app;
  const appWidth = application.screen.width;
  const appHeight = application.screen.height;

  bg.clear();
  bg.rect(0, 0, appWidth, appHeight / 2 - 48);
  bg.fill({ color: 0x000000, alpha: 0.7 });
  bg.x = 0;
  bg.y = appHeight - bg.height;
  container.addChild(bg);

  const portrait = speaker.portrait.get(pKey);
  name.text = speaker.name;

  if (portrait) {
    const photoSize = Math.min(144, Math.min(appWidth, appHeight) / 2);
    portrait.width = photoSize;
    portrait.height = photoSize;
    portrait.x = 12;
    portrait.y = bg.y + bg.height - photoSize - 12;
    container.addChild(portrait);

    name.x = portrait.x + portrait.width + 12;
    name.y = bg.y + 6;
    container.addChild(name);
    token.style = getMessageStyle(bg.width - photoSize - 36);
    token.x = portrait.x + portrait.width + 12;
    token.y = name.y + name.height + 6;
    container.addChild(token);
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

  application.stage.addChild(container);

  showPartedMessage();

  return new Promise((resolve) => {
    container.eventMode = 'static';
    container.on('pointertap', (evt) => {
      evt.stopPropagation();
      if (messageEndIdx > messageIdxLimit) {
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
