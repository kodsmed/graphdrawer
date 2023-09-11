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
    const margin = 0.1 // 10% margin, this allows room for the axis.
    const marginWidth = width * margin
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

    // Calculate the x-step.
    const step = graphWidth / (dataset.length - 1)

    // Calculate the y-step. This have more to do with the axis labels than the actual graph, and hence the base 10.
    // The step must be at least 12px high to fit the labels.
    const heightStep = Math.max(1, Math.ceil(range / 10)) // The step size should be at least 1.

    ctx.clearRect(0, 0, width, height)
    ctx.strokeStyle = 'black'

    // Draw the x-axis.
    ctx.moveTo(marginWidth, marginHeight + graphHeight)
    ctx.lineTo(marginWidth + graphWidth, marginHeight + graphHeight)
    ctx.stroke()

    // Draw the x-axis labels.
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'

    // Draw a maximum of 20 labels.
    if (dataset.length > 20) {
      const dataIndexStep = Math.floor(dataset.length / 20)
      const xPositionStep = Math.ceil(graphWidth / 20)
      for (let i = 0; i < 20; i ++) {
        const x = marginWidth + i * xPositionStep
        const y = marginHeight + graphHeight + 5 // 5 is the margin between the x-axis and the labels.
        // Only draw the label if it fits.
        if (ctx.measureText(1).width > step) {
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
      if (ctx.measureText(1).width <= step) {
        const label = dataset.length.toString()
        for (let j = 0; j < label.length; j++) {
          ctx.fillText(label[j], x, y + j * 12)
        }
      }
    } else {
      for (let i = 0; i < dataset.length; i++) {
        const x = marginWidth + i * step
        const y = marginHeight + graphHeight + 5 // 5 is the margin between the x-axis and the labels.
        // Only draw the label if it fits.
        if (ctx.measureText(1).width > step) {
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
    ctx.fillText('Index', marginWidth + graphWidth + 42, graphHeight + marginHeight + 16)

    // Draw the y-axis.
    ctx.moveTo(marginWidth, marginHeight)
    ctx.lineTo(marginWidth, marginHeight + graphHeight)
    ctx.stroke()

    // Draw the y-axis labels, 10 labels.
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
    ctx.fillText('Value', 0, 0)
    ctx.restore()

    // If the range includes 0, draw a line at 0.
    if (min < 0 && max > 0) {
      ctx.moveTo(marginWidth, marginHeight + graphHeight - (0 - min) / heightStep * (graphHeight / 10))
      ctx.lineTo(marginWidth + graphWidth, marginHeight + graphHeight - (0 - min) / heightStep * (graphHeight / 10))
      ctx.stroke()
    }

    // Draw the lines.
    ctx.moveTo(marginWidth, marginHeight + graphHeight)
    ctx.beginPath()
    for (let i = 0; i < dataset.length; i++) {
      const x = marginWidth + i * step
      const y = marginHeight + graphHeight - (dataset[i] - min) / heightStep * (graphHeight / 10)
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
})


