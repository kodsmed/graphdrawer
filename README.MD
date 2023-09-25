# jk224jv-graphdrawer

A web component that draws a graph from an array of numbers using the canvas element.
Please see the readme in the components/graphdrawer folder.


## Usage

Copy the /components/graphdrawer folder into your project and import it into your code.
An example of usage is provided in the root index.html and index.js files.
Only the graphdrawer folder is required.  
The surrounding code is just for test and demonstration purposes and not required for the graphdrawer to work.


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

Make sure to also include the test dependencies in your projects package.json:

* jest
* jest-environment-jsdom

```json
  "devDependencies": {
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0"
  },
```

If you are not using the provided example file create a jest.config.js in the projects root-folder , and include the following:

```javascript
export default {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'mjs'],
  testMatch: ['**/test/**/*.test.js'],
  verbose: true,
  transform: {},
  resolver: null,
}
```

Install the dependencies with `npm install` and run the test suite with `npm run test`.

## License

MIT License, Jimmy Karlsson 2023, [LICENSE](LICENSE)
