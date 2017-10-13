import dataset from '../data_files/dataset.json';
import dataTableTpl from './views/dataTable.hbs';

// build map
AmCharts.makeChart('chartdiv', {
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
});

function getSortedData(sortField) {
  const d = dataset.data.slice(); // shallow copy
  d.sort((a, b) => {
    if (a[sortField] > b[sortField]) return -1;
    if (a[sortField] < b[sortField]) return 1;
    return 0;
  });
  return d;
}

function renderTable(sortField) {
  const data = getSortedData(sortField);
  $('#tablediv').html(dataTableTpl({ colDefs: dataset.colDefs, data }));
  // set up listeners
  $('th.sortable').on('click', (evt) => {
    evt.preventDefault();
    const $target = $(evt.target);
    const field = $target.attr('data-field');
    renderTable(field);
  });
}


renderTable('areaLoss');


// console.log(dataset);
