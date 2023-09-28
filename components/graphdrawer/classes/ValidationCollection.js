/**
 * ValidationCollection, a collection of Validation objects that can be used to validate the parameters of a function.
 * Contains a collection of methods that can be used to for validation.
 *
 * @typedef {Object} ValidationCollection
 * @property {number} minimumLength - Defines the minimum length of an array or object.
 * @property {number} maximumLength - Defines the maximum length of an array or object.
 * @property {Array} validProperties - Example ['width', 'height', 'color'].
 * @property {Array} validValues - Examples [1, 2, 3], ['red', 'green', 'blue']. Values can be of any type.
 * @property {Array} validValueTypes - Examples ['number', 'string', 'boolean']. Strings must be lowercase.
 * // these are the output properties, they are read-only and can only be accessed via getters (see below). They are empty if there are no errors, and does not reset automatically.
 * @property {Array} unexpectedProperties - An array of any properties of the object not included in validProperty[].
 * @property {Array} missingProperties -  Properties included in validProperty[] that are not present in the object.
 * @property {Array} unexpectedValues - An array of any values of the object not included in validValues[].
 * @property {Array} unexpectedValueTypes - An array of any value types of the object not included in validValueTypes[].
 * @property {Array} missingValues - An array of any values of the object that are not present in the object.
 * @property {string} typeThatFailed - Example: it expects a string but gets a number, then typeThatFailed = 'number'.
 */

export class ValidationCollection {
  // input properties
  #minimumLength = 0
  #maximumLength = 0
  #validProperties = []
  #validValues = []
  #validValueTypes = []

  // output properties
  #unexpectedProperties = []
  #missingProperties = []
  #unexpectedValues = []
  #unexpectedValueTypes = []
  #missingValues = []
  #typeThatFailed = ''


  constructor (argumentObject) {

    // validate the argumentObject
    if (typeof argumentObject !== 'object' || Array.isArray(argumentObject)) {
      throw new TypeError('argumentObject must be an object')
    }

    // get the properties of the argumentObject
    const properties = Object.getOwnPropertyNames(argumentObject)

    // for each property, check if it's a valid property and if it is, set the corresponding private property
    for (let property of properties) {
      if (property === 'minimumLength') {
        if (this.isPositiveNumber(argumentObject[property])) {
          this.#minimumLength = argumentObject[property]
        }
      } else if (property === 'maximumLength') {
        if (this.isPositiveNumber(argumentObject[property])) {
          this.#maximumLength = argumentObject[property]
        }
      } else if (property === 'validProperties') {
        if (this.isArray(argumentObject[property])) {
          this.#validProperties = argumentObject[property]
        }
      } else if (property === 'validValues') {
        if (this.isArray(argumentObject[property])) {
          this.#validValues = argumentObject[property]
        }
      } else if (property === 'validValueTypes') {
        if (this.isArray(argumentObject[property])) {
          this.#validValueTypes = argumentObject[property]
        }
      } else {
        throw new Error(`argumentObject contains an invalid property: ${property}`)
      }
    }
  }

