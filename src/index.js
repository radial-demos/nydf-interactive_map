import './scss/main.scss'; // Force Webpack to load SCSS
import dataset from '../data_files/dataset.json';
import dataTableTpl from './views/dataTable.hbs';
import dataLegendTpl from './views/dataLegend.hbs';
import icons from './modules/icons';

const MAX_ROWS = 0;
const IS_DEFAULT_SORT_ORDER_REVERSE = true;
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
let activeSortedFieldKey = activeFinanceFieldKey;
let activeSortedFieldIsReverse = IS_DEFAULT_SORT_ORDER_REVERSE;

let map;

function getSortedData(sortField, isReverseSorted = false, maxRows = 0) {
  let data = dataset.data.slice(); // shallow copy
  if (sortField) {
    data.sort((a, b) => {
      if (a[sortField].value > b[sortField].value) return 1;
      if (a[sortField].value < b[sortField].value) return -1;
      return 0;
    });
  }
  if (maxRows) data = data.slice(0, maxRows);
  if (isReverseSorted) data.reverse();
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

function updateMap(data) {
  // set same zoom levels to retain map position/zoom
  map.dataProvider.zoomLevel = map.zoomLevel();
  map.dataProvider.zoomLatitude = map.zoomLatitude();
  map.dataProvider.zoomLongitude = map.zoomLongitude();
  map.titles = [];
  // draw both active field fields
  [activeAreaFieldKey, activeFinanceFieldKey].forEach((key) => {
    const fieldDef = dataset.fieldDefs[key];
    if (fieldDef.display === 'choropleth') {
      const areas = data.map((datum) => {
        return { id: datum.countryCode, color: fieldDef.binPartitions[datum[key].binIndex].color };
      });
      map.dataProvider.areas = areas;
    } else if (fieldDef.display === 'icon') {
      const images = data.filter(datum => (datum.centroid && !datum.isZero)).map((datum) => {
        return {
          latitude: datum.centroid.latitude,
          longitude: datum.centroid.longitude,
          svgPath: fieldDef.binPartitions[datum[fieldDef.key].binIndex].icon,
          color: fieldDef.binPartitions[datum[fieldDef.key].binIndex].color,
          scale: 0.9,
          zoomLevel: 5,
          // title: datum.countryName,
        };
      });
      map.dataProvider.images = images;
    }
    map.titles.push({ text: fieldDef.label });
  });
  map.validateData(); // re-draw map
}

function update(selectedFieldKey) {
  const selectedField = dataset.fieldDefs[selectedFieldKey];
  if (selectedFieldKey === activeSortedFieldKey) {
    activeSortedFieldIsReverse = !activeSortedFieldIsReverse;
  } else {
    activeSortedFieldIsReverse = IS_DEFAULT_SORT_ORDER_REVERSE;
  }
  // if a field was selected, update active field keys
  if (selectedFieldKey) {
    activeSortedFieldKey = selectedFieldKey;
    if (selectedField.type === 'area') {
      // activate activeAreaFieldKey
      activeAreaFieldKey = selectedFieldKey;
    } else if (selectedField.type === 'finance') {
      // activate activeFinanceFieldKey
      activeFinanceFieldKey = selectedFieldKey;
    }
  }
  const data = getSortedData(activeSortedFieldKey, activeSortedFieldIsReverse, MAX_ROWS);
  updateTableAndLegend(data);
  updateMap(data);
}

function init() {
  // add colors to bin partitions
  Object.keys(dataset.fieldDefs).forEach((fieldKey) => {
    const fieldDef = dataset.fieldDefs[fieldKey];
    if (!Array.isArray(fieldDef.binPartitions)) return;
    fieldDef.binPartitions.forEach((binPartition, ix) => {
      if (fieldDef.display === 'choropleth') {
        binPartition.color = RED_BIN_COLORS[ix];
      } else if (fieldDef.display === 'icon') {
        binPartition.color = GREEN_BIN_COLORS[3];
        binPartition.icon = BIN_ICONS[ix];
      }
    });
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
