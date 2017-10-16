# Interactive Graphic for NYDF Forest Declaration Website

Client requests a single interactive graphic to display map data corresponding to several published static figures.

Data is for developing countries consisting of the following fields (units).

- Tree Cover Loss (M ha)
- Tree Cover Loss (percent/year)
- Results-Based REDD+ Commitments (M USD)
- REDD+ Phase 1 and 2 Finance (M USD)
- Development Finance (M USD)

We propose a solution having both a map component and a table component. Users interact with the table component, clicking on table headers to select one or more of the available fields. The map component then changes to reflect user selection(s).

This data suggests display as follows:

- tree-cover fields (2): four-segment, two-hue, sequential choropleth
- finance fields (3): four-segment sequential icon

The mix of choropleth and icons would enable simultaneous display of tree-cover and finance fields creating a potentially useful comparison tool.

Based on static figures, projection appears to be Eckert-3.

## Technologies and Tooling

Client's website is Bootstrap-3 based. Since the interactive map will be embedded in the website, we use Bootstrap 3 as the basis for layout and styling.

We attempt to use BEM (Block, Element, Modifier) convention for custom CSS classes.

Rendering of both table and map will be completely browser (DOM) based. Implementation will require only a single JavaScript file and div tag.

This is a NodeJS application employing Handlebars templating and Webpack/Babel to produce one final browser-ready JS file.

We use [AMCharts](https://www.amcharts.com/javascript-maps/) as the basis for this project.

Linting is against [Airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb).

## Data

Source data is an Excel Workbook. Our approach is to use a script (convert-tsv-to-json.js) to read this data and do as much processing as possible, resulting in a self-contained JSON file (dataset.json) that can be import'ed into the browser-side script.

## Installation and Execution

Clone this repo and run ```npm i``` to install node_modules.

```npm run start:dev``` To start a browser-synced development server.

```npm run start:webpack``` To run the Webpack watcher.


## TODOs

- [x] Set up basic Bootstrap 3 project in 'public' directory.
- [x] Copy data from source-data Excel workbook into a TSV file ('countries.csv').
- [x] Write a script ('convert-tsv-to-json.js') to pull only the relevant data from 'countries.csv' and save it into a JSON file ('data.json'). Webpack can then include the data in the client JS bundle.
- [x] Create 'src' directory to contain client-side JS and SCSS files. Use entry point 'src/index.js'. Set up Webpack/Babel to bundle from this entry point and write output JS and CSS files into 'public/assets'.
- [x] Create basic Bootstrap 3 page
- [x] Include map files.
- [x] Render table.
- [x] Render map.
- [x] Include event listeners to respond to table-header clicks.
- [x] Modify choropleth in response to clicks on headers for tree-cover loss.
- [ ] Modify icons in response to clicks on financial headers.
- [ ] Highlight active table headers.
- [ ] Render legend.
