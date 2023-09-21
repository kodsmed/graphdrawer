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
   * @param {number} fontSizeLabel - The size of the font for the labels must be a positive number.
   * @param {number} fontSizeTitle - The size of the font for the title must be a positive number.
   * @returns {FontSettings} - An object containing the font settings.
   */
  constructor (font, fontSizeLabel, fontSizeTitle) {
    if (typeof font !== 'string') {
      throw new TypeError('font must be a string')
    }
    if (typeof fontSizeLabel !== 'number' || fontSizeLabel < 0) {
      throw new TypeError('fontSizeLabel must be a positiv number')
    }
    if (typeof fontSizeTitle !== 'number' || fontSizeTitle < 0) {
      throw new TypeError('fontSizeTitle must be a positiv number')
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
