import dataset from '../data_files/dataset.json';
import dataTableTpl from './views/dataTable.hbs';

const MAX_ROWS = 20;

let map;

function getSortedData(sortField, maxRows = 0) {
  const d = dataset.data.slice(); // shallow copy
  if (sortField) {
    d.sort((a, b) => {
      if (a[sortField].value > b[sortField].value) return -1;
      if (a[sortField].value < b[sortField].value) return 1;
      return 0;
    });
  }
  if (!maxRows) return d;
  return d.slice(0, maxRows);
}

function updateTable(data, sortField) {
  $('#tablediv').html(dataTableTpl({ fieldDefs: dataset.fieldDefs, data, sortField }));
  // set up listeners
  $('th.sortable').on('click', (evt) => {
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
  map.titles[0].text = `${sortField.label} (${sortField.units})`;
  map.validateData();
}

function update(sortFieldKey = 'areaLoss') {
  const data = getSortedData(sortFieldKey, MAX_ROWS);
  const sortField = dataset.fieldDefs[sortFieldKey];
  updateTable(data, Object.assign({}, sortField, { key: sortFieldKey }));
  updateMap(data, Object.assign({}, sortField, { key: sortFieldKey }));
  // console.log(map);
  // if (map.dataGenerated) return;
}

function init() {
  update();
}

// build map
map = AmCharts.makeChart('chartdiv', {
  type: 'map',
  projection: 'eckert3',
  addClassNames: true,
  titles: [{
    text: 'Tree Cover Loss',
    size: 14,
  }, {
    text: 'source: Need sources or Darren will be unhappy.',
    size: 11,
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
