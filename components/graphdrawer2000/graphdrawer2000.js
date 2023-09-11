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
    const marginWidth = width * margin
    const marginHeight = height * margin
    const graphWidth = width - marginWidth * 2
    const graphHeight = height - marginHeight * 2

    // Calculate the range and step of the graph.
    const max = Math.max(...dataset)
    const min = Math.min(...dataset)
    const range = max - min

    // Calculate the step.
    const step = graphWidth / (dataset.length - 1)


    // Draw the lines.
    ctx.moveTo(marginWidth, marginHeight + graphHeight)
    ctx.beginPath()
    for (let i = 0; i < dataset.length; i++) {
      const x = marginWidth + i * step
      const y = marginHeight + graphHeight - (dataset[i] - min) / range * graphHeight
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
})


