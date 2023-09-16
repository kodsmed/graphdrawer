  /**
   * Class to calculate the properties of a dataset.
   * @typedef {Object} GraphProperties
   * @property {number} max - The maximum value of the dataset.
   * @property {number} min - The minimum value of the dataset.
   * @property {number} range - The range of the dataset.
   */
  export class GraphProperties {
  #max
  #min
  #range
    /**
     * @param {Array} dataset - The dataset to calculate the graph properties from.
     */
    constructor (dataset) {
      this.#max = Math.max(...dataset)
      this.#min = Math.min(...dataset)
      this.#range = this.#max - this.#min
    }

    /**
     * Get the maximum value of the dataset.
     * @readonly
     * @returns {number} The maximum value of the dataset.
     */
    get max () {
      return this.#max
    }

    /**
     * Get the minimum value of the dataset.
     * @readonly
     * @returns {number} The minimum value of the dataset.
     */
    get min () {
      return this.#min
    }

    /**
     * Get the range of the dataset.
     * @readonly
     * @returns {number} The range of the dataset.
     */
    get range () {
      return this.#range
    }
  }