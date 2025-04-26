import { Container } from 'pixi.js';
import { ObjectResource, objects } from '../object';
import { Subject } from 'rxjs';
import resource from '../resource';
import { IMT } from '../const';

const container = new Container();

/**
 * @type {Subject<import('../teller').SubjectData>}
 */
const load$ = new Subject();

const clear = () => {
  container.removeChildren();
};

/**
 * @param {import('../teller').SubjectData} data
 * @returns
 */
const load = async ({ message, reply }) => {

  const data = message.data;

  await Promise.all(data.shard.objects.map(async (info) => {
    if (!resource.objects.contains(info.resource)) {
      resource.objects.add(new ObjectResource(info.resource, info));
    }

    const object_resource = resource.objects.find(info.resource);
    const obj = (await object_resource.load()).stamp(info.serial);
    obj.offset = info.offset;
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

load$.subscribe(async ({
  message,
  reply,
}) => {
  clear();

  const data = message.data;

  await Promise.all(data.shard.objects.map(async (info) => {
    if (!resource.objects.contains(info.resource)) {
      resource.objects.add(new ObjectResource(info.resource, info));
    }

    const object_resource = resource.objects.find(info.resource);
    const obj = (await object_resource.load()).stamp(info.serial);
    obj.offset = info.offset;
    obj.xyz = info;
    obj.direction = info.direction;
    container.addChild(obj.container);
    objects.push(obj);
    return obj;
  }));

  reply({
    type: IMT.SHARD_LOADED,
  });
});


export const shard = {
  container,
  load,
};
