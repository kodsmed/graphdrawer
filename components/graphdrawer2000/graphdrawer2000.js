/**
 * GraphDrawer2000 is a Custom Web Element that renders a graph of a number dataset on a canvas.
 *
 * @author Jimmy Karlsson <jk224jv@student.lnu.se>
 *
 * Please see the readme file for usage.
 *
 */
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

customElements.define('jk224jv-graphdrawer2000',
 class jk224jvGraphdrawer2000 extends HTMLElement {

  constructor () {
    super()
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

  connectedCallback () {}

  disconnectedCallback () {}

  /**
   * Takes a dataset of numbers and renders a graph of it on the canvas.
   *
   * @param {Array} dataset - The dataset to render.
   */
  render (dataset) {
    this.verifyDatasetIntegrity(dataset)

    const canvas = this.shadowRoot.querySelector('#canvas')
    const ctx = canvas.getContext('2d')

    // Calculate the graph dimensions.
    const computedStyle = getComputedStyle(canvas)
    const width = parseInt(computedStyle.getPropertyValue('width'), 10)
    const height = parseInt(computedStyle.getPropertyValue('height'), 10)
    const marginWidth = width * this.defaultMargin
    const marginHeight = height * this.defaultMargin
    const graphWidth = width - marginWidth * 2
    const graphHeight = height - marginHeight * 2

    const canvasProperties = {
      width: width,
      height: height,
      marginWidth: marginWidth,
      marginHeight: marginHeight,
      graphWidth: graphWidth,
      graphHeight: graphHeight
    }


    // Set the rending resolution to the display resolution.
    canvas.width = width
    canvas.height = height
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Calculate the range of the graph.
    const max = Math.max(...dataset)
    const min = Math.min(...dataset)
    const range = max - min

    // Calculate the widthStep.
    const widthStep = graphWidth / (dataset.length - 1)

    // Calculate the heightStep. This have more to do with the axis labels than the actual graph, and hence the base 10.
    const heightStep = Math.ceil(range / 10)

    const graphProperties = {
      max: max,
      min: min,
      range: range,
      widthStep: widthStep,
      heightStep: heightStep
    }

    ctx.clearRect(0, 0, width, height)
    ctx.strokeStyle = 'black'

    this.drawZeroLine(canvasProperties, graphProperties, ctx)

    this.drawYAxis(marginWidth, marginHeight, graphHeight, min, heightStep, ctx, 'Values')
    this.drawXAxis(marginWidth, marginHeight, graphWidth, graphHeight, dataset.length, widthStep, ctx, 'Index')

    // Draw the lines.
    ctx.moveTo(marginWidth, marginHeight + graphHeight)
    ctx.beginPath()
    for (let i = 0; i < dataset.length; i++) {
      const x = marginWidth + i * widthStep
      const y = marginHeight + graphHeight - (dataset[i] - min) / heightStep * (graphHeight / 10)
      ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Draw the dots.
    for (let i = 0; i < dataset.length; i++) {
      const x = marginWidth + i * widthStep
      const y = marginHeight + graphHeight - (dataset[i] - min) / heightStep * (graphHeight / 10)
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
   * @param {number} marginWidth - The margin on the side of the graph.
   * @param {number} marginHeight - The margin on the bottom of the graph.
   * @param {number} graphHeight - The height of the graph.
   * @param {number} min - The minimum value of the dataset.
   * @param {number} heightStep - The step size of the y-axis.
   * @param {object} ctx - The canvas context.
   * @param {string} title - The title of the y-axis.
   */
  drawYAxis (marginWidth, marginHeight, graphHeight, min, heightStep, ctx, title) {
    // Draw the y-axis.
    ctx.beginPath()
    ctx.moveTo(marginWidth, marginHeight)
    ctx.lineTo(marginWidth, marginHeight + graphHeight)
    ctx.stroke()

    // Draw the y-axis labels, 10 labels.
    ctx.font = '12px Arial'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    for (let i = 0; i <= 10; i++) {
      const x = marginWidth - 5 // 5 is the margin between the y-axis and the labels.
      const y = marginHeight + graphHeight - i / 10 * graphHeight
      ctx.fillText(min + (i * heightStep), x, y)
    }

    // Draw the y-axis title.
    ctx.save()
    ctx.translate(marginWidth - 42, marginHeight + graphHeight / 2) // Translate the canvas to the y-axis title position.
    ctx.rotate(-Math.PI / 2) // Rotate the canvas 90 degrees counter clockwise.
    ctx.font = '16px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    ctx.fillText(title, 0, 0)
    ctx.restore()
  }

  /**
   * Draws the x-axis and its labels.
   *
   * @param {number} marginWidth - The margin on the side of the graph.
   * @param {number} marginHeight - The margin on the bottom of the graph.
   * @param {number} graphWidth - The width of the graph.
   * @param {number} graphHeight - The height of the graph.
   * @param {number} datasetLength - The length of the dataset.
   * @param {number} widthStep - The step size of the x-axis.
   * @param {object} ctx - The canvas context.
   * @param {string} title - The title of the x-axis.
   */
  drawXAxis (marginWidth, marginHeight, graphWidth, graphHeight, datasetLength, widthStep, ctx, title) {
    // Draw the x-axis.
    ctx.beginPath()
    ctx.moveTo(marginWidth, marginHeight + graphHeight)
    ctx.lineTo(marginWidth + graphWidth, marginHeight + graphHeight)
    ctx.stroke()

    // Draw the x-axis labels.
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'

    // Draw a maximum of 20 labels.
    if (datasetLength > 20) {
      const dataIndexStep = Math.floor(datasetLength / 20)
      const xPositionStep = Math.ceil(graphWidth / 20)
      for (let i = 0; i < 20; i ++) {
        const x = marginWidth + i * xPositionStep
        const y = marginHeight + graphHeight + 5 // 5 is the margin between the x-axis and the labels.
        // Only draw the label if it fits.
        if (ctx.measureText(1).width > widthStep) {
          continue
        }
        // Draw the label vertically
        const label = (i * dataIndexStep + 1).toString()
        for (let j = 0; j < label.length; j++) {
          ctx.fillText(label[j], x, y + j * 12)
        }
      }

      // Draw the last label. This is done outside the loop to assure that the last label is always drawn regardless of the number of labels and the width of the canvas.
      const x = marginWidth + graphWidth
      const y = marginHeight + graphHeight + 5 // 5 is the margin between the x-axis and the labels.

      // Only draw the label if it fits.
      if (ctx.measureText(1).width <= widthStep) {
        const label = datasetLength.toString()
        for (let j = 0; j < label.length; j++) {
          ctx.fillText(label[j], x, y + j * 12)
        }
      }
    } else {
      for (let i = 0; i < datasetLength; i++) {
        const x = marginWidth + i * widthStep
        const y = marginHeight + graphHeight + 5 // 5 is the margin between the x-axis and the labels.
        // Only draw the label if it fits.
        if (ctx.measureText(1).width > widthStep) {
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
    ctx.font = '16px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    ctx.fillText(title, marginWidth + graphWidth + 42, graphHeight + marginHeight + 16)
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
        canvasProperties.marginHeight + canvasProperties.graphHeight - (this.nonMagicZero - graphProperties.min) / graphProperties.heightStep * (canvasProperties.graphHeight / this.numberOfStepsOnYAxis)
      )
      ctx.lineTo(
        canvasProperties.marginWidth + canvasProperties.graphWidth,
        canvasProperties.marginHeight + canvasProperties.graphHeight - (this.nonMagicZero - graphProperties.min) / graphProperties.heightStep * (canvasProperties.graphHeight / this.numberOfStepsOnYAxis)
      )
      ctx.stroke()
      // end the stroke to reset the strokeStyle to default.
      ctx.strokeStyle = this.selectedColors.default
    }
  }
        // ctx.moveTo(marginWidth, marginHeight + graphHeight - (0 - min) / heightStep * (graphHeight / 10))
        // ctx.lineTo(marginWidth + graphWidth, marginHeight + graphHeight - (0 - min) / heightStep * (graphHeight / 10))
        // ctx.stroke()

  /**
   * Verifies that the dataset is an array of valid numbers.
   * Throws an error if the dataset is invalid.
   * @param {Array} dataset - The dataset to verify.
   * @throws {Error} - Throws an error if the dataset is invalid.
   */
  verifyDatasetIntegrity (dataset) {
    if (!Array.isArray(dataset)) {
      throw new Error('GraphDrawer2000: The dataset is not an array.')
    }
    if (dataset.length < 2) {
      throw new Error('GraphDrawer2000: The dataset is too short. It must contain at least two numbers.')
    }
    for (let i = 0; i < dataset.length; i++) {
      if (typeof dataset[i] !== 'number' || isNaN(dataset[i])) {
        throw new Error('GraphDrawer2000: The dataset contains non-numbers.')
      }
    }
  }
})


