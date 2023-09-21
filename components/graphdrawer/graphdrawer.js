/**
 * GraphDrawer is a Custom Web Element that renders a graph of a number dataset on a canvas.
 *
 * @author Jimmy Karlsson <jk224jv@student.lnu.se>
 *
 * @ all users:
 * @see Please see the readme file for usage.
 *
 * @ developer: I use destructuring assignment in this file. It's a newer and uncommon feature of JavaScript so here is the doc for it
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
 *
 */
import { CanvasProperties } from './classes/CanvasProperties.js'
import { GraphProperties } from './classes/GraphProperties.js'
import { FontSettings } from './classes/FontSettings.js'
import { ColorSettings } from './classes/ColorSettings.js'
import { AxisTitles } from './classes/AxisTitles.js'
import { GraphAndCanvasData } from './classes/GraphAndCanvasData.js'


const template = document.createElement('template')
// Warning: To ensure that the calculations are correct any resizing of the canvas must be done by setting the width and height of the container element or unexpected results can occur.
template.innerHTML = `
  <style>
    #container {
      width: 100%; /* Use these to set the size. */
      height: 100%; /* Use these to set the size. */
    }
    #canvas {
      width: 100%; /* DO NOT USE these to set the size. */
      height: 100%; /* DO NOT USE these to set the size. */
    }
  </style>
<div id="container">
  <canvas id="canvas"></canvas>
</div>
`

