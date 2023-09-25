import './components/graphdrawer/index.js'
/**
 * This page shows an example usage of the graphdrawer element.
 *
 * Simply import the element and use it like this:
 *   1) Import the element.
 *
 *   2a HTML) Create an instance of the element. If you want to use the element in HTML, you can simply use the element tag.
 *      Don't forget to add any options you want to pass to the element as attributes, see the README.MD file.
 *      Don't forget to close the tag.
 *
 *  2b JavaScript) Create an instance of the element.
 *      If you want to use the element in JavaScript, you can use the document.createElement method.
 *      Any options you want to pass to the element can be passed as attributes and need to be done at this point.
 *      Don't forget to append the element to the DOM.
 *      See the example in the commented out code below.
 *
 *   3) Call the render method with a dataset.
 *      The dataset should be an array of numbers.
 */

/**
 * Example of how to use the element in pure javascript.
 * Uncomment the code below to use it.
 * Don't forget to comment out the HTML example.
 * Note that the custom element is already imported in the head of this document.
 *
 * @example
 * const graphdrawerElement = document.createElement('jk224jv-graphdrawer')
 * graphdrawerElement.setAttribute('width', '100%')
 * graphdrawerElement.setAttribute('height', '100%')
 * document.body.appendChild(graphdrawerElement)
 * const dataset = [2,4,5,6,4,3,7,8,9,5,2,2,3,4,6,-5,2,4,6,7,8,4,5]
 * document.querySelector('jk224jv-graphdrawer').render(dataset)
 */


/**
 * Example of how to use the element in HTML/JS.
 * This code is active by default in this document.
 * Note that the element is already imported and already present in the DOM via the index.html file.
 *
 *@example
 */
// the default dataset 23 values between -10 and 10
const defaultDataset = [0,4,5,6,4,3,7,8,9,5,2,2,3,4,6,-5,2,4,6,7,8,4,3,]

// render overflow dataset if you want to experiment with very large datasets
const overflowTestDataSet = []
for (let i = 0; i < 1000; i++) {
  overflowTestDataSet.push(Math.floor(Math.random() * 100))
}
// arrays used for testing
const veryShortRangeTestDataset = [4.0001, 5, 5.0001]
const zeroRangeTestDataset = [5,5,5,5]
const floatNumberTestDataset = [1.1, 1.2, 1.5, 1.9, 1.15, 1.45]
const graphdrawerElement = document.querySelector('jk224jv-graphdrawer')

// Set up the demo-page functions, buttons and eventlisteners.
// It is up to you how you want to use the element, this is just an example.
const renderButton = document.querySelector('#renderbutton')
renderButton.addEventListener('click', () => clickHandler())

/**
 * Click handler for the render button.
 * This function is called when the render button is clicked.
 * It validates the user input and renders the graph if the input is valid.
 * If the input is invalid, it shows the default dataset rendering instead.
 */
function clickHandler () {
  const untrustedInput = `${document.querySelector('#input').value}` // I don't care what you was. Now you are a string.
  let arrayToRender

  if(verifiableInputIntegrity(untrustedInput.trim())){
    const trustedInput = untrustedInput // Yes overkill, but indicated that we now have checked the input.
    arrayToRender = stringToArrayConverter(trustedInput)
  } else {
    arrayToRender = defaultDataset
  }

  graphdrawerElement.clear()
  graphdrawerElement.setSize({width: '80%', height: '80%'})
  graphdrawerElement.setColors([{graphDotColor: 'gray'}, {graphLineColor: 'lime'}, {zeroLineColor: 'white'}, {axisColor: 'white'}, {labelColor: 'white'}, {titleColor: 'white'}, {backgroundColor: 'black'}])
  graphdrawerElement.renderArrayAsGraph(arrayToRender)
}

/**
 * Validate the userinput and returns TRUE if it is an array of numbers.
 * Be aware that this function is not bulletproof and can be bypassed,
 * you should always validate user input on the server. This is just an example.
 * and false if it is anything else.
 *
 * @param {sting} untrustedUserInput
 */

function verifiableInputIntegrity (untrustedUserInput) {
  if (untrustedUserInput === undefined || untrustedUserInput === null || untrustedUserInput.length === 0) {
    return false
  }

  // Check if the input contains anything but [ ], numbers, commas, dots and spaces.
  const containsUnexpectedCharacters = untrustedUserInput.match(/[^0-9\[\]\,\.-\s]/g) !== null
  if (containsUnexpectedCharacters) {
    return false
  }

  // Check if its properly formatted as an array of numbers.
  const containsMultipleBrackets = untrustedUserInput.match(/\[/g).length > 1 || untrustedUserInput.match(/\]/g).length > 1
  const firstCharacterIsBracket = untrustedUserInput[0] === '['
  const lastCharacterIsBracket = untrustedUserInput[untrustedUserInput.length - 1] === ']'
  const secondCharacterIsNotANumber = isNaN(untrustedUserInput[1])
  if (containsMultipleBrackets || !firstCharacterIsBracket || !lastCharacterIsBracket || secondCharacterIsNotANumber) {
    return false
  }

  // The input is safe and can be parsed to an array of numbers.
  return true
}

/**
 * Converts a string to an array of numbers.
 * The string should be formatted as a javascript array of numbers.
 * The string should be validated before calling this function.
 * @param {string} stringToConvert
 */
function stringToArrayConverter (stringToConvert) {
  const arrayToRender = []
  // remove the brackets and split the string into an array of strings
  const stringArray = stringToConvert.slice(1, stringToConvert.length - 1).split(',')
  stringArray.forEach(element => {
    // convert each string to a number and push it to the arrayToRender
    // we can't use parseInt or parseFloat since we want to be able to render both.
    arrayToRender.push(Number(element))
  })
  return arrayToRender
}