  get unexpectedProperties () {
    return [...this.#unexpectedProperties]
  }

  get missingProperties () {
    return [...this.#missingProperties]
  }

  get unexpectedValues () {
    return [...this.#unexpectedValues]
  }

  get unexpectedValueTypes () {
    return [...this.#unexpectedValueTypes]
  }

  get missingValues () {
    return [...this.#missingValues]
  }

  get typeThatFailed () {
    return this.#typeThatFailed
  }

  isString (unknownData) {
    let result = true
    if (unknownData === undefined || unknownData === null || typeof unknownData !== 'string') {
      result = false
      this.#typeThatFailed = typeof unknownData
    }
    return result
  }

  isNumber (unknownData) {
    let result = true
    if (unknownData === undefined || unknownData === null || typeof unknownData !== 'number' || isNaN(unknownData)) {
      result = false
      this.#typeThatFailed = typeof unknownData
    }
    return result
  }

  isPositiveNumber (unknownData) {
    let result = true
    if (unknownData === undefined || unknownData === null || typeof unknownData !== 'number' || isNaN(unknownData) || unknownData < 0) {
      result = false
      this.#typeThatFailed = typeof unknownData
    }
    return result
  }

  isNegativeNumber (unknownData) {
    return this.isPositiveNumber(-unknownData)
  }

  isNumberBetweenMinMax (unknownData, min, max) {
    let result = this.isNumber(unknownData)
    if (result && (unknownData < min || unknownData > max)) {
      result = false
    }
    return result
  }

  isAnObject (unknownData) {
    let result = unknownData
    if (unknownData === undefined || unknownData === null || typeof unknownData !== 'object' || Array.isArray(unknownData)) {
      result = false
      this.#typeThatFailed = typeof unknownData
    }
    return result
  }

  isAnObjectThatMustHaveProperties (unknownData) {
    let result = this.isAnObject(unknownData)
    const missingProperties = []

    // get all properties of the unknownDataObject
    const unexpectedProperties = Object.getOwnPropertyNames(unknownData)

    for (const property of this.#validProperties) {
      if (!unknownData.hasOwnProperty(property)) {
        missingProperties.push(property)
        result = false
      } else {
        const index = unexpectedProperties.indexOf(property)
        if (index > -1) {
          unexpectedProperties.splice(index, 1)
        }
      }
    }

    if (unexpectedProperties.length > 0) {
      result = false
      this.#unexpectedProperties = unexpectedProperties
    }
    if (missingProperties.length > 0) {
      result = false
      this.#missingProperties = missingProperties
    }
    return result
  }

  isAnObjectThatMayHaveProperties (unknownData) {
    let result = this.isAnObject(unknownData)
    const unexpectedProperties = Object.getOwnPropertyNames(unknownData)

    for (const property of this.#validProperties) {
      if (unexpectedProperties.includes(property)) {
        const index = unexpectedProperties.indexOf(property)
        if (index > -1) {
          unexpectedProperties.splice(index, 1)
        }
      }
    }
    if (unexpectedProperties.length > 0) {
      result = false
      this.#unexpectedProperties = unexpectedProperties
    }
    return result
  }

  isAnObjectThatMayHavePropertiesAndMustHaveMinLength (unknownData) {
    let result = this.isAnObjectThatMayHaveProperties(unknownData)
    // if there are no unexpected properties, then there must be at least one property
    if (result && Object.getOwnPropertyNames(unknownData).length < this.#minimumLength) {
      result = false
    }
    return result
  }

  isArray (unknownData) {
    let result = true
    if (unknownData === undefined || unknownData === null || !Array.isArray(unknownData)) {
      result = false
      this.#typeThatFailed = typeof unknownData
    }
    return result
  }

  isArrayThatMustHaveMinLength (unknownData) {
    let result = this.isArray(unknownData)
    if (result && unknownData.length < this.#minimumLength) {
      result = false
    }
    return result
  }

  isArrayThatMustHaveMaxLength (unknownData) {
    let result = this.isArray(unknownData)
    if (result && unknownData.length > this.#maximumLength) {
      result = false
    }
    return result
  }

  isArrayThatMustHaveMinAndMaxLength (unknownData) {
    let result = this.isArray(unknownData)
    if (result && (unknownData.length < this.#minimumLength || unknownData.length > this.#maximumLength)) {
      result = false
    }
    return result
  }

  isObjectThatMustHaveSanctionedValues (unknownData) {
    let result = this.isAnObject(unknownData)
    if (result) {
      const values = Object.values(unknownData)
      const unexpectedValues = []
      for (const value of values) {
        if (!this.#validValues.includes(value)) {
          unexpectedValues.push(value)
          result = false
        }
      }
      if (unexpectedValues.length > 0) {
        this.#unexpectedValues = unexpectedValues
      }
    }
    return result
  }

  isAnObjectThatMustHaveValueType(unknownData) {
    let result = this.isAnObject(unknownData)
    if (result) {
      const values = Object.values(unknownData)
      const unexpectedValueTypes = []
      for (const value of values) {
        if (!this.#validValueTypes.includes(typeof value)) {
          unexpectedValueTypes.push(value)
          result = false
        }
      }
      if (unexpectedValueTypes.length > 0) {
        this.#unexpectedValues = unexpectedValueTypes
      }
    }
    return result
  }


  isArrayOfNumbers (unknownData) {
    let result = this.isArray(unknownData)
    if (result) {
      for (const value of unknownData) {
        if (typeof value !== 'number' || isNaN(value)) {
          result = false
          this.#typeThatFailed = typeof value
        }
      }
    }
    return result
  }

  isArrayOfObjects (unknownData) {
    let result = this.isArray(unknownData)
    if (result) {
      for (const element of unknownData) {
        if (typeof element !== 'object' || Array.isArray(element)) {
          result = false
          this.#typeThatFailed = typeof element
        }
      }
    }
    return result
  }

  isOfValidValueType (unknownData) {
    let result = true
    if (!this.#validValueTypes.includes(typeof unknownData)) {
      result = false
      this.#typeThatFailed = typeof unknownData
    }
    return result
  }

  isInstanceOf (unknownData, classType) {
    let result = this.isAnObject(unknownData)
    if (!(unknownData instanceof classType)) {
      result = false
      this.#typeThatFailed = typeof unknownData
    }
    return result
  }
}
