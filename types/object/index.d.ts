export default IObject;
export type IObjectParams = {
    /**
     * If there is no name, id is used as the name.
     */
    id: string;
    name?: string | undefined;
    sprite: import('./base').SpriteInfo;
};
/**
 * @typedef IObjectParams
 * @property {string} id If there is no name, id is used as the name.
 * @property {string} [name]
 * @property {import('./base').SpriteInfo} sprite
 */
declare class IObject extends IObjectBase {
    /**
     * @param {IObjectParams} params
     */
    constructor(params: IObjectParams);
    #private;
}
import IObjectBase from './base';
