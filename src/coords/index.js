/**
 * @typedef {{
  *  x: number;
  *  y: number;
  *  w: number;
  *  h: number;
 * }} Area
 *
 * @typedef {{
 *  x: number;
 *  y: number;
 * }} Position
 *
 * @typedef {'up' | 'down' | 'left' | 'right' } Direction
 */

/**
 * @param {Position} delta
 */
export const getDirectionByDelta = (delta) => {
  if (Math.abs(delta.x) > Math.abs(delta.y)) {
    return delta.x > 0 ? 'right' : 'left';
  }
  return delta.y > 0 ? 'down' : 'up';
};
