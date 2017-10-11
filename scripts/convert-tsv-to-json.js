'use strict';

require('dotenv').config();
const debug = require('debug')('nydf:convert-tsv-to-json');
const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');

const countries = require('../data_files/countries');

const DATA_DIR = path.join(__dirname, '..', 'data_files');
const COL_DEFS = [
  {
    key: 'countryName', sourceIndex: 0, label: 'Country',
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
      if (!rowString.length) return;
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

function assignCountryCode(datasetArg, nameLookup) {
  // make keys independent of case, spaces, and international characters
  function encodeName(name) {
    return _.deburr(name).toLowerCase().replace(/ /g, '');
  }
  // create a reverse-lookup object to find codes keyed on (encoded) names
  const idLookup = {};
  Object.keys(nameLookup).forEach((id) => { idLookup[encodeName(nameLookup[id])] = id; });
  datasetArg.data.forEach((datum) => {
    const countryCode = idLookup[encodeName(datum.countryName)];
    if (!countryCode) {
      debug(`NAME NOT FOUND: ${datum.countryName}`);
      return;
    }
    datum.countryCode = countryCode;
  });
  return datasetArg;
}

// Read raw TSV data and parse into dataset object
const TSV_DATA = fs.readFileSync(path.join(DATA_DIR, 'dataset.csv'), { encoding: 'utf8' });
const te = tsvExtractor(COL_DEFS);
const dataset = assignCountryCode(te.parse(TSV_DATA), countries.name);
// Assign centroids from 'countries'
dataset.data.forEach((datum) => {
  if (!datum.countryCode) return;
  datum.centroid = countries.centroid[datum.countryCode];
});
fs.writeJsonSync(path.join(DATA_DIR, 'dataset.json'), dataset);
