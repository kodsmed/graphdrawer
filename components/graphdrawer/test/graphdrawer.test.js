import jk224jvGraphdrawer from '../graphdrawer.js'
import { AxisTitles } from "../classes/AxisTitles.js"
import { ColorSettings } from "../classes/ColorSettings.js"
import { FontSettings } from "../classes/FontSettings.js"
import { expect, jest } from '@jest/globals'

/**
 * Test the graphdrawer class.
 * this is the main class that draws the graph and defines the custom element.
 *
 * @see graphdrawer
 * It should have the following properties:
 * @property {HTMLCanvasElement} canvas - The canvas element.
 * @property {number} numberOfStepsOnYAxis - The number of steps on the y axis.
 * @property {number} maxNumberOfStepsOnXAxis - The maximum number of steps on the x axis.
 * @property {FontSettings} fontSettings - The font settings of the graph.
 * @property {ColorSettings} colorSettings - The color settings of the graph.
 * @property {AxisTitles} axisTitles - The titles of the axes.
 */
describe ('GraphDrawer', () => {

  let graphdrawerElement

  beforeEach(() => {
    graphdrawerElement = document.createElement('jk224jv-graphdrawer')
    document.body.appendChild(graphdrawerElement)
  })

  afterEach(() => {
    document.body.removeChild(graphdrawerElement)
  })

  describe('custom element', () => {
    it('should be defined', () => {
      expect(graphdrawerElement).toBeDefined()
    }),
    it('should have a shadow root', () => {
      expect(graphdrawerElement.shadowRoot).toBeDefined()
    }),
    it('should have a canvas element', () => {
      expect(graphdrawerElement.shadowRoot.querySelector('canvas')).toBeDefined()
    }),
    it('should have a canvas element with the id "canvas"', () => {
      expect(graphdrawerElement.shadowRoot.querySelector('canvas').id).toBe('canvas')
    }),
    it('the canvas element should have a width and height of 100%', () => {
      // The canvas needs to be rendered before we can get the computed style.
      requestAnimationFrame(() => {
        const computedStyle = getComputedStyle(graphdrawerElement.shadowRoot.querySelector('#canvas'))
        expect(computedStyle.width).toBe('100%')
        expect(computedStyle.height).toBe('100%')
      })
    })
  })

  describe('constructor', () => {
    it('should have a numberOfStepsOnYAxis property', () => {
      expect(graphdrawerElement.numberOfStepsOnYAxis).toBeDefined()
    }),
    it('numberOfStepsOnYAxis should be 10 since 10 is the base of the number system.', () => {
      expect(graphdrawerElement.numberOfStepsOnYAxis).toBe(10)
    }),
    it('should have a maxNumberOfStepsOnXAxis property', () => {
      expect(graphdrawerElement.maxNumberOfStepsOnXAxis).toBeDefined()
    }),
    it('should have a fontSettings property', () => {
      expect(graphdrawerElement.fontSettings).toBeDefined()
    }),
    it('fontSettings should be an instance of FontSettings', () => {
      expect(graphdrawerElement.fontSettings).toBeInstanceOf(FontSettings)
    }),
    it('should have a colorSettings property', () => {
      expect(graphdrawerElement.colorSettings).toBeDefined()
    }),
    it('colorSettings should be an instance of ColorSettings', () => {
      expect(graphdrawerElement.colorSettings).toBeInstanceOf(ColorSettings)
    }),
    it('should have an axisTitles property', () => {
      expect(graphdrawerElement.axisTitles).toBeDefined()
    }),
    it('axisTitles should be an instance of AxisTitles', () => {
      expect(graphdrawerElement.axisTitles).toBeInstanceOf(AxisTitles)
    })
  })

  describe('verifyDatasetIntegrity', () => {
    it('should throw an error if the dataset is not an array', () => {
      expect(() => graphdrawerElement.verifyDatasetIntegrity(1)).toThrow(Error)
    }),
    it('should throw an error if the dataset is null', () => {
      expect(() => graphdrawerElement.verifyDatasetIntegrity(null)).toThrow(Error)
    }),
    it('should throw an error if the dataset is undefined', () => {
      expect(() => graphdrawerElement.verifyDatasetIntegrity(undefined)).toThrow(Error)
    }),
    it('should throw an error if the dataset is empty', () => {
      expect(() => graphdrawerElement.verifyDatasetIntegrity([])).toThrow(Error)
    }),
    it('should throw an error if the dataset contains a non-number', () => {
      expect(() => graphdrawerElement.verifyDatasetIntegrity([1, 2, null])).toThrow(Error)
      expect(() => graphdrawerElement.verifyDatasetIntegrity([1, 2, undefined])).toThrow(Error)
      expect(() => graphdrawerElement.verifyDatasetIntegrity([1, 2, 'string'])).toThrow(Error)
      expect(() => graphdrawerElement.verifyDatasetIntegrity([1, 2, NaN])).toThrow(Error)
    }),
    it('should not throw an error if the dataset is valid', () => {
      expect(() => graphdrawerElement.verifyDatasetIntegrity([1, 2, 3])).not.toThrow(Error)
    })
  })

  describe('render', () => {
    it('should have a render method', () => {
      expect(graphdrawerElement.renderArrayAsGraph).toBeDefined()
    }),
    it('should call the verifyDatasetIntegrity method', () => {
      const spy = jest.spyOn(graphdrawerElement, 'verifyDatasetIntegrity')
      // wait for the canvas to be rendered
      requestAnimationFrame(() => {
        graphdrawerElement.render([1,2,3])
        expect(spy).toHaveBeenCalled()
      })
      spy.mockRestore()
    })
  })


})