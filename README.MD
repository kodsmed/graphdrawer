# Graphdrawer2000

Uses the canvas element to render an array of numerical data.

## Usage

Copy the /components/graphdrawer2000 folder into your project and import it into your code. An example of usage is provided in the root index.html and index.js files.

## How to render? Not Yet implemented

Call the method "render(number[])" on the GraphDrawer2000 object. The array of numbers will be rendered as a graph.

### To many numbers? Not Yet implemented

If the array contains more numbers than the graph can display, average values will be calculated and displayed instead.

## How to change the colors? Not Yet implemented

The colors are defined by HTML attributes on the graphdrawer2000 element. The following attributes are available:

* data-color-background: The background color of the graph, defaults to 'white'
* data-color-graph: The color of the graph, defaults to 'black'
* data-color-axis: The color of the axis, defaults to 'black'

Valid values are:

* 'red'
* 'green'
* 'lime'
* 'blue'
* 'yellow'
* 'orange'
* 'purple'
* 'black'
* 'white'

## How to change the size? Not Yet implemented

The size of the graph is defined by the width and height attributes on the graphdrawer2000 element. The following attributes are available:

* width: The width of the graph, defaults to 300
* height: The height of the graph, defaults to 300

## How to change the axis? Not Yet implemented

The axis are defined by HTML attributes on the graphdrawer2000 element. The following attributes are available:

* data-axis-x: The label of the x axis, defaults to 'x'
* data-axis-y: The label of the y axis, defaults to 'y'
