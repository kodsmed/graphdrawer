import { GraphAndCanvasData } from '../components/graphdrawer/classes/GraphAndCanvasData.js'
import { GraphProperties } from '../components/graphdrawer/classes/GraphProperties.js'
import { CanvasProperties } from '../components/graphdrawer/classes/CanvasProperties.js'
import { AxisTitles } from '../components/graphdrawer/classes/AxisTitles.js'
import { FontSettings } from '../components/graphdrawer/classes/FontSettings.js'
import { ColorSettings } from '../components/graphdrawer/classes/ColorSettings.js'
import { expect, jest, test } from '@jest/globals'

/**
 * Test the GraphAndCanvasData class.
 * GraphAndCanvasData is a simple but big class that stores all the data needed to draw the graph on the canvas
 * and is used to pass data to the various methods without having to pass a lot of parameters.
 * @see GraphAndCanvasData
 *
 * It contains the following classes:
 * @see ColorSettings
 * @see FontSettings
 * @see GraphProperties
 * @see AxisTitles
 * @see CanvasProperties
 *
 * It should have the following properties:
 * @property {number} nonMagicZero - This is a non-magic zero. It's used to calculate the zero line. Don't change.
 * @property {CanvasProperties} canvasProperties - The properties of the canvas.
 * @property {GraphProperties} graphProperties - The properties of the graph.
 * @property {number[]} dataset - The dataset to draw.
 * @property {number} maxNumberOfLabelsOnXAxis - The maximum number of labels on the x-axis.
 * @property {number} numberOfLabelsOnYAxis - The fixed number of labels on the y-axis.
 * @property {FontSettings} fontSettings - The font settings for the graph.
 * @property {ColorSettings} colorSetting - The context of the canvas.
 * @property {object} ctx - The context of the canvas.
 * @property {AxisTitles} axisTitles - The titles of the axes.
 */

beforeAll(() => {
  // Mock the canvas
  const canvas = document.createElement('canvas')
  canvas.id = 'canvas'
  canvas.width = 1000
  canvas.height = 1000
  document.body.appendChild(canvas)
})

afterAll(() => {
  const canvas = document.getElementById('canvas')
  document.body.removeChild(canvas)
})

