/**
 * GraphDrawer is a Custom Web Element that renders a graph of a number dataset on a canvas.
 *
 * @author Jimmy Karlsson <jk224jv@student.lnu.se>
 *
 * @ all users:
 * @see Please see the readme file for usage. The public interface is starts below the constructor.
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

    constructor() {
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
      const backgroundColor = 'white'
      this.#colorSettings = new ColorSettings(graphLineColor, graphDotColor, zeroLineColor, axisColor, labelColor, titleColor, backgroundColor)

      this.#axisTitles = new AxisTitles('Index', 'Values')

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
    }

    static get observedAttributes() { }

    attributeChangedCallback(name, oldValue, newValue) { }

    connectedCallback() {
    }

    disconnectedCallback() {
    }

    /******************************************************************************************************************************
     * PUBLIC INTERFACE
     ******************************************************************************************************************************/

    /**
     * Clear the canvas.
     */
    clear() {
      const canvas = this.shadowRoot.querySelector('#canvas')
      const ctx = canvas.getContext('2d')
      const origoX = 0
      const origoY = 0
      ctx.clearRect(origoX, origoY, canvas.width, canvas.height)
    }

    /**
     * Takes a dataset of numbers and renders a graph of it on the canvas.
     *
     * @param {Array} dataset - The dataset to render.
     */
    renderArrayAsGraph(dataset) {
      this.verifyDatasetIntegrity(dataset)

      const canvas = this.shadowRoot.querySelector('#canvas')
      const ctx = canvas.getContext('2d')

      const canvasProperties = new CanvasProperties(canvas)
      const devicePixelRatio = window.devicePixelRatio || 1

      // Set the rending resolution to the display resolution.
      canvas.width = canvasProperties.width * devicePixelRatio
      canvas.height = canvasProperties.height * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)

      const graphProperties = new GraphProperties(dataset)

      // Any changes to the attributes after this point will not affect the current graph rendering.
      const graphAndCanvasData = new GraphAndCanvasData(canvasProperties, graphProperties, dataset, this.#maxNumberOfStepsOnXAxis, this.#numberOfStepsOnYAxis, this.#fontSettings, this.#colorSettings, ctx, this.#axisTitles)

      this.#drawBackground(graphAndCanvasData)
      this.#drawZeroLineIfInRange(graphAndCanvasData)
      this.#drawXAxisWithLabelsAndTitle(graphAndCanvasData)
      this.#drawYAxisWithLabelsAndTitle(graphAndCanvasData)
      this.#drawGraphLines(graphAndCanvasData)
      this.#drawDataPoints(graphAndCanvasData)
    }

    /**
     * Verify the the dataset is an array of numbers.
     * Throws an error if the dataset is invalid.
     *
     * @param {Array} dataset - The dataset to verify.
     * @throws {TypeError} - If the dataset is not an array of numbers.
     */
    verifyDatasetIntegrity(dataset) {
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

    /******************************************************************************************************************************
     * SETTERS
     ******************************************************************************************************************************/

    /**
     * Set the axis titles of the graph.
     * The titles are set by passing an object with the properties xAxis and yAxis.
     * Valid values: Any string.
     * Order of the properties does not matter.
     *
     * @param {Object} axisTitles - example: {xAxis: 'Index', yAxis: 'Values'}
     */
    setAxisTitles(axisTitles) {
      this.#validateAxisTitles(axisTitles)
      const currentAxisTitles = this.axisTitles

      /**
       * @ developer: Uses the relatively new nullish coalescing operator to set the axis titles.
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
       */
      this.#axisTitles = new AxisTitles(
        axisTitles.xAxis ?? currentAxisTitles.xAxis,
        axisTitles.yAxis ?? currentAxisTitles.yAxis
      )
    }

    /**
     * Set the colors used to render the graph, the zero line, the axis, the labels and the titles.
     * The colors are set by passing an array of 0-6 colors objects.
     * Order of the objects does not matter.
     * Property names: graphLineColor, graphDotColor, zeroLineColor, axisColor, labelColor, titleColor, backgroundColor.
     * Valid colors: 'red', 'green', 'lime', 'blue', 'yellow', 'orange', 'purple', 'black', 'gray', 'white'.
     *
     * @param {Array} colorSettings - example: [{graphLineColor: 'purple'}]
     * @throws {TypeError} - If the colorSettings is not an array of valid objects.
     * @see README.MD file for more extensive examples.
     */
    setColors(colorSettings) {
      this.#validateColorSettings(colorSettings)
      let requestedGraphLineColor = null
      let requestedGraphDotColor = null
      let requestedZeroLineColor = null
      let requestedAxisColor = null
      let requestedLabelColor = null
      let requestedTitleColor = null
      let requestedBackgroundColor = null

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
        if (colorSetting.backgroundColor !== undefined) {
          requestedBackgroundColor = colorSetting.backgroundColor
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
        requestedTitleColor ?? currentColorSettings.titleColor,
        requestedBackgroundColor ?? currentColorSettings.backgroundColor

      )
    }

    /**
     * Set the font settings of the graph.
     * The font settings are set by passing an object with the properties fontFamily, labelFontSize and titleFontSize.
     *
     * @param {Object} fontSettings - example: {fontFamily: 'Arial', labelFontSize: 12, titleFontSize: 16}
     * @throws {TypeError} - If the fontSettings is not a valid objekt.
     */
    setFontSettings(fontSettings) {
      this.#validateFontSettings(fontSettings)
      this.#fontSettings = new FontSettings(fontSettings.fontFamily, fontSettings.labelFontSize, fontSettings.titleFontSize)
    }

    /**
     * Set the size of the component.
     *
     * @param {Object} size - example: {width: '100%', height: '250px'}
     */
    setSize(size) {
      this.#validateSizeObject(size)
      const container = this.shadowRoot.querySelector('#container')
      container.style.width = size.width
      container.style.height = size.height
    }

    /******************************************************************************************************************************
     * GETTERS
     ******************************************************************************************************************************/

    /**
     * Get the axis titles of the graph.
     *
     * @readonly
     * @returns {AxisTitles} The axis titles of the graph.
     */
    get axisTitles() {
      return new AxisTitles(this.#axisTitles.xAxis, this.#axisTitles.yAxis)
    }

    /**
     * Get the color settings of the graph.
     *
     * @readonly
     * @returns {ColorSettings} The color settings of the graph.
     */
    get colorSettings() {
      // Return a copy of the color settings.
      return new ColorSettings(this.#colorSettings.graphLineColor, this.#colorSettings.graphDotColor, this.#colorSettings.zeroLineColor, this.#colorSettings.axisColor, this.#colorSettings.labelColor, this.#colorSettings.titleColor, this.#colorSettings.backgroundColor)
    }

    /**
     * Get the font settings of the graph.
     *
     * @readonly
     * @returns {FontSettings} The font settings of the graph.
     */
    get fontSettings() {
      // Return a copy of the font settings.
      return new FontSettings(
        this.#fontSettings.label.split(' ')[1],
        parseInt(this.#fontSettings.label),
        parseInt(this.#fontSettings.title)
      )
    }

    /**
     * Get the number of steps on the y-axis.
     *
     * @readonly
     * @returns {number} The number of steps on the y-axis.
     */
    get numberOfStepsOnYAxis() {
      return this.#numberOfStepsOnYAxis
    }

    /**
     * Get the maximum number of steps on the x-axis.
     *
     * @readonly
     * @returns {number} The maximum number of steps on the x-axis.
     */
    get maxNumberOfStepsOnXAxis() {
      return this.#maxNumberOfStepsOnXAxis
    }

    /******************************************************************************************************************************
     * END OF PUBLIC INTERFACE
     * @ developer - The rest of the methods are private and should not be used by the user.
     */

    #validateAxisTitles(axisTitles) {
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

      if (Object.keys(axisTitles).length === 0) {
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

      if ('yAxis' in axisTitles
        && (axisTitles.yAxis === undefined
          || axisTitles.yAxis === null
          || typeof axisTitles.yAxis !== 'string'
          || Array.isArray(axisTitles.yAxis)
        )
      ) {
        throw new TypeError('yAxis value must be a string, but is: ' + typeof axisTitles.yAxis)
      }
    }

    #validateColorSettings(colorSettings) {
      const validColorStrings = ['red', 'green', 'lime', 'blue', 'yellow', 'orange', 'purple', 'black', 'gray', 'white']
      const validColorProperties = ['graphLineColor', 'graphDotColor', 'zeroLineColor', 'axisColor', 'labelColor', 'titleColor', 'backgroundColor']

      if (colorSettings === undefined || colorSettings === null || !Array.isArray(colorSettings) || colorSettings.length === 0) {
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
    }

    #validateFontSettings(fontSettings) {
      const validProperties = ['fontFamily', 'labelFontSize', 'titleFontSize']
      if (fontSettings === undefined || fontSettings === null || typeof fontSettings !== 'object' || Array.isArray(fontSettings)) {
        throw new TypeError('fontSettings must be an object, but is: ' + typeof fontSettings)
      }

      if (Object.keys(fontSettings).length > 3) {
        throw new TypeError('fontSettings may have up to three properties, but contains: ' + Object.keys(fontSettings).length + ' properties')
      }

      if (Object.keys(fontSettings).length === 0) {
        throw new TypeError('fontSettings must have at least one property to set, object is empty')
      }

      for (const property of Object.keys(fontSettings)) {
        if (!validProperties.includes(property)) {
          throw new TypeError('fontSettings must be an object with all of the following properties: ' + validProperties.join(', ') + ' but contains: ' + property)
        }
      }

      if (fontSettings.fontFamily === undefined
        || fontSettings.fontFamily === null
        || typeof fontSettings.fontFamily !== 'string'
        || Array.isArray(fontSettings.fontFamily)
      ) {
        throw new TypeError('fontFamily value must be a string, but is: ' + typeof fontSettings.fontFamily)
      }

      if (fontSettings.labelFontSize === undefined
        || fontSettings.labelFontSize === null
        || typeof fontSettings.labelFontSize !== 'number'
        || Array.isArray(fontSettings.labelFontSize)
        || isNaN(fontSettings.labelFontSize)
      ) {
        if (isNaN(fontSettings.labelFontSize)) {
          throw new TypeError('labelFontSize value must be a number, but is: NaN')
        } else {
          throw new TypeError('labelFontSize value must be a number, but is: ' + typeof fontSettings.labelFontSize)
        }
      }

      if (fontSettings.titleFontSize === undefined
        || fontSettings.titleFontSize === null
        || typeof fontSettings.titleFontSize !== 'number'
        || Array.isArray(fontSettings.titleFontSize)
        || isNaN(fontSettings.titleFontSize)
      ) {
        if (isNaN(fontSettings.titleFontSize)) {
          throw new TypeError('titleFontSize value must be a number, but is: NaN')
        } else {
          throw new TypeError('titleFontSize value must be a number, but is: ' + typeof fontSettings.titleFontSize)
        }
      }

      if (fontSettings.labelFontSize < 0) {
        throw new TypeError('labelFontSize value must be a positive number, but is: ' + fontSettings.labelFontSize)
      }

      if (fontSettings.titleFontSize < 0) {
        throw new TypeError('titleFontSize value must be a positive number, but is: ' + fontSettings.titleFontSize)
      }

      if (fontSettings.fontFamily === '') {
        throw new TypeError('fontFamily value must not be empty')
      }
    }

    #validateSizeObject(size) {
      if (size === undefined || size === null || typeof size !== 'object' || Array.isArray(size)) {
        throw new TypeError('size must be an object, but is: ' + typeof size)
      }

      if (Object.keys(size).length !== 2) {
        throw new TypeError('size may have two properties, but contains: ' + Object.keys(size).length + ' properties')
      }

      if (size.width === undefined || size.height === undefined) {
        throw new TypeError('size must width and height properties')
      }

      if ('width' in size
        && (size.width === undefined
          || size.width === null
          || typeof size.width !== 'string'
          || Array.isArray(size.width)
        )
      ) {
        throw new TypeError('width value must be a string, but is: ' + typeof size.width)
      }

      if ('height' in size
        && (size.height === undefined
          || size.height === null
          || typeof size.height !== 'string'
          || Array.isArray(size.height)
        )
      ) {
        throw new TypeError('height value must be a string, but is: ' + typeof size.height)
      }

      if (size.width === '') {
        throw new TypeError('width value must not be empty')
      }

      if (size.height === '') {
        throw new TypeError('height value must not be empty')
      }

      if (!size.width.endsWith('%') && !size.width.endsWith('px')) {
        throw new TypeError('width value must end in % or px')
      }

      if (!size.height.endsWith('%') && !size.height.endsWith('px')) {
        throw new TypeError('height value must end in % or px')
      }
    }

    #drawBackground(graphAndCanvasData) {
      const { canvasProperties, colorSettings, ctx } = graphAndCanvasData
      ctx.fillStyle = colorSettings.backgroundColor
      ctx.globalCompositeOperation = 'destination-under'
      ctx.fillRect(0, 0, canvasProperties.width, canvasProperties.height)
      ctx.globalCompositeOperation = 'source-over'
    }

    #drawGraphLines(graphAndCanvasData) {
      const { canvasProperties, dataset, ctx } = graphAndCanvasData
      ctx.moveTo(canvasProperties.marginWidth, canvasProperties.marginHeight + canvasProperties.renderAreaHeight)
      ctx.beginPath()
      ctx.strokeStyle = graphAndCanvasData.colorSettings.graphLineColor
      const pointGenerator = this.#pointGenerator(graphAndCanvasData)
      for (let index = 0; index < dataset.length; index++) {
        const point = pointGenerator.next().value
        ctx.lineTo(point.xCoordinate, point.yCoordinate)
      }
      ctx.stroke()
    }

    #drawDataPoints(graphAndCanvasData) {
      const { dataset, ctx } = graphAndCanvasData
      const pointGenerator = this.#pointGenerator(graphAndCanvasData)
      for (let i = 0; i < dataset.length; i++) {
        const point = pointGenerator.next().value
        const dotRadius = 3
        const startAngle = 0
        const stopAngle = 2 * Math.PI // A full circle.
        ctx.beginPath()
        ctx.arc(point.xCoordinate, point.yCoordinate, dotRadius, startAngle, stopAngle)
        ctx.fillStyle = graphAndCanvasData.colorSettings.graphDotColor
        ctx.fill()
      }
    }

    #drawDottedVerticalLine(graphAndCanvasData, xCoordinate) {
      const { canvasProperties, colorSettings, ctx } = graphAndCanvasData
      ctx.beginPath()
      ctx.strokeStyle = colorSettings.axisColor
      ctx.setLineDash([1, 5])
      ctx.moveTo(xCoordinate, canvasProperties.marginHeight + canvasProperties.renderAreaHeight)
      ctx.lineTo(xCoordinate, canvasProperties.marginHeight)
      ctx.stroke()
      ctx.setLineDash([])
    }


    #drawXAxisWithLabelsAndTitle(graphAndCanvasData) {
      this.#drawXAxis(graphAndCanvasData)
      this.#drawXAxisLabelsAndVerticalLine(graphAndCanvasData)
      this.#drawXAxisTitle(graphAndCanvasData)
    }

    #drawXAxis(graphAndCanvasData) {
      const { canvasProperties, colorSettings, ctx } = graphAndCanvasData
      ctx.beginPath()
      ctx.strokeStyle = colorSettings.axisColor
      ctx.moveTo(canvasProperties.marginWidth, canvasProperties.marginHeight + canvasProperties.renderAreaHeight)
      ctx.lineTo(canvasProperties.marginWidth + canvasProperties.renderAreaWidth, canvasProperties.marginHeight + canvasProperties.renderAreaHeight)
      ctx.stroke()
    }

    #drawXAxisLabelsAndVerticalLine(graphAndCanvasData) {
      const { canvasProperties, dataset, colorSettings, fontSettings, ctx } = graphAndCanvasData

      ctx.font = fontSettings.label
      ctx.fillStyle = colorSettings.labelColor
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      let numberOfLabelsToDraw = this.#calculateLabelCount(graphAndCanvasData)
      // calculate how many indexes to skip per label drawn.
      const indexStepsPerLabel = Math.max(Math.ceil(dataset.length / numberOfLabelsToDraw), 1)
      const labelFontSize = parseInt(fontSettings.label, 10)
      const pointGenerator = this.#pointGenerator(graphAndCanvasData)
      let point = pointGenerator.next().value
      let lastPoint
      let pointerOutOfBounds = false
      let labelNumber = 0
      do {
        const x = point.xCoordinate
        const y = canvasProperties.marginHeight + canvasProperties.renderAreaHeight + Math.ceil(labelFontSize / 2)
        this.#drawDottedVerticalLine(graphAndCanvasData, x)
        const label = ((labelNumber) * indexStepsPerLabel).toString()
        for (let character = 0; character < label.length; character++) {
          ctx.fillText(label[character], x, y + character * labelFontSize)
        }
        const result = this.#getNextLabelToDraw(pointGenerator, indexStepsPerLabel)
        point = result.point
        lastPoint = result.lastPoint ?? lastPoint
        pointerOutOfBounds = result.pointerOutOfBounds
        labelNumber++
      } while (labelNumber <= numberOfLabelsToDraw && !pointerOutOfBounds)
      if (pointerOutOfBounds) { // Make sure the last label is always drawn.
        const x = lastPoint.xCoordinate
        const y = canvasProperties.marginHeight + canvasProperties.renderAreaHeight + Math.ceil(labelFontSize / 2)
        this.#drawDottedVerticalLine(graphAndCanvasData, x)
        const label = (dataset.length - 1).toString()
        for (let character = 0; character < label.length; character++) {
          ctx.fillText(label[character], x, y + character * labelFontSize)
        }
      }
    }

    #getNextLabelToDraw(generator, indexStepsToTake) {
      let skipped = 0
      let point
      let lastPoint
      let pointerOutOfBounds = false
        while (skipped < indexStepsToTake && !pointerOutOfBounds) {
          point = generator.next().value
          // since we round up the indexStepsPerLabel we need to check if we have reached the end of the dataset.
          if (point === undefined) {
            pointerOutOfBounds = true
          } else {
            lastPoint = point
          }
          skipped++
        }
      return {point: point, lastPoint: lastPoint, pointerOutOfBounds: pointerOutOfBounds}
    }

    #drawXAxisTitle(graphAndCanvasData) {
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

    #drawYAxisWithLabelsAndTitle(graphAndCanvasData) {
      this.#drawYAxis(graphAndCanvasData)
      this.#drawYAxisLabels(graphAndCanvasData)
      this.#drawYAxisTitle(graphAndCanvasData)
    }

    #drawYAxis(graphAndCanvasData) {
      const { canvasProperties, colorSettings, ctx } = graphAndCanvasData

      ctx.beginPath()
      ctx.strokeStyle = colorSettings.axisColor
      ctx.moveTo(canvasProperties.marginWidth, canvasProperties.marginHeight)
      ctx.lineTo(canvasProperties.marginWidth, canvasProperties.marginHeight + canvasProperties.renderAreaHeight)
      ctx.stroke()
    }

    #drawYAxisLabels(graphAndCanvasData) {
      const { canvasProperties, graphProperties, dataset, colorSettings, fontSettings, ctx } = graphAndCanvasData

      ctx.font = fontSettings.label
      ctx.fillStyle = colorSettings.labelColor
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      const axisToLabelMargin = 5
      const totalNrOfLabels = graphAndCanvasData.numberOfLabelsOnYAxis
      let adjustedMin, adjustedRange
      // Check if the range is very small, in that case adjust the properties.
      if (graphProperties.range < 2) {
        adjustedMin = Math.floor(graphProperties.average) - 5
        adjustedRange = 10
      } else {
        adjustedMin = graphProperties.min
        adjustedRange = graphProperties.range
      }
      for (let labelNumber = 0; labelNumber <= totalNrOfLabels; labelNumber++) {
        const x = canvasProperties.marginWidth - axisToLabelMargin
        const bottomOfGraph = canvasProperties.marginHeight + canvasProperties.renderAreaHeight
        const y = bottomOfGraph - labelNumber / totalNrOfLabels * canvasProperties.renderAreaHeight
        const rangeToHeightRatio = Math.ceil((adjustedRange) / totalNrOfLabels)
        ctx.fillText(adjustedMin + (labelNumber * rangeToHeightRatio), x, y)
      }
    }

    #drawYAxisTitle(graphAndCanvasData) {
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

    #calculateLabelCount(graphAndCanvasData) {
      const { graphProperties } = graphAndCanvasData
      let numberOfLabelsToDraw = graphProperties.primeAdjustedLength
      while (numberOfLabelsToDraw > this.#maxNumberOfStepsOnXAxis) {
        numberOfLabelsToDraw = numberOfLabelsToDraw / 2
      }
      return numberOfLabelsToDraw
    }

    #drawZeroLineIfInRange(graphAndCanvasData) {
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

    /**
     * Generates the coordinates of the points to be drawn.
     * Important: The points are calculated on the prime adjusted length of the dataset,
     * meaning the renderArea width will be divided by the datasets length + 1 if its a prime number,
     * thus ensuring that it will always be possible to draw the graph and the labels will always be aligned with the data points.
     */
    *#pointGenerator(graphAndCanvasData) {
      const { canvasProperties, graphProperties, dataset } = graphAndCanvasData
      const graphAreaWidth = canvasProperties.renderAreaWidth
      const numberOfLabelsOnYAxis = graphAndCanvasData.numberOfLabelsOnYAxis
      const numberOfPoints = graphProperties.primeAdjustedLength
      const pointDistance = Math.floor(graphAreaWidth / numberOfPoints)

      let adjustedMin, adjustedRange

      // Check if the range is very small, in that case adjust the properties.
      if (graphProperties.range < 2) {
        adjustedMin = Math.floor(graphProperties.average) - 5
        adjustedRange = 10
      } else {
        adjustedMin = graphProperties.min
        adjustedRange = graphProperties.range
      }

      for (let i = 0; i < dataset.length; i++) {
        // x is simple
        const x = canvasProperties.marginWidth + i * pointDistance
        // y is a bit more complicated
        const yOrigin = canvasProperties.marginHeight + canvasProperties.renderAreaHeight
        const yOffset = dataset[i] - adjustedMin
        const yScaleFactor = Math.ceil(adjustedRange / numberOfLabelsOnYAxis)
        const yScaleProduct = Math.ceil(canvasProperties.renderAreaHeight / numberOfLabelsOnYAxis)
        const y = yOrigin - (yOffset) / yScaleFactor * yScaleProduct
        yield { xCoordinate: Math.floor(x), yCoordinate: Math.floor(y) }
      }
    }
  })
