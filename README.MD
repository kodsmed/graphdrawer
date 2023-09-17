# Graphdrawer

Uses the canvas element to render an array of numerical data.

## Usage

Copy the /components/graphdrawer folder into your project and import it into your code.
An example of usage is provided in the root index.html and index.js files.
The surrounding code is just for test and demonstration purposes and not required for the graphdrawer to work,
only the graphdrawer folder is required.

## Testing

The test suite is written in Jest and can be run with the command `npm test`.

## How to render? Not Yet implemented

Call the method "render(number[])" on the GraphDrawer object. The array of numbers will be rendered as a graph.

## How to change the colors? Not Yet implemented

The colors are defined by HTML attributes on the graphdrawer element. The following attributes are available:

* data-color-background: The background color of the graph, defaults to 'white'
* data-color-graph: The color of the graph, defaults to 'black'
* data-color-axis: The color of the axis, defaults to 'black'
* data-color-dot: The color of the dots, defaults to 'black'

Valid values are:

* 'red'
* 'green'
* 'lime'
* 'blue'
* 'yellow'
* 'orange'
* 'purple'
* 'black'
* 'gray'
* 'white'

## How to change the size? Not Yet implemented

The size of the graph is defined by the width and height attributes on the graphdrawer element. The following attributes are available:

* width: The width of the graph, defaults to 300
* height: The height of the graph, defaults to 300

## How to change the axis? Not Yet implemented

The axis are defined by HTML attributes on the graphdrawer element. The following attributes are available:

* data-axis-x: The label of the x axis, defaults to 'x'
* data-axis-y: The label of the y axis, defaults to 'y'

## Hot to change the size of the dots? Not Yet implemented

The size of the dots is defined by the data-dot-size attribute on the graphdrawer element.

* data-dot-size: The size of the dots must be a number 0 to 10. 0 means no dots will be rendered. Defaults to 3 pixels.
