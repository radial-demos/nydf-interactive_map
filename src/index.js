import dataset from '../data_files/dataset.json';
import dataTableTpl from './views/dataTable.hbs';

let map;

function getSortedData(sortField) {
  const d = dataset.data.slice(); // shallow copy
  if (!sortField) return d;
  d.sort((a, b) => {
    if (a[sortField].value > b[sortField].value) return -1;
    if (a[sortField].value < b[sortField].value) return 1;
    return 0;
  });
  return d;
}

function updateTable(data, sortField) {
  $('#tablediv').html(dataTableTpl({ fieldDefs: dataset.fieldDefs, data, sortField }));
  // set up listeners
  $('th.sortable').on('click', (evt) => {
    evt.preventDefault();
    const $target = $(evt.target);
    const field = $target.attr('data-field');
    update(field);
  });
}

function updateMap() {

}

function update(sortField = 'areaLoss') {
  const data = getSortedData(sortField);
  updateTable(data, sortField);
  // console.log(map);
  // if (map.dataGenerated) return;
}

update();
// build map
map = AmCharts.makeChart('chartdiv', {
  type: 'map',
  projection: 'eckert3',
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
    method: updateMap,
  }],
});
