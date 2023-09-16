/**
 * GraphDrawer is a Custom Web Element that renders a graph of a number dataset on a canvas.
 *
 * @author Jimmy Karlsson <jk224jv@student.lnu.se>
 *
 * Please see the readme file for usage.
 *
 */
import { CanvasProperties } from './classes/CanvasProperties.js'
import { GraphProperties } from './classes/GraphProperties.js'
import { FontSettings } from './classes/FontSettings.js'
import { ColorSettings } from './classes/ColorSettings.js'
import { AxisTitles } from './classes/AxisTitles.js'
import { GraphAndCanvasData } from './classes/GraphAndCanvasData.js'


const template = document.createElement('template')
template.innerHTML = `
  <style>
    #container {
      width: 100%;
      height: 100%;
    }
    #canvas {
      width: 100%;
      height: 100%;
    }
  </style>
<div id="container">
  <canvas id="canvas"></canvas>
</div>
`

customElements.define('jk224jv-graphdrawer',
 class jk224jvGraphdrawer extends HTMLElement {
  #canvas
  #numberOfStepsOnYAxis
  #maxNumberOfStepsOnXAxis
  #fontSettings
  #colorSettings
  #axisTitles

  constructor () {
    super()
    // The canvas element. Shortcut for convenience.
    this.#canvas = null // Will be set in connectedCallback.

    // The number of steps on the y-axis. This is the number of labels on the y-axis. This should really really be 10 since 10 is the basis of our number system.
    this.#numberOfStepsOnYAxis = 10
    // The maximum number of steps on the x-axis. This can change, but 20 is a good number. But feel free to experiment.
    this.#maxNumberOfStepsOnXAxis = 20

    // The default font. This object is updated when the attribute is changed.
    // you are encouraged to use the attribute for changes instead of this object.
    this.#fontSettings = new FontSettings('Arial', 12, 16)

    // The default colors. This object is updated when the attribute is changed.
    // you are encouraged to use the attribute for changes instead of this object.
    const graphLineColor = 'black'
    const graphDotColor = 'black'
    const zeroLineColor = 'gray'
    const axisColor = 'black'
    const labelColor = 'black'
    const titleColor = 'black'
    this.#colorSettings = new ColorSettings(graphLineColor, graphDotColor, zeroLineColor, axisColor, labelColor, titleColor)

    // The default axis titles. This object is updated when the attribute is changed.
    // you are encouraged to use the attribute for changes instead of this object.
    this.#axisTitles = new AxisTitles('Index', 'Values')

    this.attachShadow({ mode: 'open' })
    .appendChild(template.content.cloneNode(true))
  }

  static get observedAttributes () {}

  attributeChangedCallback (name, oldValue, newValue) {}

  connectedCallback () {
    this.#canvas = this.shadowRoot.querySelector('#canvas')
  }

  disconnectedCallback () {
    // forget everything.
    this.#canvas = null
  }

  /**
   * Takes a dataset of numbers and renders a graph of it on the canvas.
   *
   * @param {Array} dataset - The dataset to render.
   */
  render (dataset) {
    const ctx = this.#canvas.getContext('2d')

    // Calculate the graph dimensions.
    const canvasProperties = new CanvasProperties(this.#canvas)

    // Set the rending resolution to the display resolution.
    this.#canvas.width = canvasProperties.width
    this.#canvas.height = canvasProperties.height
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Calculate the graph properties and pixel dimensions.
    const graphProperties = new GraphProperties(dataset)

    // Create an object containing all the data needed to draw the graph. Any changes to the attributes after this point will not affect the current graph rendering.
    const graphAndCanvasData = new GraphAndCanvasData(canvasProperties, graphProperties, dataset, this.#maxNumberOfStepsOnXAxis, this.#numberOfStepsOnYAxis, this.#fontSettings, this.#colorSettings, ctx, this.#axisTitles)

    this.#clearCanvas(graphAndCanvasData)

    this.#drawZeroLineIfInRange(graphAndCanvasData)
    this.#drawXAxisWithLabelsAndTitle(graphAndCanvasData)
    this.#drawYAxisWithLabelsAndTitle(graphAndCanvasData)
    this.#drawGraphLines(graphAndCanvasData)
    this.#drawDataPoints(graphAndCanvasData)
  }

  /**
   * Draws the graph lines.
   *
   * @param {GraphAndCanvasData} graphAndCanvasData - An object containing all the data needed to draw the graph.
   */
  #drawGraphLines (graphAndCanvasData) {
    // Extract the desired objects from the graphAndCanvasData master-object.
    const { canvasProperties, graphProperties, dataset, ctx } = graphAndCanvasData

    ctx.beginPath()
    ctx.moveTo(canvasProperties.marginWidth, canvasProperties.marginHeight + canvasProperties.renderAreaHeight)
    ctx.strokeStyle = graphAndCanvasData.colorSettings.graphLineColor
    const numberOfLabelsOnYAxis = graphAndCanvasData.numberOfLabelsOnYAxis
    for (let index = 0; index < dataset.length; index++) {
      // Calculate the x and y coordinates of the next point.
      // x is the index of the dataset multiplied by the ratio of the width of the render area to the length of the dataset.
      const pixelToIndexRatio = canvasProperties.renderAreaWidth / (dataset.length - 1)
      const x = canvasProperties.marginWidth + index * pixelToIndexRatio

      // y is the value of the dataset at the current index multiplied by the ratio of the height of the render area to the range of the dataset.
      const pixelToValueStepSize = canvasProperties.renderAreaHeight / numberOfLabelsOnYAxis
      const calculatedValueSteps = (dataset[index] - graphProperties.min) / Math.ceil(graphProperties.range / numberOfLabelsOnYAxis)
      const bottomOfGraph = canvasProperties.marginHeight + canvasProperties.renderAreaHeight
      // The y coordinate is inverted since the y-axis is inverted on the canvas.
      const y = bottomOfGraph - (calculatedValueSteps * (pixelToValueStepSize))
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  /**
   * Draws a small circle at the data points.
   *
   * @param {GraphAndCanvasData} graphAndCanvasData - An object containing all the data needed to draw the graph.
   */
  #drawDataPoints (graphAndCanvasData) {
    // Extract the desired objects from the graphAndCanvasData master-object.
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
      ctx.fill()
    }
  }

  /**
   * Draws the y-axis and its labels.
   *
   * @param {object} graphAndCanvasData - An object containing all the data needed to draw the graph.
   */
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

  /**
   * Draws the y-axis.
   */
  #drawYAxis (graphAndCanvasData) {
    // Extract the desired objects from the graphAndCanvasData master-object.
    const { canvasProperties, colorSettings, ctx } = graphAndCanvasData

    ctx.beginPath()
    ctx.strokeStyle = colorSettings.axisColor
    ctx.moveTo(canvasProperties.marginWidth, canvasProperties.marginHeight)
    ctx.lineTo(canvasProperties.marginWidth, canvasProperties.marginHeight + canvasProperties.renderAreaHeight)
    ctx.stroke()
  }

  /**
   * Draws the x-axis labels.
   */
  #drawYAxisLabels (graphAndCanvasData) {
    // Extract the desired objects from the graphAndCanvasData master-object.
    const { canvasProperties, graphProperties, colorSettings, fontSettings, ctx } = graphAndCanvasData

    // Draw the y-axis labels, 10 labels.
    ctx.font = fontSettings.label
    ctx.fillStyle = colorSettings.labelColor
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    const totalNrOfLabels = graphAndCanvasData.numberOfLabelsOnYAxis
    for (let labelNumber = 0; labelNumber <= totalNrOfLabels; labelNumber++) {
      const x = canvasProperties.marginWidth - 5 // 5 is the margin between the y-axis and the labels.
      const bottomOfGraph = canvasProperties.marginHeight + canvasProperties.renderAreaHeight
      // The y coordinate is inverted since the y-axis is inverted on the canvas.
      const y = bottomOfGraph - labelNumber / totalNrOfLabels * canvasProperties.renderAreaHeight
      const rangeToHeightRatio = Math.ceil(graphProperties.range / totalNrOfLabels)
      ctx.fillText(graphProperties.min + (labelNumber * rangeToHeightRatio), x, y)
    }
  }

  /**
   * Draws the y-axis title.
   */
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

  /**
   * Draws the x-axis and its labels.
   *
   * @param {object} graphAndCanvasData - An object containing all the data needed to draw the graph.
   */
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

  /**
   * Draws the x-axis.
   *
   * @param {object} graphAndCanvasData - An object containing all the data needed to draw the graph.
   */
  #drawXAxis (graphAndCanvasData) {
    // Extract the desired objects from the graphAndCanvasData master-object.
    const { canvasProperties, colorSettings, ctx } = graphAndCanvasData
    ctx.beginPath()
    ctx.strokeStyle = colorSettings.axisColor
    ctx.moveTo(canvasProperties.marginWidth, canvasProperties.marginHeight + canvasProperties.renderAreaHeight)
    ctx.lineTo(canvasProperties.marginWidth + canvasProperties.renderAreaWidth, canvasProperties.marginHeight + canvasProperties.renderAreaHeight)
    ctx.stroke()
  }

  /**
   * Draws the x-axis labels.
   *
   * @param {object} graphAndCanvasData - An object containing all the data needed to draw the graph.
   */
  #drawXAxisLabels (graphAndCanvasData) {
    // Extract the desired objects from the graphAndCanvasData master-object.
    const { canvasProperties, graphProperties, dataset, colorSettings, fontSettings, ctx } = graphAndCanvasData

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
      // Only draw the label if it fits. This is done to avoid overlapping labels in case the canvas is too small.
      if (ctx.measureText(1).width > pixelsBetweenLabels) {
        continue
      }
      // Draw the label vertically
      for (let character = 0; character < label.length; character++) {
        ctx.fillText(label[character], x, y + character * labelFontSize)
      }
    }
  }

  /**
   * Draws the x-axis title.
   *
   * @param {object} graphAndCanvasData - An object containing all the data needed to draw the graph.
   */
  #drawXAxisTitle (graphAndCanvasData) {
    // Extract the desired objects from the graphAndCanvasData master-object.
    const { canvasProperties, colorSettings, fontSettings, ctx, axisTitles } = graphAndCanvasData
    const titleFontSize = parseInt(fontSettings.title, 10)

    ctx.save()
    // Translate the canvas to the x-axis title position.
    ctx.translate(canvasProperties.marginWidth + ctx.measureText(axisTitles.xAxis).width / 2, canvasProperties.marginHeight + canvasProperties.renderAreaHeight + titleFontSize * 3)
    ctx.font = fontSettings.title
    ctx.fillStyle = colorSettings.titleColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    ctx.fillText(axisTitles.xAxis, 0, 0)
    ctx.restore()
  }

  /**
   * Calculates how many labels to draw on the x-axis.
   *
   * @param {object} graphAndCanvasData - An object containing all the data needed to draw the graph.
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

  /**
   * Draws the zero line.
   * @param {object} graphAndCanvasData - An object containing all the data needed to draw the graph.
   */
  #drawZeroLineIfInRange (graphAndCanvasData) {
    // Extract the desired objects from the graphAndCanvasData master-object.
    const { canvasProperties, graphProperties, colorSettings, ctx } = graphAndCanvasData
    if (graphProperties.min < graphAndCanvasData.nonMagicZero && graphProperties.max > graphAndCanvasData.nonMagicZero) { // If the range includes 0.
      // Draw the zero line.
      ctx.beginPath()
      ctx.strokeStyle = colorSettings.zeroLineColor
      const heightStep = Math.ceil(graphProperties.range / graphAndCanvasData.numberOfLabelsOnYAxis)
      const yCoordinate = canvasProperties.marginHeight + canvasProperties.renderAreaHeight - (graphAndCanvasData.nonMagicZero - graphProperties.min) / heightStep * (canvasProperties.renderAreaHeight / graphAndCanvasData.numberOfLabelsOnYAxis)
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
   * Clear the entire canvas.
   */
  #clearCanvas (graphAndCanvasData) {
    // Extract the desired objects from the graphAndCanvasData master-object.
    const { ctx, canvasProperties } = graphAndCanvasData

    // clear the canvas.
    ctx.clearRect(0, 0, canvasProperties.width, canvasProperties.height)
  }
})