describe('GraphAndCanvasData', () => {
  describe('constructor', () => {
    it('should throw a TypeError if canvasProperties is not a valid CanvasProperties object', () => {
      // Wait for the canvas to be created
      requestAnimationFrame(() => {
        //const validCanvasProperties = new CanvasProperties(document.getElementById('canvas'))
        const validGraphProperties = new GraphProperties([1,2,3])
        const validDataset = [1,2,3]
        const validMaxNumberOfLabelsOnXAxis = 20
        const validNumberOfLabelsOnYAxis = 10
        const validFontSettings = new FontSettings('Arial', 12, 'black')
        const validColorSettings = new ColorSettings('black', 'white', 'red', 'green', 'blue', 'black')
        const validCtx = document.getElementById('canvas').getContext('2d')
        const validAxisTitles = new AxisTitles('x', 'y')

        expect(() => new GraphAndCanvasData('nonValid', validGraphProperties, validDataset, validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(() => new GraphAndCanvasData(1, validGraphProperties, validDataset, validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(() => new GraphAndCanvasData(null, validGraphProperties, validDataset, validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(() => new GraphAndCanvasData(undefined, validGraphProperties, validDataset, validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError)
      })
    }),
    it('should throw a TypeError if graphProperties is not a valid GraphProperties object', () => {
      // Wait for the canvas to be created
      requestAnimationFrame(() => {
        const validCanvasProperties = new CanvasProperties(document.getElementById('canvas'))
        //const validGraphProperties = new GraphProperties([1,2,3])
        const validDataset = [1,2,3]
        const validMaxNumberOfLabelsOnXAxis = 20
        const validNumberOfLabelsOnYAxis = 10
        const validFontSettings = new FontSettings('Arial', 12, 'black')
        const validColorSettings = new ColorSettings('black', 'white', 'red', 'green', 'blue', 'black')
        const validCtx = document.getElementById('canvas').getContext('2d')
        const validAxisTitles = new AxisTitles('x', 'y')

        expect(() => new GraphAndCanvasData(validCanvasProperties, 'nonValid', validDataset, validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(() => new GraphAndCanvasData(validCanvasProperties, 1, validDataset, validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(() => new GraphAndCanvasData(validCanvasProperties, null, validDataset, validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(() => new GraphAndCanvasData(validCanvasProperties, undefined, validDataset, validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(() => new GraphAndCanvasData(validCanvasProperties, [null, 1, 2], validDataset, validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(() => new GraphAndCanvasData(validCanvasProperties, [1, undefined, 3], validDataset, validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(() => new GraphAndCanvasData(validCanvasProperties, [1, 2, NaN], validDataset, validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(() => new GraphAndCanvasData(validCanvasProperties, Infinity, validDataset, validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(() => new GraphAndCanvasData(validCanvasProperties, -Infinity, validDataset, validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError)
      })
    }),
    it('should throw a TypeError if dataset is not a valid array', () => {
      // Wait for the canvas to be created
      requestAnimationFrame(() => {
        const validCanvasProperties = new CanvasProperties(document.getElementById('canvas'))
        const validGraphProperties = new GraphProperties([1,2,3])
        //const validDataset = [1,2,3]
        const validMaxNumberOfLabelsOnXAxis = 20
        const validNumberOfLabelsOnYAxis = 10
        const validFontSettings = new FontSettings('Arial', 12, 'black')
        const validColorSettings = new ColorSettings('black', 'white', 'red', 'green', 'blue', 'black')
        const validCtx = document.getElementById('canvas').getContext('2d')
        const validAxisTitles = new AxisTitles('x', 'y')

        expect(()=> new GraphAndCanvasData(validCanvasProperties, validGraphProperties, 'nonValid', validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(()=> new GraphAndCanvasData(validCanvasProperties, validGraphProperties, 1, validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(()=> new GraphAndCanvasData(validCanvasProperties, validGraphProperties, null, validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(()=> new GraphAndCanvasData(validCanvasProperties, validGraphProperties, undefined, validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(()=> new GraphAndCanvasData(validCanvasProperties, validGraphProperties, {}, validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(()=> new GraphAndCanvasData(validCanvasProperties, validGraphProperties, true, validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(()=> new GraphAndCanvasData(validCanvasProperties, validGraphProperties, false, validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(()=> new GraphAndCanvasData(validCanvasProperties, validGraphProperties, [], validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(()=> new GraphAndCanvasData(validCanvasProperties, validGraphProperties, NaN, validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(()=> new GraphAndCanvasData(validCanvasProperties, validGraphProperties, Infinity, validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(()=> new GraphAndCanvasData(validCanvasProperties, validGraphProperties, -Infinity, validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(()=> new GraphAndCanvasData(validCanvasProperties, validGraphProperties, [1,2,NaN], validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(()=> new GraphAndCanvasData(validCanvasProperties, validGraphProperties, [1,2,undefined], validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(()=> new GraphAndCanvasData(validCanvasProperties, validGraphProperties, [1,2,null], validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(()=> new GraphAndCanvasData(validCanvasProperties, validGraphProperties, [1,2,'string'], validMaxNumberOfLabelsOnXAxis, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError)
      })
    }),
    it('should throw a TypeError if maxNumberOfLabelsOnXAxis is not a valid number', () => {
      // Wait for the canvas to be created
      requestAnimationFrame(() => {
        const validCanvasProperties = new CanvasProperties(document.getElementById('canvas'))
        const validGraphProperties = new GraphProperties([1,2,3])
        const validDataset = [1,2,3]
        //const validMaxNumberOfLabelsOnXAxis = 20
        const validNumberOfLabelsOnYAxis = 10
        const validFontSettings = new FontSettings('Arial', 12, 'black')
        const validColorSettings = new ColorSettings('black', 'white', 'red', 'green', 'blue', 'black')
        const validCtx = document.getElementById('canvas').getContext('2d')
        const validAxisTitles = new AxisTitles('x', 'y')

        expect(()=> new GraphAndCanvasData(validCanvasProperties, validGraphProperties, validDataset, 'nonValid', validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(()=> new GraphAndCanvasData(validCanvasProperties, validGraphProperties, validDataset, null, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(()=> new GraphAndCanvasData(validCanvasProperties, validGraphProperties, validDataset, undefined, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(()=> new GraphAndCanvasData(validCanvasProperties, validGraphProperties, validDataset, {}, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(()=> new GraphAndCanvasData(validCanvasProperties, validGraphProperties, validDataset, true, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(()=> new GraphAndCanvasData(validCanvasProperties, validGraphProperties, validDataset, false, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(()=> new GraphAndCanvasData(validCanvasProperties, validGraphProperties, validDataset, [], validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(()=> new GraphAndCanvasData(validCanvasProperties, validGraphProperties, validDataset, NaN, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(()=> new GraphAndCanvasData(validCanvasProperties, validGraphProperties, validDataset, Infinity, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError),
        expect(()=> new GraphAndCanvasData(validCanvasProperties, validGraphProperties, validDataset, -Infinity, validNumberOfLabelsOnYAxis, validFontSettings, validColorSettings, validCtx, validAxisTitles)).toThrow(TypeError)
      })
      // TODO: test if numberOfLabelsOnYAxis can be invalid.
      // TODO: test if fontSettings can be invalid.
      // TODO: test if colorSettings can be invalid.
      // TODO: test if ctx can be invalid.
      // TODO: test if axisTitles can be invalid.
      // TODO: test getters on all properties.
    })
  })
})