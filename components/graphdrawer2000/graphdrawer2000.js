/**
 * GraphDrawer2000 is a Custom Web Component that renders a graph of a number dataset on a canvas.
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
    const canvas = this.shadowRoot.querySelector('#canvas')
    const ctx = canvas.getContext('2d')

    // Get the width and height of the canvas.
    const computedStyle = getComputedStyle(canvas)
    const width = parseInt(computedStyle.getPropertyValue('width'), 10)
    const height = parseInt(computedStyle.getPropertyValue('height'), 10)
    // Set the rending resolution to the display resolution.
    canvas.width = width
    canvas.height = height

    // Calculate the graph dimensions.
    const margin = 0.1
    const marginWidth = Math.min(width * margin, 64) // The margin should be at least 64px wide to fit the labels.
    const marginHeight = height * margin
    const graphWidth = width - marginWidth * 2
    const graphHeight = height - marginHeight * 2

    // Calculate the range of the graph.
    const max = Math.max(...dataset)
    console.log(max + ' max')
    const min = Math.min(...dataset)
    console.log(min + ' min')
    const range = max - min
    console.log(range + ' range')

    // Calculate the widthStep.
    const widthStep = graphWidth / (dataset.length - 1)

    // Calculate the heightStep. This have more to do with the axis labels than the actual graph, and hence the base 10.
    const heightStep = Math.ceil(range / 10)

    ctx.clearRect(0, 0, width, height)
    ctx.strokeStyle = 'black'

    // If the range includes 0, draw a line at 0.
    if (min < 0 && max > 0) {
      ctx.moveTo(marginWidth, marginHeight + graphHeight - (0 - min) / heightStep * (graphHeight / 10))
      ctx.lineTo(marginWidth + graphWidth, marginHeight + graphHeight - (0 - min) / heightStep * (graphHeight / 10))
      ctx.stroke()
    }

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
})


