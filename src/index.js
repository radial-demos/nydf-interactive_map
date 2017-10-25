import './scss/main.scss'; // Force Webpack to load SCSS
import dataset from '../data_files/dataset.json';
import dataTableTpl from './views/dataTable.hbs';
import dataLegendTpl from './views/dataLegend.hbs';
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

let activeAreaFieldKey = 'areaLoss';
let activeFinanceFieldKey = 'financeResultsBased';
let activeSortedFieldKey = activeAreaFieldKey;

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

function updateTableAndLegend(data) {
  const fieldDefs = {};
  Object.keys(dataset.fieldDefs).forEach((key) => {
    const fieldDef = Object.assign({}, dataset.fieldDefs[key]);
    fieldDef.isSorted = (key === activeSortedFieldKey);
    fieldDef.isActive = ([activeAreaFieldKey, activeFinanceFieldKey].includes(key));
    fieldDefs[key] = fieldDef;
  });
  $('#legenddiv').html(dataLegendTpl({ areaFieldDef: fieldDefs[activeAreaFieldKey], financeFieldDef: fieldDefs[activeFinanceFieldKey] }));
  $('#tablediv').html(dataTableTpl({ fieldDefs, data }));
  // set up listeners
  $('th.header--sortable').on('click', (evt) => {
    evt.preventDefault();
    update($(evt.target).attr('data-field'));
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

function update(selectedFieldKey) {
  const selectedField = dataset.fieldDefs[selectedFieldKey];
  // let data;
  // if a field was selected, update active field keys
  if (selectedFieldKey) {
    if (selectedField.type === 'area') {
      // activate activeAreaFieldKey and sort by it
      activeAreaFieldKey = selectedFieldKey;
      activeSortedFieldKey = selectedFieldKey;
    } else if (selectedField.type === 'finance') {
      // activate activeFinanceFieldKey and sort by it
      activeFinanceFieldKey = selectedFieldKey;
      activeSortedFieldKey = selectedFieldKey;
    }
  }
  const data = getSortedData(activeSortedFieldKey, MAX_ROWS);
  updateTableAndLegend(data);
  // updateMap(data, activeSortedFieldKey);
}

function init() {
  // add colors to bin partitions
  Object.keys(dataset.fieldDefs).forEach((fieldKey) => {
    const fieldDef = dataset.fieldDefs[fieldKey];
    if (fieldDef.display === 'choropleth') {
      fieldDef.binPartitions.forEach((binPartition, ix) => {
        binPartition.color = RED_BIN_COLORS[ix];
      });
    } else if (fieldDef.display === 'icon') {

    }
  });
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
