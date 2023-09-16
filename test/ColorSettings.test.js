import { ColorSettings } from "../components/graphdrawer/classes/ColorSettings";

describe('ColorSettings', () => {
  it ('should throw a TypeError if color is not a string', () => {
    expect(() => new ColorSettings(1, 'green', 'red', 'blue', 'black', 'white')).toThrow(TypeError)
  }),
  it ('should throw a TypeError if color is null', () => {
    expect(() => new ColorSettings(null, 'green', 'red', 'blue', 'black', 'white')).toThrow(TypeError)
  }),
  it ('should throw a TypeError if color is undefined', () => {
    expect(() => new ColorSettings(undefined, 'green', 'red', 'blue', 'black', 'white')).toThrow(TypeError)
  }),
  it ('should throw a TypeError if color is not a valid color', () => {
    expect(() => new ColorSettings('chartreuse', 'green', 'red', 'blue', 'black', 'white')).toThrow(TypeError)
  }),
  it ('should set the graphLineColor property', () => {
    const colorSettings = new ColorSettings('red', 'green', 'red', 'blue', 'black', 'white')
    expect(colorSettings.graphLineColor).toBe('red')
  }),
  it ('should set the graphDotColor property', () => {
    const colorSettings = new ColorSettings('red', 'green', 'red', 'blue', 'black', 'white')
    expect(colorSettings.graphDotColor).toBe('green')
  }),
  it ('should set the zeroLineColor property', () => {
    const colorSettings = new ColorSettings('red', 'green', 'red', 'blue', 'black', 'white')
    expect(colorSettings.zeroLineColor).toBe('red')
  }),
  it ('should set the axisColor property', () => {
    const colorSettings = new ColorSettings('red', 'green', 'red', 'blue', 'black', 'white')
    expect(colorSettings.axisColor).toBe('blue')
  }),
  it ('should set the labelColor property', () => {
    const colorSettings = new ColorSettings('red', 'green', 'red', 'blue', 'black', 'white')
    expect(colorSettings.labelColor).toBe('black')
  }),
  it ('should set the titleColor property', () => {
    const colorSettings = new ColorSettings('red', 'green', 'red', 'blue', 'black', 'white')
    expect(colorSettings.titleColor).toBe('white')
  })
})
