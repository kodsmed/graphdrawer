/**
 * Stores the titles of the axes.
 * This is so much OO Overkill that it hurts
 *
 * @typedef {Object} AxisTitles
 * @property {string} xAxis - The title of the x-axis.
 * @property {string} yAxis - The title of the y-axis.
 */
export class AxisTitles {
  #xAxis
  #yAxis
  /**
   * @param {string} xAxis - The title of the x-axis.
   * @param {string} yAxis - The title of the y-axis.
   * @returns {AxisTitles} - An object containing the titles of the axes.
   */
  constructor (xAxis, yAxis) {
    if (typeof xAxis !== 'string') {
      throw new TypeError('xAxis must be a string')
    }
    if (typeof yAxis !== 'string') {
      throw new TypeError('yAxis must be a string')
    }
    this.#xAxis = xAxis
    this.#yAxis = yAxis
  }

  /**
   * Get the title of the x-axis.
   * @readonly
   * @returns {string} - The title of the x-axis.
   */
  get xAxis () {
    return this.#xAxis
  }

  /**
   * Get the title of the y-axis.
   * @readonly
   * @returns {string} - The title of the y-axis.
   */
  get yAxis () {
    return this.#yAxis
  }
}