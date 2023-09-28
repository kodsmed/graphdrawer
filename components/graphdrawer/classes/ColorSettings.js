import { ValidationCollection } from './ValidationCollection.js'
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
    const backgroundDefaultColor = 'white'
    const validColors = ['red', 'green', 'lime', 'blue', 'yellow', 'orange', 'purple', 'black', 'gray', 'white']
    const mockArgumentObject = { graphLineColor: graphLineColor, graphDotColor: graphDotColor, zeroLineColor: zeroLineColor, axisColor: axisColor, labelColor: labelColor, titleColor: titleColor, backgroundColor: backgroundColor }
    const validator = new ValidationCollection({ validValues: validColors })

    if(!validator.isObjectThatMustHaveSanctionedValues(mockArgumentObject)) {
      throw new TypeError('ColorSettings constructor: One or more parameters are not valid: ' + validator.unexpectedValues.join(', '))
    }
    this.#graphLineColor = graphLineColor || defaultColor
    this.#graphDotColor = graphDotColor || defaultColor
    this.#zeroLineColor = zeroLineColor || defaultColor
    this.#axisColor = axisColor || defaultColor
    this.#labelColor = labelColor || defaultColor
    this.#titleColor = titleColor || defaultColor
    this.#backgroundColor = backgroundColor || backgroundDefaultColor
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