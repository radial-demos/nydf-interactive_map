// import Color from 'color';
import dataset from '../data_files/dataset.json';
import dataTableTpl from './views/dataTable.hbs';

const MAX_ROWS = 0;
const BACKGROUND_COLOR = '#bfcfff';
const UNLISTED_AREAS_COLOR = '#dedede';
const COROPLETH_BIN_COLORS = [
  '#fef0d9',
  '#fdcc8a',
  '#fc8d59',
  '#d7301f',
];

const MONETIZATION_ICON = 'M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm2.83 32.18V40H21.5v-3.86c-3.41-.73-6.33-2.92-6.54-6.81h3.91c.2 2.1 1.64 3.73 5.3 3.73 3.93 0 4.8-1.96 4.8-3.18 0-1.65-.89-3.22-5.33-4.28-4.96-1.19-8.36-3.24-8.36-7.34 0-3.43 2.77-5.67 6.22-6.42V8h5.33v3.89c3.72.91 5.58 3.72 5.71 6.77H28.6c-.11-2.22-1.28-3.73-4.44-3.73-3 0-4.8 1.35-4.8 3.29 0 1.69 1.3 2.77 5.33 3.82 4.04 1.05 8.36 2.77 8.36 7.82 0 3.65-2.76 5.66-6.22 6.32z';

const TAG_ICON = 'M9 4c1.279 0 2.559.488 3.535 1.465L16 9l5 5-7 7-5.498-5.498c-.037.033-3.037-2.967-3.037-2.967A4.998 4.998 0 0 1 9 4m0-2c-1.87 0-3.628.729-4.949 2.051C2.729 5.371 2 7.129 2 8.999s.729 3.628 2.051 4.95l3 3c.107.107.227.201.35.279l5.187 5.186c.391.391.9.586 1.413.586s1.022-.195 1.414-.586l7-7c.78-.781.78-2.047 0-2.828l-5-5-3.45-3.521A6.971 6.971 0 0 0 9 2zm0 5.498a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3m0-1A2.503 2.503 0 0 0 6.5 9c0 1.377 1.121 2.498 2.5 2.498S11.5 10.377 11.5 9A2.503 2.503 0 0 0 9 6.498z';

const DOLLAR2_ICON = 'M1362 1185q0 153-99.5 263.5T1004 1585v175q0 14-9 23t-23 9H837q-13 0-22.5-9.5T805 1760v-175q-66-9-127.5-31T576 1509.5t-74-48-46.5-37.5-17.5-18q-17-21-2-41l103-135q7-10 23-12 15-2 24 9l2 2q113 99 243 125 37 8 74 8 81 0 142.5-43t61.5-122q0-28-15-53t-33.5-42-58.5-37.5-66-32-80-32.5q-39-16-61.5-25T733 948.5t-62.5-31T614 882t-53.5-42.5-43.5-49-35.5-58-21-66.5-8.5-78q0-138 98-242t255-134V32q0-13 9.5-22.5T837 0h135q14 0 23 9t9 23v176q57 6 110.5 23t87 33.5T1265 302t39 29 15 14q17 18 5 38l-81 146q-8 15-23 16-14 3-27-7-3-3-14.5-12t-39-26.5-58.5-32-74.5-26T921 430q-95 0-155 43t-60 111q0 26 8.5 48t29.5 41.5 39.5 33 56 31 60.5 27 70 27.5q53 20 81 31.5t76 35 75.5 42.5 62 50 53 63.5 31.5 76.5 13 94z';

const DOLLAR_ICON = 'M54.284 44.798v-10.11c3.297.807 6.52 2.344 9.157 4.762l.011-.015c.197.157.436.265.708.265.358 0 .665-.173.877-.428l.015.003 4.262-6.008-.01-.005c.175-.202.291-.458.291-.746 0-.34-.153-.638-.387-.849-3.953-3.651-9-5.843-14.924-6.502v-5.806h-.001c0-.637-.516-1.153-1.153-1.153h-4.578c-.637 0-1.153.516-1.153 1.153v5.659c-9.89 1.025-15.75 7.326-15.75 14.725 0 9.963 8.205 12.82 15.75 14.652v11.354c-4.845-.868-8.827-3.379-11.536-6.19-.019-.021-.039-.039-.06-.058l-.052-.051-.008.011a1.134 1.134 0 0 0-.719-.273 1.14 1.14 0 0 0-.998.608l-.014-.002-4.125 6.124.005.01a1.133 1.133 0 0 0-.292.748c0 .367.182.679.448.89l-.011.016c4.029 4.029 9.67 6.959 17.362 7.619v5.44c0 .637.516 1.153 1.153 1.153h4.578c.637 0 1.153-.517 1.153-1.153h.001V75.2c10.769-1.1 16.117-7.398 16.117-15.531 0-10.035-8.498-12.967-16.117-14.871zm-6.886-1.686c-3.003-.951-5.055-2.051-5.055-4.176 0-2.49 1.832-4.248 5.055-4.688v8.864zm6.886 22.784V56.08c3.224 1.025 5.495 2.199 5.495 4.615 0 2.345-1.759 4.468-5.495 5.201z';

const GRAPH_ICON = 'M21.25,8.375V28h6.5V8.375H21.25zM12.25,28h6.5V4.125h-6.5V28zM3.25,28h6.5V12.625h-6.5V28z';

const MONEY_ICON = 'M928 1536h384v-96h-128V992h-114l-148 137 77 80q42-37 55-57h2v288H928v96zm512-256q0 70-21 142t-59.5 134-101.5 101-138 39-138-39-101.5-101-59.5-134-21-142 21-142 59.5-134T982 903t138-39 138 39 101.5 101 59.5 134 21 142zm512 256v-512q-106 0-181-75t-75-181H544q0 106-75 181t-181 75v512q106 0 181 75t75 181h1152q0-106 75-181t181-75zm128-832v1152q0 26-19 45t-45 19H224q-26 0-45-19t-19-45V704q0-26 19-45t45-19h1792q26 0 45 19t19 45z';

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

// function getColor(value, fieldDef) {
//   const percentOfMax = value / fieldDef.max;
//   const bins = COROPLETH_BIN_COLORS.slice(0, COROPLETH_BIN_COLORS.length - 2).reduce((acc, cur, index) => acc.concat(acc[0] + acc[index]), [1 / (COROPLETH_BIN_COLORS.length)]);
//   bins.push(Number.POSITIVE_INFINITY);
//   const binIndex = bins.findIndex(bin => (percentOfMax <= bin));
//   return COROPLETH_BIN_COLORS[binIndex];
// }

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
      return { id: datum.countryCode, color: COROPLETH_BIN_COLORS[datum[sortField.key].binIndex] };
    });
    map.dataProvider.areas = areas;
  } else if (sortField.display === 'icon:dollar') {
    const images = data.filter(datum => datum.centroid).map((datum) => {
      return {
        latitude: datum.centroid.latitude,
        longitude: datum.centroid.longitude,
        svgPath: TAG_ICON,
        color: '#66cc66',
        scale: 0.75,
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
