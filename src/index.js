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
  icons.circleStroked.d,
  icons.circle.d,
  icons.money_1.d,
  icons.money_bag.d,
];

let activeAreaFieldKey = 'areaLoss';
let activeFinanceFieldKey = 'financeResultsBased';
let activeSortedFieldKey = activeFinanceFieldKey;
let activeSortedFieldIsReverse = IS_DEFAULT_SORT_ORDER_REVERSE;

let map;
let data;

function sortData(sortField, isReverseSorted = false, maxRows = 0) {
  data = dataset.data.slice(); // shallow copy
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
}

function hideOtherIcons(visibleBinIndex) {
  for (let binIndex = 0; binIndex < BIN_ICONS.length; binIndex += 1) {
    if (visibleBinIndex === undefined || visibleBinIndex === String(binIndex)) {
      map.showGroup(`bin_${binIndex}`);
    } else {
      map.hideGroup(`bin_${binIndex}`);
    }
  }
  // map.dataProvider.images.forEach((image) => {
  //   // console.log(image);
  //   if (binIndex === undefined) {
  //     map.hideGroup();
  //     // image.alpha = 1;
  //   } else {
  //     // image.alpha = 0;
  //   }
  // });
  // map.validateData(); // re-draw map
}

function updateTableAndLegend() {
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
  $('.table--data .header--sortable').on('click', (evt) => {
    evt.preventDefault();
    update($(evt.target).attr('data-field'));
  });
  $('.table--legend .cell--finance .legend-entry').on('mouseenter', (evt) => {
    evt.preventDefault();
    hideOtherIcons($(evt.currentTarget).attr('data-bin'));
  });
  $('.table--legend .cell--finance .legend-entry').on('mouseleave', () => {
    hideOtherIcons();
    // console.log('leave');
  });
}

function updateMap() {
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
          groupId: `bin_${datum[fieldDef.key].binIndex}`,
          latitude: datum.centroid.latitude,
          longitude: datum.centroid.longitude,
          svgPath: fieldDef.binPartitions[datum[fieldDef.key].binIndex].icon,
          color: fieldDef.binPartitions[datum[fieldDef.key].binIndex].color,
          alpha: 1,
          outlineColor: fieldDef.binPartitions[datum[fieldDef.key].binIndex].color,
          outlineAlpha: 1,
          scale: 0.9,
          zoomLevel: 5,
        };
      });
      map.dataProvider.images = images;
    }
    let titleText = fieldDef.label;
    if (fieldDef.type === 'area') {
      // labels for area type are the same so units is need to differentiate them
      titleText += ` (${fieldDef.units})`;
    }
    map.titles.push({ text: titleText, size: 18 });
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
  sortData(activeSortedFieldKey, activeSortedFieldIsReverse, MAX_ROWS);
  updateTableAndLegend();
  updateMap();
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
  fontFamily: '"Helvetica Neue"',
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
