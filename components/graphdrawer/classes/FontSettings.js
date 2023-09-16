/**
 * This class is used to store the font settings for the graph.
 * @typedef {Object} FontSettings
 * @property {string} font - The font to use.
 * @property {number} fontSize - The size of the font.
 */
export class FontSettings {
  #font
  #fontSizeLabel
  #fontSizeTitle
  /**
   * @param {string} font - The font to use.
   * @param {number} fontSizeLabel - The size of the font for the labels.
   * @param {number} fontSizeTitle - The size of the font for the title.
   * @returns {FontSettings} - An object containing the font settings.
   */
  constructor (font, fontSizeLabel, fontSizeTitle) {
    if (typeof font !== 'string') {
      throw new TypeError('font must be a string')
    }
    if (typeof fontSizeLabel !== 'number') {
      throw new TypeError('fontSizeLabel must be a number')
    }
    if (typeof fontSizeTitle !== 'number') {
      throw new TypeError('fontSizeTitle must be a number')
    }
    this.#font = font
    this.#fontSizeLabel = fontSizeLabel
    this.#fontSizeTitle = fontSizeTitle
  }

  /**
   * Get the font to use for labels.
   * @readonly
   * @returns {string} - the font settings.
   * @example '12px Arial'
   */
  get label () {
    return `${this.#fontSizeLabel}px ${this.#font}`
  }

  /**
   * Get the font to use for titles.
   * @readonly
   * @returns {string} - the font settings.
   * @example '12px Arial'
   */
  get title () {
    return `${this.#fontSizeTitle}px ${this.#font}`
  }
}
