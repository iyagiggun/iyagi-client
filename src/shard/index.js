import { Container } from 'pixi.js';
import { ObjectResource, objects } from '../object/index.js';
import resource from '../resource/index.js';
import { IMT } from '../const/index.js';

const container = new Container();

const clear = () => {
  container.removeChildren();
};

/**
 * @param {import('../teller/index.js').SubjectData} data
 * @returns
 */
const load = async ({ message, reply }) => {

  const data = message.data;

  await Promise.all(data.shard.objects.map(async (info) => {
    if (!resource.objects.contains(info.resource)) {
      resource.objects.add(new ObjectResource(info.resource, info));
    }

    const object_resource = resource.objects.find(info.resource);
    const obj = (await object_resource.load()).stamp(info.id);
    obj.xyz = info;
    obj.direction = info.direction;
    container.addChild(obj.container);
    objects.push(obj);
    return obj;
  }));
  reply({
    type: IMT.SHARD_LOADED,
  });
};

export const shard = {
  container,
  load,
  clear,
};
