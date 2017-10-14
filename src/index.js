// import Color from 'color';
import dataset from '../data_files/dataset.json';
import dataTableTpl from './views/dataTable.hbs';

const MAX_ROWS = 25;
const COROPLETH_BIN_COLORS = [
  '#fef0d9',
  '#fdcc8a',
  '#fc8d59',
  '#e34a33',
  '#b30000',
];
// console.log(COROPLETH_BASE_COLOR.value());

let map;

function getSortedData(sortField, maxRows = 0) {
  let data = dataset.data.slice(); // shallow copy
  if (sortField) {
    data.sort((a, b) => {
      if (a[sortField].value > b[sortField].value) return -1;
      if (a[sortField].value < b[sortField].value) return 1;
      return 0;
    });
  }
  if (maxRows) data = data.slice(0, maxRows);
  // include 1-based index for display
  data = data.map((ele, ix) => Object.assign(ele, { index: (ix + 1) }));
  // calculate min and max
  let min = Number.POSITIVE_INFINITY;
  let max = 0;
  data.forEach((datum) => {
    if (datum[sortField].value > max) max = datum[sortField].value;
    if (datum[sortField].value < min) min = datum[sortField].value;
  });
  return { data, min, max };
}

function getColor(value, fieldDef) {
  const percentOfMax = value / fieldDef.max;
  const bins = COROPLETH_BIN_COLORS.slice(
    0, COROPLETH_BIN_COLORS.length - 2).reduce((acc, cur, index) =>
    acc.concat(acc[0] + acc[index]), [1 / (COROPLETH_BIN_COLORS.length)]);
  bins.push(Number.POSITIVE_INFINITY);
  const binIndex = bins.findIndex(bin => (percentOfMax <= bin));
  return COROPLETH_BIN_COLORS[binIndex];
}

function updateTable(data, sortField) {
  $('#tablediv').html(dataTableTpl({ fieldDefs: dataset.fieldDefs, data, sortField }));
  // set up listeners
  $('th.header--sortable').on('click', (evt) => {
    evt.preventDefault();
    const $target = $(evt.target);
    const fieldKey = $target.attr('data-field');
    update(fieldKey);
  });
}

function updateMap(data, sortField) {
  // set same zoom levels to retain map position/zoom
  map.dataProvider.zoomLevel = map.zoomLevel();
  map.dataProvider.zoomLatitude = map.zoomLatitude();
  map.dataProvider.zoomLongitude = map.zoomLongitude();
  if (sortField.display === 'choropleth') {
    const areas = data.map((datum) => {
      return { id: datum.countryCode, color: getColor(datum[sortField.key].value, sortField) };
    });
    map.dataProvider.areas = areas;
  }
  map.titles[0].text = `${sortField.label} (${sortField.units})`;
  map.validateData(); // re-draws map
}

function update(sortFieldKey = 'areaLoss') {
  const { data, min, max } = getSortedData(sortFieldKey, MAX_ROWS);
  // assign (merge) derived properties for min and max to sortField
  // also assign key
  const sortField = Object.assign(
    {},
    dataset.fieldDefs[sortFieldKey], { min, max, key: sortFieldKey },
  );
  updateTable(data, sortField);
  updateMap(data, sortField);
}

function init() {
  update();
}

// build map
map = AmCharts.makeChart('chartdiv', {
  type: 'map',
  projection: 'eckert3',
  addClassNames: true,
  panEventsEnabled: false,
  titles: [{
    text: 'Tree Cover Loss',
    size: 16,
  }, {
    text: 'source: Need sources or Darren will be unhappy.',
    size: 12,
  }],
  areasSettings: {
    // 'unlistedAreasColor': '#000000',
    // 'unlistedAreasAlpha': 0.1
  },
  dataProvider: {
    map: 'worldLow',
    // images.
  },
  listeners: [{
    event: 'init',
    method: init,
  }],
});
