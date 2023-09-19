import './components/graphdrawer/index.js'
/**
 * This page shows the usage of the graphdrawer element.
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
 * Note that the element is already imported in the  of this document and already present in the DOM via the index.html file.
 *
 *@example
 */
// the default dataset
const defaultDataset = [0,4,5,6,4,3,7,8,9,5,2,2,3,4,6,-5,2,4,6,7,8,4,5]
// render overflow dataset if you want to experiment with very large datasets
const overflowTestDataSet = []
for (let i = 0; i < 1000; i++) {
  overflowTestDataSet.push(Math.floor(Math.random() * 100))
}
const veryShortRangeTestDataset = [4.0001, 5, 5.0001]
const zeroRangeTestDataset = [5,5,5,5]
const floatNumberTestDataset = [1.1, 1.2, 1.5, 1.9, 1.15, 1.45]
const graphdrawerElement = document.querySelector('jk224jv-graphdrawer')
graphdrawerElement.renderArrayAsGraph(floatNumberTestDataset)