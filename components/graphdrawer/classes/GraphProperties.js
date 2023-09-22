  /**
   * Class to calculate the properties of a dataset.
   * @typedef {Object} GraphProperties
   * @property {number} max - The maximum value of the dataset.
   * @property {number} min - The minimum value of the dataset.
   * @property {number} range - The range of the dataset.
   * @property {number} average - The average value.
   * @property {number} primeAdjustedLength - The length of the graph adjusted for the prime numbers over 20.
   */
  export class GraphProperties {
  #max
  #min
  #range
  #average
  #primeAdjustedLength
    /**
     * @param {Array} dataset - The dataset to calculate the graph properties from.
     */
    constructor (dataset) {
      this.#validateDataset(dataset)
      this.#max = Math.max(...dataset)
      this.#min = Math.min(...dataset)
      this.#range = Math.max(this.#max - this.#min, 1)
      this.#average = dataset.reduce((accumulatedValue, currentValue) => accumulatedValue + currentValue, 0) / dataset.length
      this.#primeAdjustedLength = this.#calculatePrimeAdjustedLength(dataset)
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

    /**
     * Get average.
     * @readonly
     * @return {number} The average value.
     */
    get average () {
      return this.#average
    }

    /**
     * Get the length of the graph adjusted for the prime numbers over 20.
     * @readonly
     * @returns {number} The length of the graph adjusted for the prime numbers over 20.
     */
    get primeAdjustedLength () {
      return this.#primeAdjustedLength
    }

    #validateDataset (dataset) {
      if (!Array.isArray(dataset)) {
        throw new TypeError('The dataset must be an array.')
      }

      if (dataset.length === 0) {
        throw new Error('The dataset must not be empty.')
      }

      for (const value of dataset) {
        if (value === undefined || value === null || typeof value !== 'number' || isNaN(value)) {
          throw new TypeError('The dataset must only contain numbers.')
        }
      }
    }

    /**
     * Calculate the length of the graph adjusted for the prime numbers over 20.
     * Returns the length of the dataset if the length is less than 20 or the length + 1 if the length is greater than 20 and is a prime number.
     * @example [1, 2, 3] returns 3, [1,2,3...20] returns 20, [1,2,3...21] returns 21, [1,2,3...22] returns 22, [1,2,3...23] returns 24
     */
    #calculatePrimeAdjustedLength (dataset) {
      if (dataset.length < 20) {
        return dataset.length
      }

      if (dataset.length > 20 && this.isPrime(dataset.length)) {
        return dataset.length + 1
      }

      return dataset.length
    }

    isPrime (number) {
      // I did not write this code, source : https://en.wikipedia.org/wiki/Primality_test
      if (number === 2 || number === 3) {
        return true
      }

      if (number % 2 === 0) {
        return false
      }

      // We only need to check up to the square root of the number, because the square root of the number is the largest possible factor of the number.
      for (let i = 3; i * i <= number; i += 2) {
        if (number % i === 0) {
          return false
        }
      }
      return true
      // End of code I did not write.
    }
  }