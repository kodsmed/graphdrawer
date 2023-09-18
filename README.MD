# jk224jv-graphdrawer

A web component that draws a graph from an array of numbers using the canvas element.

## Dependencies

The component will work in any browser that supports the following:

* Custom Elements - [https://caniuse.com/custom-elementsv1](https://caniuse.com/custom-elementsv1)
* Shadow DOM - [https://caniuse.com/shadowdomv1](https://caniuse.com/shadowdomv1)
* Canvas API - [https://caniuse.com/canvas](https://caniuse.com/canvas)

## Demo

Easiest way to use the demo is to serve the root folder with a web server, for example the VS Code Live Server extension.
If that is not an option for you, you can use any other web server to serve the root folder, and then open the index.html file in your browser.

## Usage

Copy the /components/graphdrawer folder into your project and import it into your code.
An example of usage is provided in the root index.html and index.js files.
The surrounding code is just for test and demonstration purposes and not required for the graphdrawer to work,
only the graphdrawer folder is required. However, I encourage you to also include the test suite in your project.

### FOR DETAILED USAGE INSTRUCTIONS SEE THE README.MD IN THE COMPONENTS/GRAPHDRAWER FOLDER

there you will find the following information:

* how to render
* how to change the colors
* how to change the axis titles
* how to change the size of the canvas
* how to change the font and font size
* how to clear the canvas

## Testing

The test suite is written in Jest for the jsdom test environment and can be run straight out of the repo with the command `npm run test`.
If you want to change the test environment, the test suit may need to be adapted.

If you want to run the test suite in your project, make sure to include the following scripts in your package.json:

```json
"scripts": {
    "test": "npx --node-options=--experimental-vm-modules jest || exit 0",
}
```

Make sure to also include the test dependencies in your project:

* jest
* jest-environment-jsdom

```json
  "devDependencies": {
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0"
  },
```

Install the dependencies with `npm install` and run the test suite with `npm run test`.

## License

MIT License, Jimmy Karlsson 2023