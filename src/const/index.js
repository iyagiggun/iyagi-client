export const FRAMES_PER_SECOND = 60;
export const DEFAULT_ANIMATION_SPEED = 6 / FRAMES_PER_SECOND; // 10 fps

export const IMT = {
  WAIT: 'wait',
  LIST: 'list',

  SHARD_LOAD: 'shard.load',
  SHARD_LOADED: 'shard.loaded',
  SHARD_CLEAR: 'shard.clear',

  OBJECT_MOVE: 'object.move',
  OBJECT_TALK: 'object.talk',
  OBJECT_CONTROL: 'object.control',
  OBJECT_RELEASE: 'object.release',
  OBJECT_REMOVE: 'object.remove',
  OBJECT_MOTION: 'object.motion',
  OBJECT_INTERACT: 'object.interact',

  EFFECT_FADE_IN: 'effect.fade.in',
  EFFECT_FADE_OUT: 'effect.fade.out',


  SCENE_LOAD: 'scene.load',
  SCENE_LOADED: 'scene.loaded',
  SCENE_OBJECT: 'scene.object',
  SCENE_FOCUS: 'scene.focus',
  SCENE_CONTROL: 'scene.control',

  CONTROLLER_ENABLE: 'controller.enable',
  CONTROLLER_DISABLE: 'controller.disable',

  CAMERA_FOCUS: 'camera.focus',
};
