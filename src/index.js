// import Color from 'color';
import dataset from '../data_files/dataset.json';
import dataTableTpl from './views/dataTable.hbs';
import icons from './modules/icons';

const MAX_ROWS = 0;
const BACKGROUND_COLOR = '#bfcfff';
const UNLISTED_AREAS_COLOR = '#dedede';
const RED_BIN_COLORS = [
  '#fef0d9',
  '#fdcc8a',
  '#fc8d59',
  '#d7301f',
];
const GREEN_BIN_COLORS = [
  '#edf8e9',
  '#bae4b3',
  '#74c476',
  '#238b45',
];

const BIN_ICONS = [
  icons.circle,
  icons.circleStroked,
  icons.money_1,
  icons.money_bag,
];

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
  return data;
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
      return { id: datum.countryCode, color: RED_BIN_COLORS[datum[sortField.key].binIndex] };
    });
    map.dataProvider.areas = areas;
  } else if (sortField.display === 'icon:dollar') {
    const images = data.filter(datum => (datum.centroid && !datum.isZero)).map((datum) => {
      return {
        latitude: datum.centroid.latitude,
        longitude: datum.centroid.longitude,
        svgPath: BIN_ICONS[datum[sortField.key].binIndex],
        color: GREEN_BIN_COLORS[3],
        scale: 0.9,
        zoomLevel: 5,
        // title: datum.countryName,
      };
    });
    map.dataProvider.images = images;
  }
  map.titles[0].text = `${sortField.label} (${sortField.units})`;
  map.validateData(); // re-draw map
}

function update(sortFieldKey = 'areaLoss') {
  const data = getSortedData(sortFieldKey, MAX_ROWS);
  const sortField = dataset.fieldDefs[sortFieldKey];
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
  panEventsEnabled: true,
  backgroundColor: BACKGROUND_COLOR,
  backgroundAlpha: 1,
  titles: [{
    text: 'Tree Cover Loss',
    size: 16,
  }, {
    text: 'source: Need sources or Darren will be unhappy.',
    size: 12,
  }],
  areasSettings: {
    unlistedAreasColor: UNLISTED_AREAS_COLOR,
    unlistedAreasOutlineColor: '#aaa',
    outlineColor: '#aaa',
    outlineAlpha: 1,
    rollOverColor: undefined,
    rollOverOutlineColor: undefined,
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