export default customElements.define('jk224jv-graphdrawer',
  class jk224jvGraphdrawer extends HTMLElement {
  #numberOfStepsOnYAxis
  #maxNumberOfStepsOnXAxis
  #fontSettings
  #colorSettings
  #axisTitles

  constructor () {
    super()
    // Warning: Changing this value will may cause unexpected results, you may have to rewrite the entire graph rendering algorithm if you want to change this value.
    const ten = 10
    this.#numberOfStepsOnYAxis = ten

    this.#maxNumberOfStepsOnXAxis = 20 // < 0 and > 50 will cause errors.

    this.#fontSettings = new FontSettings('Arial', 12, 16) // {fontFamily, labelFontSize, titleFontSize}

    const graphLineColor = 'black'
    const graphDotColor = 'black'
    const zeroLineColor = 'gray'
    const axisColor = 'black'
    const labelColor = 'black'
    const titleColor = 'black'
    this.#colorSettings = new ColorSettings(graphLineColor, graphDotColor, zeroLineColor, axisColor, labelColor, titleColor)

    this.#axisTitles = new AxisTitles('Index', 'Values')

    this.attachShadow({ mode: 'open' })
    .appendChild(template.content.cloneNode(true))
  }

  static get observedAttributes () {}

  attributeChangedCallback (name, oldValue, newValue) {}

  connectedCallback () {
  }

  disconnectedCallback () {
  }

  /**
   * Takes a dataset of numbers and renders a graph of it on the canvas.
   *
   * @param {Array} dataset - The dataset to render.
   */
  renderArrayAsGraph (dataset) {
    this.verifyDatasetIntegrity(dataset)

    const canvas = this.shadowRoot.querySelector('#canvas')
    const ctx = canvas.getContext('2d')

    const canvasProperties = new CanvasProperties(canvas)

    // Set the rending resolution to the display resolution.
    canvas.width = canvasProperties.width
    canvas.height = canvasProperties.height
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const graphProperties = new GraphProperties(dataset)

    // Any changes to the attributes after this point will not affect the current graph rendering.
    const graphAndCanvasData = new GraphAndCanvasData(canvasProperties, graphProperties, dataset, this.#maxNumberOfStepsOnXAxis, this.#numberOfStepsOnYAxis, this.#fontSettings, this.#colorSettings, ctx, this.#axisTitles)

    this.#clearCanvas(graphAndCanvasData)

    this.#drawZeroLineIfInRange(graphAndCanvasData)
    this.#drawXAxisWithLabelsAndTitle(graphAndCanvasData)
    this.#drawYAxisWithLabelsAndTitle(graphAndCanvasData)
    this.#drawGraphLines(graphAndCanvasData)
    this.#drawDataPoints(graphAndCanvasData)
  }

  #drawGraphLines (graphAndCanvasData) {
    const { canvasProperties, graphProperties, dataset, ctx } = graphAndCanvasData

    ctx.moveTo(canvasProperties.marginWidth, canvasProperties.marginHeight + canvasProperties.renderAreaHeight)
    ctx.beginPath()
    ctx.strokeStyle = graphAndCanvasData.colorSettings.graphLineColor
    const numberOfLabelsOnYAxis = graphAndCanvasData.numberOfLabelsOnYAxis
    for (let index = 0; index < dataset.length; index++) {
      // TODO: This needs to be refactored and frankly rewritten, should be a point generator instead.
      const pixelToIndexRatio = canvasProperties.renderAreaWidth / (dataset.length - 1)
      const x = canvasProperties.marginWidth + index * pixelToIndexRatio

      const pixelToValueStepSize = canvasProperties.renderAreaHeight / numberOfLabelsOnYAxis
      const calculatedValueSteps = (dataset[index] - graphProperties.min) / Math.ceil(graphProperties.range / numberOfLabelsOnYAxis)
      const bottomOfGraph = canvasProperties.marginHeight + canvasProperties.renderAreaHeight
      const y = bottomOfGraph - (calculatedValueSteps * (pixelToValueStepSize))
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  #drawDataPoints (graphAndCanvasData) {
    const { canvasProperties, graphProperties, dataset, ctx } = graphAndCanvasData

    const datasetLength = dataset.length
    const numberOfLabelsOnYAxis = graphAndCanvasData.numberOfLabelsOnYAxis
    for (let i = 0; i < datasetLength; i++) {
      const x = canvasProperties.marginWidth + i * canvasProperties.renderAreaWidth / (datasetLength - 1)
      const y = canvasProperties.marginHeight + canvasProperties.renderAreaHeight - (dataset[i] - graphProperties.min) / Math.ceil(graphProperties.range / numberOfLabelsOnYAxis) * (canvasProperties.renderAreaHeight / numberOfLabelsOnYAxis)
      const dotRadius = 3
      const startAngle = 0
      const stopAngle = 2 * Math.PI // A full circle.
      ctx.beginPath()
      ctx.arc(x, y, dotRadius, startAngle, stopAngle)
      ctx.fillStyle = graphAndCanvasData.colorSettings.graphDotColor
      ctx.fill()
    }
  }

  #drawYAxisWithLabelsAndTitle (graphAndCanvasData) {
    // Extract the desired objects from the graphAndCanvasData master-object.
    const { canvasProperties, graphProperties, colorSettings, fontSettings, ctx, axisTitles } = graphAndCanvasData

    // Draw the y-axis.
    this.#drawYAxis(graphAndCanvasData)

    // Draw the y-axis labels.
    this.#drawYAxisLabels(graphAndCanvasData)

    // Draw the y-axis title.
    this.#drawYAxisTitle(graphAndCanvasData)
  }


  #drawYAxis (graphAndCanvasData) {
    const { canvasProperties, colorSettings, ctx } = graphAndCanvasData

    ctx.beginPath()
    ctx.strokeStyle = colorSettings.axisColor
    ctx.moveTo(canvasProperties.marginWidth, canvasProperties.marginHeight)
    ctx.lineTo(canvasProperties.marginWidth, canvasProperties.marginHeight + canvasProperties.renderAreaHeight)
    ctx.stroke()
  }

  #drawYAxisLabels (graphAndCanvasData) {
    const { canvasProperties, graphProperties, colorSettings, fontSettings, ctx } = graphAndCanvasData

    ctx.font = fontSettings.label
    ctx.fillStyle = colorSettings.labelColor
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    const axisToLabelMargin = 5
    const totalNrOfLabels = graphAndCanvasData.numberOfLabelsOnYAxis
    for (let labelNumber = 0; labelNumber <= totalNrOfLabels; labelNumber++) {
      const x = canvasProperties.marginWidth - axisToLabelMargin
      const bottomOfGraph = canvasProperties.marginHeight + canvasProperties.renderAreaHeight
      const y = bottomOfGraph - labelNumber / totalNrOfLabels * canvasProperties.renderAreaHeight
      const rangeToHeightRatio = Math.ceil(graphProperties.range / totalNrOfLabels)
      ctx.fillText(graphProperties.min + (labelNumber * rangeToHeightRatio), x, y)
    }
  }

  #drawYAxisTitle (graphAndCanvasData) {
    // Extract the desired objects from the graphAndCanvasData master-object.
    const { canvasProperties, colorSettings, fontSettings, ctx, axisTitles } = graphAndCanvasData

    const titleFontSize = parseInt(fontSettings.title, 10)

    ctx.save()
    // Translate the canvas to the y-axis title position.
    ctx.translate(canvasProperties.marginWidth - titleFontSize * 3, canvasProperties.marginHeight + canvasProperties.renderAreaHeight / 2)
    ctx.rotate(-Math.PI / 2) // Rotate the canvas 90 degrees counter clockwise.
    ctx.font = fontSettings.title
    ctx.fillStyle = colorSettings.titleColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    ctx.fillText(axisTitles.yAxis, 0, 0)
    ctx.restore()
  }

  #drawXAxisWithLabelsAndTitle (graphAndCanvasData) {
    // Extract the desired objects from the graphAndCanvasData master-object.
    const { canvasProperties, graphProperties, dataset, colorSettings, fontSettings, ctx, axisTitles } = graphAndCanvasData
    // Draw the x-axis.
    this.#drawXAxis(graphAndCanvasData)

    // Draw the x-axis labels.
    this.#drawXAxisLabels(graphAndCanvasData)

    // Draw the x-axis title.
    this.#drawXAxisTitle(graphAndCanvasData)
  }

  #drawXAxis (graphAndCanvasData) {
    // Extract the desired objects from the graphAndCanvasData master-object.
    const { canvasProperties, colorSettings, ctx } = graphAndCanvasData
    ctx.beginPath()
    ctx.strokeStyle = colorSettings.axisColor
    ctx.moveTo(canvasProperties.marginWidth, canvasProperties.marginHeight + canvasProperties.renderAreaHeight)
    ctx.lineTo(canvasProperties.marginWidth + canvasProperties.renderAreaWidth, canvasProperties.marginHeight + canvasProperties.renderAreaHeight)
    ctx.stroke()
  }

  #drawXAxisLabels (graphAndCanvasData) {
    const { canvasProperties, dataset, colorSettings, fontSettings, ctx } = graphAndCanvasData

    ctx.font = fontSettings.label
    ctx.fillStyle = colorSettings.labelColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    const numberOfLabelsToDraw = this.#calculateLabelCount(graphAndCanvasData)
    const pixelsBetweenLabels = Math.ceil(canvasProperties.renderAreaWidth / numberOfLabelsToDraw)
    const indexStepsPerLabel = Math.max(Math.floor(dataset.length / numberOfLabelsToDraw), 1)
    const labelFontSize = parseInt(fontSettings.label, 10)
    for (let labelNumber = 0; labelNumber <= numberOfLabelsToDraw; labelNumber++) {
      const x = canvasProperties.marginWidth + labelNumber * pixelsBetweenLabels
      const y = canvasProperties.marginHeight + canvasProperties.renderAreaHeight + Math.ceil(labelFontSize / 2)

      const label = (labelNumber * indexStepsPerLabel).toString()
      // Only draw the label if it fits. This is done to avoid overlapping labels in case the canvas is too small, generally this should not be a problem but prime number lengths cause this.
      if (ctx.measureText(1).width > pixelsBetweenLabels) {
        continue
      }
      for (let character = 0; character < label.length; character++) {
        ctx.fillText(label[character], x, y + character * labelFontSize)
      }
    }
  }


  #drawXAxisTitle (graphAndCanvasData) {
    const { canvasProperties, colorSettings, fontSettings, ctx, axisTitles } = graphAndCanvasData
    const titleFontSize = parseInt(fontSettings.title, 10)

    ctx.save()
    ctx.translate(canvasProperties.marginWidth + ctx.measureText(axisTitles.xAxis).width / 2, canvasProperties.marginHeight + canvasProperties.renderAreaHeight + titleFontSize * 3)
    ctx.font = fontSettings.title
    ctx.fillStyle = colorSettings.titleColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    ctx.fillText(axisTitles.xAxis, 0, 0)
    ctx.restore()
  }

  /**
   * There is currently a bug that makes this function unable to handle prime number lengths.
   * Since no even division can be made rounding would have to be used causing the labels to not align with the data points.
   * The workaround is to draw all labels in this case,
   * #drawXAxisLabels method have code that prevents labels from overlapping.
   */
  #calculateLabelCount (graphAndCanvasData) {
    // Extract the desired objects from the graphAndCanvasData master-object.
    const { canvasProperties, graphProperties, dataset, ctx } = graphAndCanvasData
    let numberOfLabelsToDraw = Math.min(dataset.length, graphAndCanvasData.maxNumberOfLabelsOnXAxis)

    // reduce the number of labels to draw until the dataset length is divisible by the number of labels to draw.
    while (dataset.length % numberOfLabelsToDraw !== 0) {
      numberOfLabelsToDraw--
    }
    if (numberOfLabelsToDraw === 1) {
      // prime number, draw all labels. There is no way to get these labels to align nicely.
      numberOfLabelsToDraw = dataset.length
    }

    return numberOfLabelsToDraw
  }

  #drawZeroLineIfInRange (graphAndCanvasData) {
    const { canvasProperties, graphProperties, colorSettings, ctx } = graphAndCanvasData
    const mathematicalZero = 0
    if (graphProperties.min < graphAndCanvasData.nonMagicZero && graphProperties.max > mathematicalZero) {
      ctx.beginPath()
      ctx.strokeStyle = colorSettings.zeroLineColor
      const heightStep = Math.ceil(graphProperties.range / graphAndCanvasData.numberOfLabelsOnYAxis)
      const yCoordinate = canvasProperties.marginHeight + canvasProperties.renderAreaHeight - (mathematicalZero - graphProperties.min) / heightStep * (canvasProperties.renderAreaHeight / graphAndCanvasData.numberOfLabelsOnYAxis)
      ctx.moveTo(
        canvasProperties.marginWidth, yCoordinate
      )
      ctx.lineTo(
        canvasProperties.marginWidth + canvasProperties.renderAreaWidth, yCoordinate
      )
      ctx.stroke()
    }
  }

  #clearCanvas (graphAndCanvasData) {
    const { ctx, canvasProperties } = graphAndCanvasData
    const origoX = 0
    const origoY = 0

    // clear the canvas.
    ctx.clearRect(origoX, origoY, canvasProperties.width, canvasProperties.height)
  }

  /**
   * Verify the the dataset is an array of numbers.
   * Throws an error if the dataset is invalid.
   *
   * @param {Array} dataset - The dataset to verify.
   * @throws {TypeError} - If the dataset is not an array of numbers.
   */
  verifyDatasetIntegrity (dataset) {
    if (dataset === undefined || dataset === null) {
      throw new TypeError('dataset must not be undefined or null')
    }

    if (!Array.isArray(dataset)) {
      throw new TypeError('dataset must be an array')
    }

    if (dataset.length === 0) {
      throw new Error('dataset must not be empty')
    }

    for (const value of dataset) {
      if (value === undefined || value === null || typeof value !== 'number' || isNaN(value)) {
        throw new TypeError('dataset must only contain numbers')
      }
    }
  }

  /**
   * Get the number of steps on the y-axis.
   *
   * @readonly
   * @returns {number} The number of steps on the y-axis.
   */
  get numberOfStepsOnYAxis () {
    return this.#numberOfStepsOnYAxis
  }

  /**
   * Get the maximum number of steps on the x-axis.
   *
   * @readonly
   * @returns {number} The maximum number of steps on the x-axis.
   */
  get maxNumberOfStepsOnXAxis () {
    return this.#maxNumberOfStepsOnXAxis
  }

  /**
   * Get the font settings of the graph.
   *
   * @readonly
   * @returns {FontSettings} The font settings of the graph.
   */
  get fontSettings () {
    // Return a copy of the font settings.
    return new FontSettings(
      this.#fontSettings.label.split(' ')[1],
      parseInt(this.#fontSettings.label),
      parseInt(this.#fontSettings.title)
      )
  }

  /**
   * Get the color settings of the graph.
   *
   * @readonly
   * @returns {ColorSettings} The color settings of the graph.
   */
  get colorSettings () {
    // Return a copy of the color settings.
    return new ColorSettings(this.#colorSettings.graphLineColor, this.#colorSettings.graphDotColor, this.#colorSettings.zeroLineColor, this.#colorSettings.axisColor, this.#colorSettings.labelColor, this.#colorSettings.titleColor)
  }

  /**
   * Get the axis titles of the graph.
   *
   * @readonly
   * @returns {AxisTitles} The axis titles of the graph.
   */
  get axisTitles () {
    return new AxisTitles(this.#axisTitles.xAxis, this.#axisTitles.yAxis)
  }

  /**
   * Set the colors used to render the graph, the zero line, the axis, the labels and the titles.
   * The colors are set by passing an array of 0-6 colors objects.
   * Order of the objects does not matter.
   * Property names: graphLineColor, graphDotColor, zeroLineColor, axisColor, labelColor, titleColor.
   * Valid colors: 'red', 'green', 'lime', 'blue', 'yellow', 'orange', 'purple', 'black', 'gray', 'white'.
   *
   * @param {Array} colorSettings - example: [{graphLineColor: 'purple'}]
   * @throws {TypeError} - If the colorSettings is not an array of valid objects.
   * @see README.MD file for more extensive examples.
   */
  setColors (colorSettings) {
    let requestedGraphLineColor = null
    let requestedGraphDotColor = null
    let requestedZeroLineColor = null
    let requestedAxisColor = null
    let requestedLabelColor = null
    let requestedTitleColor = null

    const validColorStrings = ['red', 'green', 'lime', 'blue', 'yellow', 'orange', 'purple', 'black', 'gray', 'white']
    const validColorProperties = ['graphLineColor', 'graphDotColor', 'zeroLineColor', 'axisColor', 'labelColor', 'titleColor']

    if(colorSettings === undefined || colorSettings === null || !Array.isArray(colorSettings) || colorSettings.length === 0) {
      throw new TypeError('colorSettings must be an array of objects')
    }

    for (const unverifiedObject of colorSettings) {
      if (unverifiedObject === null || unverifiedObject === undefined || typeof unverifiedObject !== 'object') {
        throw new TypeError('colorSettings must be an array of objects, but contains: ' + typeof object)
      }
      if (Object.keys(unverifiedObject).length !== 1) {
        throw new TypeError('colorSettings must be an array of objects with only one property, but contains: ' + Object.keys(unverifiedObject).length + ' properties')
      }
      if (!validColorProperties.includes(Object.keys(unverifiedObject)[0])) {
        throw new TypeError('colorSettings must be an array of objects with one of the following properties each: ' + validColorProperties.join(', ') + ' but contains: ' + Object.keys(unverifiedObject)[0])
      }

      if (!validColorStrings.includes(Object.values(unverifiedObject)[0])) {
        throw new TypeError('colorSettings must be an array of objects with one of the following colors: ' + validColorStrings.join(', ') + ' but contains: ' + Object.values(unverifiedObject)[0])
      }
    }

    for (const colorSetting of colorSettings) {
      if (colorSetting.graphLineColor !== undefined) {
        requestedGraphLineColor = colorSetting.graphLineColor
      }
      if (colorSetting.graphDotColor !== undefined) {
        requestedGraphDotColor = colorSetting.graphDotColor
      }
      if (colorSetting.zeroLineColor !== undefined) {
        requestedZeroLineColor = colorSetting.zeroLineColor
      }
      if (colorSetting.axisColor !== undefined) {
        requestedAxisColor = colorSetting.axisColor
      }
      if (colorSetting.labelColor !== undefined) {
        requestedLabelColor = colorSetting.labelColor
      }
      if (colorSetting.titleColor !== undefined) {
        requestedTitleColor = colorSetting.titleColor
      }
    }
    const currentColorSettings = this.colorSettings
    /**
     * @ developer: Uses the relatively new nullish coalescing operator to set the color settings.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
     * constructor (graphLineColor, graphDotColor, zeroLineColor, axisColor, labelColor, titleColor)
     */
    this.#colorSettings = new ColorSettings(
      requestedGraphLineColor ?? currentColorSettings.graphLineColor,
      requestedGraphDotColor ?? currentColorSettings.graphDotColor,
      requestedZeroLineColor ?? currentColorSettings.zeroLineColor,
      requestedAxisColor ?? currentColorSettings.axisColor,
      requestedLabelColor ?? currentColorSettings.labelColor,
      requestedTitleColor ?? currentColorSettings.titleColor
    )
  }

  /**
   * Set the axis titles of the graph.
   * The titles are set by passing an object with the properties xAxis and yAxis.
   * Valid values: Any string.
   * Order of the properties does not matter.
   *
   * @param {Object} axisTitles - example: {xAxis: 'Index', yAxis: 'Values'}
   */
  setAxisTitles (axisTitles) {
    const currentAxisTitles = this.axisTitles
    const validProperties = ['xAxis', 'yAxis']

    if (axisTitles === undefined
      || axisTitles === null
      || typeof axisTitles !== 'object'
      || Array.isArray(axisTitles)
    ) {
      throw new TypeError('axisTitles must be an object, but is: ' + typeof axisTitles)
    }

    if (Object.keys(axisTitles).length > 2) {
      throw new TypeError('axisTitles may have up to two properties, but contains: ' + Object.keys(axisTitles).length + ' properties')
    }

    if(Object.keys(axisTitles).length === 0) {
      throw new TypeError('axisTitles must have at least one property to set, object is empty')
    }

    for (const property of Object.keys(axisTitles)) {
      if (!validProperties.includes(property)) {
        throw new TypeError('axisTitles must be an object with one-two of the following properties: ' + validProperties.join(', ') + ' but contains: ' + property)
      }
    }

    if (axisTitles.xAxis === undefined && axisTitles.yAxis === undefined) {
      throw new TypeError('axisTitles must have at least one property to set, both properties are undefined')
    }

    if (axisTitles.xAxis !== undefined
      && (axisTitles.xAxis === undefined
        || axisTitles.xAxis === null
        || typeof axisTitles.xAxis !== 'string'
        || Array.isArray(axisTitles.xAxis)
      )
    ) {
      throw new TypeError('xAxis value must be a string, but is: ' + typeof axisTitles.xAxis)
    }

    if ('xAxis' in axisTitles
      && (axisTitles.xAxis === undefined
        || axisTitles.xAxis === null
        || typeof axisTitles.xAxis !== 'string'
        || Array.isArray(axisTitles.xAxis)
      )
    ) {
      throw new TypeError('yAxis value must be a string, but is: ' + typeof axisTitles.yAxis)
    }

    if('yAxis' in axisTitles
      && (axisTitles.yAxis === undefined
        || axisTitles.yAxis === null
        || typeof axisTitles.yAxis !== 'string'
        || Array.isArray(axisTitles.yAxis)
      )
    ) {
      throw new TypeError('yAxis value must be a string, but is: ' + typeof axisTitles.yAxis)
    }

    /**
     * @ developer: Uses the relatively new nullish coalescing operator to set the axis titles.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
     */
    this.#axisTitles = new AxisTitles(
      axisTitles.xAxis ?? currentAxisTitles.xAxis,
      axisTitles.yAxis ?? currentAxisTitles.yAxis
    )
  }
})
