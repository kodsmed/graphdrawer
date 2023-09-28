import { AxisTitles } from '../classes/AxisTitles.js'

/**
 * Test the AxisTitles class.
 * AxisTitles is a simple class that stores the titles of the x and y axes.
 *
 * @see AxisTitles
 * It should have the following properties:
 * @property {string} xAxis - The title of the x axis.
 * @property {string} yAxis - The title of the y axis.
 */

describe('AxisTitles', () => {
  describe('constructor', () => {
    it('should throw a TypeError if xAxis is not a string', () => {
      expect(() => new AxisTitles(1, 'yAxis')).toThrow(TypeError)
    })
    it('should throw a TypeError if yAxis is not a string', () => {
      expect(() => new AxisTitles('xAxis', 1)).toThrow(TypeError)
    })
    it('should throw a TypeError if xAxis is null', () => {
      expect(() => new AxisTitles(null, 'yAxis')).toThrow(TypeError)
    })
    it('should throw a TypeError if yAxis is null', () => {
      expect(() => new AxisTitles('xAxis', null)).toThrow(TypeError)
    })
    it('should throw a TypeError if xAxis is undefined', () => {
      expect(() => new AxisTitles(undefined, 'yAxis')).toThrow(TypeError)
    })
    it('should throw a TypeError if yAxis is undefined', () => {
      expect(() => new AxisTitles('xAxis', undefined)).toThrow(TypeError)
    })
    it('should set the xAxis property', () => {
      const axisTitles = new AxisTitles('xAxis', 'yAxis')
      expect(axisTitles.xAxis).toBe('xAxis')
    })
    it('should set the yAxis property', () => {
      const axisTitles = new AxisTitles('xAxis', 'yAxis')
      expect(axisTitles.yAxis).toBe('yAxis')
    })
  })
})