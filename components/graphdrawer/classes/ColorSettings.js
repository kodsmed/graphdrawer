/**
 * This class is used to store the color settings for the graph.
 * @typedef {Object} ColorSettings
 * @property {string} graphLineColor - The color of the graph line.
 * @property {string} graphDotColor - The color of the graph dots.
 * @property {string} zeroLineColor - The color of the zero line.
 * @property {string} axisColor - The color of the axis.
 * @property {string} labelColor - The color of the labels.
 * @property {string} titleColor - The color of the title.
 * @property {string} backgroundColor - The color of the background.
 */
export class ColorSettings {
  #graphLineColor
  #graphDotColor
  #zeroLineColor
  #axisColor
  #labelColor
  #titleColor
  #backgroundColor

  /**
   * @param {string} graphLineColor - The color of the graph line.
   * @param {string} graphDotColor - The color of the graph dots.
   * @param {string} zeroLineColor - The color of the zero line.
   * @param {string} axisColor - The color of the axis.
   * @param {string} labelColor - The color of the labels.
   * @param {string} titleColor - The color of the title.
   * @param {string} backgroundColor - The color of the background.
   * @returns {ColorSettings} - An object containing the color settings.
   */
  constructor (graphLineColor, graphDotColor, zeroLineColor, axisColor, labelColor, titleColor, backgroundColor) {
    const defaultColor = 'black'
    const validColors = [
      'red',
      'green',
      'lime',
      'blue',
      'yellow',
      'orange',
      'purple',
      'black',
      'gray',
      'white'
    ]

    if (!validColors.includes(graphLineColor.toLowerCase())) {
      throw new TypeError('graphLineColor must be a valid color')
    }
    if (!validColors.includes(graphDotColor.toLowerCase())) {
      throw new TypeError('graphDotColor must be a valid color')
    }
    if (!validColors.includes(zeroLineColor.toLowerCase())) {
      throw new TypeError('zeroLineColor must be a valid color')
    }
    if (!validColors.includes(axisColor.toLowerCase())) {
      throw new TypeError('axisColor must be a valid color')
    }
    if (!validColors.includes(labelColor.toLowerCase())) {
      throw new TypeError('labelColor must be a valid color')
    }
    if (!validColors.includes(titleColor.toLowerCase())) {
      throw new TypeError('titleColor must be a valid color')
    }
    if (!validColors.includes(backgroundColor.toLowerCase())) {
      throw new TypeError('backgroundColor must be a valid color')
    }
    this.#graphLineColor = graphLineColor.toLowerCase() || defaultColor
    this.#graphDotColor = graphDotColor.toLowerCase() || defaultColor
    this.#zeroLineColor = zeroLineColor.toLowerCase() || defaultColor
    this.#axisColor = axisColor.toLowerCase() || defaultColor
    this.#labelColor = labelColor.toLowerCase() || defaultColor
    this.#titleColor = titleColor.toLowerCase() || defaultColor
    this.#backgroundColor = backgroundColor.toLowerCase() || defaultColor
  }

  /**
   * Get the color of the graph line.
   * @readonly
   * @returns {string} - the color of the graph line.
   */
  get graphLineColor () {
    return this.#graphLineColor
  }

  /**
   * Get the color of the graph dots.
   * @readonly
   * @returns {string} - the color of the graph dots.
   */
  get graphDotColor () {
    return this.#graphDotColor
  }

  /**
   * Get the color of the zero line.
   * @readonly
   * @returns {string} - the color of the zero line.
   */
  get zeroLineColor () {
    return this.#zeroLineColor
  }

  /**
   * Get the color of the axis.
   * @readonly
   * @returns {string} - the color of the axis.
   */
  get axisColor () {
    return this.#axisColor
  }

  /**
   * Get the color of the labels.
   * @readonly
   * @returns {string} - the color of the labels.
   */
  get labelColor () {
    return this.#labelColor
  }

  /**
   * Get the color of the title.
   * @readonly
   * @returns {string} - the color of the title.
   */
  get titleColor () {
    return this.#titleColor
  }

  /**
   * Get the color of the background.
   * @readonly
   * @returns {string} - the color of the background.
   */
  get backgroundColor () {
    return this.#backgroundColor
  }
}