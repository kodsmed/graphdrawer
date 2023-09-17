import { CanvasProperties } from './CanvasProperties.js'
import { GraphProperties } from './GraphProperties.js'
import { FontSettings } from './FontSettings.js'
import { ColorSettings } from './ColorSettings.js'
import { AxisTitles } from './AxisTitles.js'

/**
 * This class is used to store everything that is needed to draw the graph.
 * @typedef {Object} GraphAndCanvasData
 * @property {CanvasProperties} canvasProperties - The properties of the canvas.
 * @property {GraphProperties} graphProperties - The properties of the graph.
 * @property {Array} dataset - The dataset to draw.
 * @property {number} maxNumberOfLabelsOnXAxis - The maximum number of labels on the x-axis.
 * @property {number} numberOfLabelsOnYAxis - The maximum number of labels on the y-axis.
 * @property {object} ctx - The context of the canvas.
 * @property {FontSettings} fontSettings - The font settings for the graph.
 * @property {ColorSettings} colorSetting - The color settings for the graph.
 * @property {AxisTitles} axisTitles - The titles of the axes.
 */
export class GraphAndCanvasData {
  #nonMagicZero // This is a non-magic zero. It's used to calculate the zero line. Don't change.
  #canvasProperties
  #graphProperties
  #dataset
  #maxNumberOfLabelsOnXAxis
  #numberOfLabelsOnYAxis
  #fontSettings
  #colorSettings
  #ctx
  #axisTitles
  /**
   * @param {CanvasProperties} canvasProperties - The properties of the canvas.
   * @param {GraphProperties} graphProperties - The properties of the graph.
   * @param {Array} dataset - The dataset to draw.
   * @param {number} maxNumberOfLabelsOnXAxis - The maximum number of labels on the x-axis.
   * @param {number} numberOfLabelsOnYAxis - The fixed number of labels on the y-axis.
   * @param {FontSettings} fontSettings - The font settings for the graph.
   * @param {ColorSettings} colorSetting - The context of the canvas.
   * @param {object} ctx - The context of the canvas.
   * @param {AxisTitles} axisTitles - The titles of the axes.
   * @returns {GraphAndCanvasData} - An object containing all the data and objects needed to draw the graph.
   */
  constructor (canvasProperties, graphProperties, dataset, maxNumberOfLabelsOnXAxis, numberOfLabelsOnYAxis, fontSettings, colorSettings, ctx, axisTitles) {
    //Verify the types of the parameters
    this.verifyParameterTypes(canvasProperties, graphProperties, dataset, maxNumberOfLabelsOnXAxis, numberOfLabelsOnYAxis, fontSettings, colorSettings, ctx, axisTitles)
    this.#canvasProperties = canvasProperties
    this.#graphProperties = graphProperties
    this.#dataset = dataset
    this.#maxNumberOfLabelsOnXAxis = maxNumberOfLabelsOnXAxis
    this.#numberOfLabelsOnYAxis = numberOfLabelsOnYAxis
    this.#fontSettings = fontSettings
    this.#colorSettings = colorSettings
    this.#ctx = ctx
    this.#axisTitles = axisTitles
    this.#nonMagicZero = 0 // This is a non-magic zero. It's used to calculate the zero line. Don't change.
  }

