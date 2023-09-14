/**
 * This class is used to calculate and store the properties of the canvas.
 *
 * @typedef {Object} CanvasProperties
 * @param {HTMLCanvasElement} canvas - The canvas element.
 * @property {number} width - The total width of the canvas.
 * @property {number} height - The total height of the canvas.
 * @property {number} marginWidth - The margins on the sides of the graphrendering area.
 * @property {number} marginHeight - The margins on the top and bottom of the graphrendering area.
 * @property {number} renderAreaWidth - The width of the graphrendering area.
 * @property {number} renderAreaHeight - The height of the graphrendering area.
 */
export class CanvasProperties {
  #width
  #height
  #marginWidth
  #marginHeight
  #renderAreaWidth
  #renderAreaHeight
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor (canvas) {
    const computedStyle = getComputedStyle(canvas)
    const baseTen = 10 // We're using base 10. Don't change.
    const marginRatio = 0.1 // 10% margin, 80% render area. Change if you want to.
    this.#width = parseInt(computedStyle.getPropertyValue('width'), baseTen)
    this.#height = parseInt(computedStyle.getPropertyValue('height'), baseTen)
    this.#marginWidth = this.#width * marginRatio
    this.#marginHeight = this.#height * marginRatio
    this.#renderAreaWidth = this.#width - marginWidth * 2
    this.#renderAreaHeight = this.#height - marginHeight * 2
  }

  /**
   * Get the Width of the canvas.
   * @readonly
   * @returns {number} The total width of the canvas.
   */
  get width () {
    return this.#width
  }

  /**
   * Get the Height of the canvas.
   * @readonly
   * @returns {number} The total height of the canvas.
   */
  get height () {
    return this.#height
  }

  /**
   * Get the margin width of the canvas.
   * @readonly
   * @returns {number}  The width of the margins on the sides of the graphrendering area.
   */
  get marginWidth () {
    return this.#marginWidth
  }

  /**
   * Get the margin height of the canvas.
   * @readonly
   * @returns {number} The height of the margins on the top and bottom of the graphrendering area.
   */
  get marginHeight () {
    return this.#marginHeight
  }

  /**
   * Get the render area width of the canvas.
   * @readonly
   * @returns {number} The width of the graphrendering area.
   */
  get renderAreaWidth () {
    return this.#renderAreaWidth
  }

  /**
   * Get the render area height of the canvas.
   * @readonly
   * @returns {number} The height of the graphrendering area.
   */
  get renderAreaHeight () {
    return this.#renderAreaHeight
  }
}