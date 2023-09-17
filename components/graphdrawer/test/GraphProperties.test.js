import { GraphProperties } from "../classes/GraphProperties"

/**
 * Test the GraphProperties class.
 * GraphProperties is a simple class that stores the properties of the graph.
 *
 * @see GraphProperties
 * It should have the following properties:
 * @property {number} min - The minimum value of the dataset.
 * @property {number} max - The maximum value of the dataset.
 * @property {number} range - The range of the dataset.
 */

describe('GraphProperties', () => {
  it('should throw a TypeError if dataset is not an array', () => {
    expect(() => new GraphProperties(1)).toThrow(TypeError)
  }),
  it('should throw a TypeError if dataset is null', () => {
    expect(() => new GraphProperties(null)).toThrow(TypeError)
  }),
  it('should throw a TypeError if dataset is undefined', () => {
    expect(() => new GraphProperties(undefined)).toThrow(TypeError)
  }),
  it('should throw an Error if dataset is empty', () => {
    expect(() => new GraphProperties([])).toThrow(Error)
  }),
  it('should throw a TypeError if dataset contains a none-number', () => {
    expect(() => new GraphProperties([1, 2, null])).toThrow(TypeError)
    expect(() => new GraphProperties([1, 2, undefined])).toThrow(TypeError)
    expect(() => new GraphProperties([1, 2, 'string'])).toThrow(TypeError)
    expect(() => new GraphProperties([1, 2, NaN])).toThrow(TypeError)
  }),
  it('should set the max property', () => {
    const graphProperties = new GraphProperties([1, 2, 3])
    expect(graphProperties.max).toBe(3)
  }),
  it('should set the min property', () => {
    const graphProperties = new GraphProperties([1, 2, 3])
    expect(graphProperties.min).toBe(1)
  }),
  it('should set the range property', () => {
    const graphProperties = new GraphProperties([1, 2, 3])
    expect(graphProperties.range).toBe(2)
  })
})