  /**
   * Verify the types of the parameters.
   * Throws an error if the parameters are invalid.
   * @param {CanvasProperties} canvasProperties - The properties of the canvas.
   * @param {GraphProperties} graphProperties - The properties of the graph.
   * @param {Array} dataset - The dataset to draw.
   * @param {number} maxNumberOfLabelsOnXAxis - The maximum number of labels on the x-axis.
   * @param {number} numberOfLabelsOnYAxis - The fixed number of labels on the y-axis.
   * @param {FontSettings} fontSettings - The font settings for the graph.
   * @param {ColorSettings} colorSetting - The context of the canvas.
   * @param {object} ctx - The context of the canvas.
   * @param {AxisTitles} axisTitles - The titles of the axes.
   * @throws {Error} - Throws an error if the parameters are invalid.
   */
  verifyParameterTypes (canvasProperties, graphProperties, dataset, maxNumberOfLabelsOnXAxis, numberOfLabelsOnYAxis, fontSettings, colorSettings, ctx, axisTitles) {
    if (!(canvasProperties instanceof CanvasProperties)) {
      throw new TypeError('canvasProperties must be an instance of CanvasProperties')
    }
    if (!(graphProperties instanceof GraphProperties)) {
      throw new TypeError('graphProperties must be an instance of GraphProperties')
    }
    this.verifyDatasetIntegrity(dataset)
    if (maxNumberOfLabelsOnXAxis === undefined
      || maxNumberOfLabelsOnXAxis === null
      || typeof maxNumberOfLabelsOnXAxis !== 'number'
      || isNaN(maxNumberOfLabelsOnXAxis
      || maxNumberOfLabelsOnXAxis < 0
      || maxNumberOfLabelsOnXAxis >= Math.max(dataset.length, 20))
      ) {
      throw new TypeError('maxNumberOfLabelsOnXAxis must be a number between 0 and the length of the dataset, or at least 20')
    }
    if (numberOfLabelsOnYAxis === undefined
      || numberOfLabelsOnYAxis === null
      || numberOfLabelsOnYAxis !== 'number'
      || isNaN(numberOfLabelsOnYAxis)
      || numberOfLabelsOnYAxis !== 10) {
      throw new TypeError('numberOfLabelsOnYAxis must be a number, 10')
    }
    if (!(fontSettings instanceof FontSettings)) {
      throw new TypeError('fontSettings must be an instance of FontSettings')
    }
    if (!(colorSettings instanceof ColorSettings)) {
      throw new TypeError('colorSettings must be an instance of ColorSettings')
    }
    if (typeof ctx !== 'object') {
      throw new TypeError('ctx must be an object')
    }
    if (!(axisTitles instanceof AxisTitles)) {
      throw new TypeError('axisTitles must be an instance of AxisTitles')
    }
  }

  /**
   * Verifies that the dataset is an array of valid numbers.
   * Throws an error if the dataset is invalid.
   * @param {Array} dataset - The dataset to verify.
   * @throws {Error} - Throws an error if the dataset is invalid.
   */
  verifyDatasetIntegrity (dataset) {
    if (!Array.isArray(dataset)) {
      throw new Error('GraphDrawer: The dataset is not an array.')
    }
    if (dataset.length < 2) {
      throw new Error('GraphDrawer: The dataset is too short. It must contain at least two numbers.')
    }
    for (let i = 0; i < dataset.length; i++) {
      if (typeof dataset[i] !== 'number' || isNaN(dataset[i])) {
        throw new Error('GraphDrawer: The dataset contains non-numbers.')
      }
    }
  }

  /**
   * Get the ctx object.
   * @readonly
   */
  get ctx () {
    return this.#ctx
  }

  /**
   * Get the canvas properties.
   * @readonly
   * @returns {CanvasProperties} - The properties of the canvas.
   */
  get canvasProperties () {
    return this.#canvasProperties
  }

  /**
   * Get the graph properties.
   * @readonly
   * @returns {GraphProperties} - The properties of the graph.
   */
  get graphProperties () {
    return this.#graphProperties
  }

  /**
   * Get the dataset.
   * @readonly
   * @returns {Array} - The dataset to draw.
   */
  get dataset () {
    return this.#dataset
  }

  /**
   * Get the maximum number of labels on the x-axis.
   * @readonly
   * @returns {number} - The maximum number of labels on the x-axis.
   */
  get maxNumberOfLabelsOnXAxis () {
    return this.#maxNumberOfLabelsOnXAxis
  }

  /**
   * Get the fixed number of labels on the y-axis.
   * @readonly
   * @returns {number} - The fixed number of labels on the y-axis.
   */
  get numberOfLabelsOnYAxis () {
    return this.#numberOfLabelsOnYAxis
  }

  /**
   * Get the font settings.
   * @readonly
   * @returns {FontSettings} - The font settings for the graph.
   */
  get fontSettings () {
    return this.#fontSettings
  }

  /**
   * Get the color settings.
   * @readonly
   * @returns {ColorSettings} - The color settings for the graph.
   */
  get colorSettings () {
    return this.#colorSettings
  }

  /**
   * Get the non-magic zero.
   * @readonly
   * @returns {number} - The non-magic zero.
   */
  get nonMagicZero () {
    return this.#nonMagicZero
  }

  /**
   * Get the titles of the axes.
   * @readonly
   * @returns {AxisTitles} - The titles of the axes.
   */
  get axisTitles () {
    return this.#axisTitles
  }
}