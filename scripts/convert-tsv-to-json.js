'use strict';

const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');

const DATA_DIR = path.join(__dirname, '..', 'data_files');
const COL_DEFS = [
  {
    key: 'country', sourceIndex: 0, label: 'Country',
  },
  {
    key: 'areaLoss', sourceIndex: 2, label: 'Tree Cover Loss', units: 'MHa', isNumber: true,
  },
  {
    key: 'percentLoss', sourceIndex: 3, label: 'Loss per Year', units: '%/yr', isNumber: true,
  },
  {
    key: 'financeResultsBased', sourceIndex: 6, label: 'Results-Based REDD+ Commitments', units: 'USD Million', isNumber: true,
  },
  {
    key: 'financePhase', sourceIndex: 4, label: 'REDD+ Phase 1 and 2 Finance', units: 'USD Million', isNumber: true,
  },
  {
    key: 'financeDevelopment', sourceIndex: 5, label: 'Development Finance', units: 'USD Million', isNumber: true,
  },
];

function tsvExtractor(colDefsArg) {
  function parse(tsvString) {
    const data = [];
    const colDefs = _.cloneDeep(colDefsArg);
    const rows = tsvString.split('\n');
    // Shift off the first row (header) and split into an array of Strings
    // trimming each string in the process
    const headers = rows.shift().split('\t').map(h => h.trim());
    rows.forEach((rowString) => {
      const row = rowString.split('\t').map(r => r.trim());
      // loop through all the column defs
      const dataRow = {};
      colDefs.forEach((colDef) => {
        // For convenience, include the source header string
        colDef.sourceLabel = headers[colDef.sourceIndex];
        dataRow[colDef.key] = row[colDef.sourceIndex];
        if (colDef.isNumber) dataRow[colDef.key] = Number(dataRow[colDef.key]);
      });
      data.push(dataRow);
    });
    return { data, colDefs };
  }

  return { parse };
}

const TSV_DATA = fs.readFileSync(path.join(DATA_DIR, 'countries.csv'), { encoding: 'utf8' });

const te = tsvExtractor(COL_DEFS);
const dataset = te.parse(TSV_DATA);
fs.writeJsonSync(path.join(DATA_DIR, 'dataset.json'), dataset);
