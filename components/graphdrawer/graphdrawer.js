/**
 * GraphDrawer is a Custom Web Element that renders a graph of a number dataset on a canvas.
 *
 * @author Jimmy Karlsson <jk224jv@student.lnu.se>
 *
 * Please see the readme file for usage.
 *
 */
import './classes/CanvasProperties.js'


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

  constructor () {
    super()
    // The canvas element. Shortcut for convenience.
    this.canvas = null // Will be set in connectedCallback.

    // Zero is just Zero, not a magic number. It is just the number 0, Origo, the center of positive and negative numbers.
    this.nonMagicZero = 0
    // The number of steps on the y-axis. This is the number of labels on the y-axis. This should really really be 10 since 10 is the basis of our number system.
    this.numberOfStepsOnYAxis = 10
    // The maximum number of steps on the x-axis. This can change, but 20 is a good number. But feel free to experiment.
    this.maxNumberOfStepsOnXAxis = 20
    // The default margin. This is the margin on the side of the graph and the bottom of the graph. This is a percentage of the canvas width/height. This should be between 0 and 0.5.
    // 0.1 is a good number. But feel free to experiment, if your labels are too long, you might need to increase this number.
    this.defaultMargin = 0.1

    // The default font. This object is updated when the attribute is changed.
    // you are encouraged to use the attribute for changes instead of this object.
    this.selectedFont = {
      label: '12px Arial',
      title: '16px Arial'
    }

    // The default colors. This object is updated when the attribute is changed.
    // you are encouraged to use the attribute for changes instead of this object.
    this.selectedColors = {
      graph: 'black',
      zeroLine: 'grey',
      axis: 'black',
      label: 'black',
      title: 'black',
      dot: 'black',
      default: 'black'
    }

    this.attachShadow({ mode: 'open' })
    .appendChild(template.content.cloneNode(true))
  }

  static get observedAttributes () {}

  attributeChangedCallback (name, oldValue, newValue) {}

  connectedCallback () {
    this.canvas = this.shadowRoot.querySelector('#canvas')
  }

  disconnectedCallback () {
    // forget everything.
    this.canvas = null
  }

  /**
   * Takes a dataset of numbers and renders a graph of it on the canvas.
   *
   * @param {Array} dataset - The dataset to render.
   */
  render (dataset) {
    this.verifyDatasetIntegrity(dataset)

    const ctx = this.canvas.getContext('2d')

    // Calculate the graph dimensions.
    const canvasProperties = new CanvasProperties(this.canvas)

    // Set the rending resolution to the display resolution.
    this.canvas.width = canvasProperties.width
    this.canvas.height = canvasProperties.height
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Calculate the graph properties and pixel dimensions.
    const graphProperties = this.calculateGraphProperties(dataset, canvasProperties)

    // Clear the canvas to prepare for the new graph.
    ctx.clearRect(0, 0, canvasProperties.width, canvasProperties.height)
    ctx.strokeStyle = 'black'

    // Draw the graph.
    this.drawZeroLine(canvasProperties, graphProperties, ctx)
    this.drawXAxis(canvasProperties, graphProperties, dataset.length, ctx, 'Index')
    this.drawYAxis(canvasProperties, graphProperties, ctx, 'Values')

    // Draw the lines.
    this.drawGraphLines(dataset, canvasProperties, graphProperties, ctx)

    // Draw the dots.
    this.drawDataPoints(dataset, canvasProperties, graphProperties, ctx)
  }

  /**
   * Draws the graph lines.
   * @param {Array} dataset - The dataset to render.
   * @param {object} canvasProperties - The properties of the canvas.
   * @param {object} graphProperties - The properties of the graph.
   * @param {object} ctx - The canvas context.
   */
  drawGraphLines (dataset, canvasProperties, graphProperties, ctx) {
    ctx.beginPath()
    ctx.moveTo(canvasProperties.marginWidth, canvasProperties.marginHeight + canvasProperties.renderAreaHeight)
    ctx.strokeStyle = this.selectedColors.graph
    for (let i = 0; i < dataset.length; i++) {
      const x = canvasProperties.marginWidth + i * graphProperties.widthStep
      const y = canvasProperties.marginHeight + canvasProperties.renderAreaHeight - (dataset[i] - graphProperties.min) / graphProperties.heightStep * (canvasProperties.renderAreaHeight / this.numberOfStepsOnYAxis)
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  /**
   * Draws a small circle at the data points.
   *
   * @param {Array} dataset - The dataset to render.
   * @param {object} canvasProperties - The properties of the canvas.
   * @param {object} graphProperties - The properties of the graph.
   * @param {object} ctx - The canvas context.
   */
  drawDataPoints (dataset, canvasProperties, graphProperties, ctx) {
    for (let i = 0; i < dataset.length; i++) {
      const x = canvasProperties.marginWidth + i * graphProperties.widthStep
      const y = canvasProperties.marginHeight + canvasProperties.renderAreaHeight - (dataset[i] - graphProperties.min) / graphProperties.heightStep * (canvasProperties.renderAreaHeight / this.numberOfStepsOnYAxis)
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
   * @param {object} canvasProperties - The properties of the canvas.
   * @param {object} graphProperties - The properties of the graph.
   * @param {object} ctx - The canvas context.
   * @param {string} title - The title of the y-axis.
   */
  drawYAxis (canvasProperties, graphProperties, ctx, title) {
    // Draw the y-axis.
    ctx.beginPath()
    ctx.strokeStyle = this.selectedColors.axis
    ctx.moveTo(canvasProperties.marginWidth, canvasProperties.marginHeight)
    ctx.lineTo(canvasProperties.marginWidth, canvasProperties.marginHeight + canvasProperties.renderAreaHeight)
    ctx.stroke()

    // Draw the y-axis labels, 10 labels.
    ctx.font = this.selectedFont.label
    ctx.fillStyle = this.selectedColors.label
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    for (let i = 0; i <= 10; i++) {
      const x = canvasProperties.marginWidth - 5 // 5 is the margin between the y-axis and the labels.
      const y = canvasProperties.marginHeight + canvasProperties.renderAreaHeight - i / this.numberOfStepsOnYAxis * canvasProperties.renderAreaHeight
      ctx.fillText(graphProperties.min + (i * graphProperties.heightStep), x, y)
    }

    // Draw the y-axis title.
    ctx.save()
    // Translate the canvas to the y-axis title position.
    ctx.translate(canvasProperties.marginWidth - 42, canvasProperties.marginHeight + canvasProperties.renderAreaHeight / 2)
    ctx.rotate(-Math.PI / 2) // Rotate the canvas 90 degrees counter clockwise.
    ctx.font = this.selectedFont.title
    ctx.fillStyle = this.selectedColors.title
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    ctx.fillText(title, 0, 0)
    ctx.restore()
  }

  /**
   * Draws the x-axis and its labels.
   *
   * @param {object} canvasProperties - The properties of the canvas.
   * @param {object} graphProperties - The properties of the graph.
   * @param {number} datasetLength - The length of the dataset.
   * @param {object} ctx - The canvas context.
   * @param {string} title - The title of the x-axis.
   */
  drawXAxis (canvasProperties, graphProperties, datasetLength, ctx, title) {
    // Draw the x-axis.
    ctx.beginPath()
    ctx.strokeStyle = this.selectedColors.axis
    ctx.moveTo(canvasProperties.marginWidth, canvasProperties.marginHeight + canvasProperties.renderAreaHeight)
    ctx.lineTo(canvasProperties.marginWidth + canvasProperties.renderAreaWidth, canvasProperties.marginHeight + canvasProperties.renderAreaHeight)
    ctx.stroke()

    // Draw the x-axis labels.
    ctx.font = this.selectedFont.label
    ctx.fillStyle = this.selectedColors.label
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'

    // Draw a maximum of labels.
    if (datasetLength > this.maxNumberOfStepsOnXAxis) {
      const dataIndexStepsPerLabel = Math.floor(datasetLength / this.maxNumberOfStepsOnXAxis)
      const xPixelsPerLabel = Math.ceil(canvasProperties.renderAreaWidth / this.maxNumberOfStepsOnXAxis)
      for (let i = 0; i < this.maxNumberOfStepsOnXAxis; i ++) {
        const x = canvasProperties.marginWidth + i * xPixelsPerLabel
        const y = canvasProperties.marginHeight + canvasProperties.renderAreaHeight + (Math.ceil(parseInt(this.selectedFont.label) / 2))
        // Only draw the label if it fits.
        if (ctx.measureText(1).width > graphProperties.widthStep) {
          continue
        }
        // Draw the label vertically
        const label = (i * dataIndexStepsPerLabel + 1).toString()
        for (let j = 0; j < label.length; j++) {
          ctx.fillText(label[j], x, y + j * 12)
        }
      }

      // Draw the last label. This is done outside the loop to assure that the last label is always drawn regardless of the number of labels and the width of the canvas.
      const x = canvasProperties.marginWidth + canvasProperties.renderAreaWidth
      const y = canvasProperties.marginHeight + canvasProperties.renderAreaHeight + (Math.ceil(parseInt(this.selectedFont.label) / 2))

      // Only draw the label if it fits.
      if (ctx.measureText(1).width <= graphProperties.widthStep) {
        const label = datasetLength.toString()
        for (let j = 0; j < label.length; j++) {
          ctx.fillText(label[j], x, y + j * 12)
        }
      }
    } else {
      for (let i = 0; i < datasetLength; i++) {
        const x = canvasProperties.marginWidth + i * graphProperties.widthStep
        const y = canvasProperties.marginHeight + canvasProperties.renderAreaHeight + (Math.ceil(parseInt(this.selectedFont.label) / 2))

        // Only draw the label if it fits.
        if (ctx.measureText(1).width > graphProperties.widthStep) {
          continue
        }
        // Draw the label vertically
        const label = (i + 1).toString()
        for (let j = 0; j < label.length; j++) {
          ctx.fillText(label[j], x, y + j * 12)
        }
      }
    }

    // Draw the x-axis title.
    ctx.font = this.selectedFont.title
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    ctx.fillText(title, canvasProperties.marginWidth + canvasProperties.renderAreaWidth + 42, canvasProperties.renderAreaHeight + canvasProperties.marginHeight + 16)
  }

  /**
   * Draws the zero line.
   * @param {object} canvasProperties - The properties of the canvas.
   * @param {object} graphProperties - The properties of the graph.
   * @param {object} ctx - The canvas context.
   */
  drawZeroLine (canvasProperties, graphProperties, ctx) {
    if (graphProperties.min < 0 && graphProperties.max > 0) { // If the range includes 0.

      // Draw the zero line.
      ctx.strokeStyle = this.selectedColors.zeroLine
      ctx.beginPath()
      ctx.moveTo(
        canvasProperties.marginWidth,
        canvasProperties.marginHeight + canvasProperties.renderAreaHeight - (this.nonMagicZero - graphProperties.min) / graphProperties.heightStep * (canvasProperties.renderAreaHeight / this.numberOfStepsOnYAxis)
      )
      ctx.lineTo(
        canvasProperties.marginWidth + canvasProperties.renderAreaWidth,
        canvasProperties.marginHeight + canvasProperties.renderAreaHeight - (this.nonMagicZero - graphProperties.min) / graphProperties.heightStep * (canvasProperties.renderAreaHeight / this.numberOfStepsOnYAxis)
      )
      ctx.stroke()
      // end the stroke to reset the strokeStyle to default.
      ctx.strokeStyle = this.selectedColors.default
    }
  }
        // ctx.moveTo(marginWidth, marginHeight + renderAreaHeight - (0 - min) / heightStep * (renderAreaHeight / 10))
        // ctx.lineTo(marginWidth + renderAreaWidth, marginHeight + renderAreaHeight - (0 - min) / heightStep * (renderAreaHeight / 10))
        // ctx.stroke()

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
   * Calculates the canvas properties and returns them as an object.
   * @returns {object} - The canvas properties.
   */
  calculateCanvasProperties () {
    const computedStyle = getComputedStyle(this.canvas)
    const baseTen = 10
    const width = parseInt(computedStyle.getPropertyValue('width'), baseTen)
    const height = parseInt(computedStyle.getPropertyValue('height'), baseTen)
    const marginWidth = width * this.defaultMargin
    const marginHeight = height * this.defaultMargin
    const renderAreaWidth = width - marginWidth * 2
    const renderAreaHeight = height - marginHeight * 2

    return {
      width: width,
      height: height,
      marginWidth: marginWidth,
      marginHeight: marginHeight,
      renderAreaWidth: renderAreaWidth,
      renderAreaHeight: renderAreaHeight
    }
  }

  /**
   * Calculates the graph properties and returns them as an object.
   * @param {Array} dataset - The dataset to calculate the graph properties from.
   * @param {object} canvasProperties - The properties of the canvas.
   * @returns {object} - The graph properties.
   */
  calculateGraphProperties (dataset, canvasProperties) {
    const max = Math.max(...dataset)
    const min = Math.min(...dataset)
    const range = max - min
    const heightStep = Math.ceil(range / this.numberOfStepsOnYAxis)
    const widthStep = canvasProperties.renderAreaWidth / (dataset.length - 1)

    return {
      max: max,
      min: min,
      range: range,
      heightStep: heightStep, // How many pixels per value
      widthStep: widthStep // How many pixels per index
    }
  }
})
