'use strict';

require('dotenv').config();
const debug = require('debug')('nydf:convert-tsv-to-json');
const path = require('path');
const fs = require('fs-extra');
const d3 = require('d3');
const _ = require('lodash');

const countries = require('../data_files/countries');

const DATA_DIR = path.join(__dirname, '..', 'data_files');
const FIELD_DEFS = {
  countryName: {
    sourceIndex: 0, label: 'Country',
  },
  areaLoss: {
    sourceIndex: 2, label: 'Tree Cover Loss', units: 'M ha', isNumber: true, format: '.1f',
  },
  percentLoss: {
    sourceIndex: 3, label: 'Tree Cover Loss', units: 'percent/yr', isNumber: true, format: '.3f',
  },
  financeResultsBased: {
    sourceIndex: 6, label: 'Results-Based REDD+ Commitments', units: 'M USD', isNumber: true, format: ',.0f',
  },
  financePhase: {
    sourceIndex: 4, label: 'REDD+ Phase 1 and 2 Finance', units: 'M USD', isNumber: true, format: ',.0f',
  },
  financeDevelopment: {
    sourceIndex: 5, label: 'Development Finance', units: 'M USD', isNumber: true, format: ',.0f',
  },
};

function tsvExtractor(fieldDefsArg) {
  function parse(tsvString) {
    const data = [];
    const fieldDefs = _.cloneDeep(fieldDefsArg);
    const rows = tsvString.split('\n');
    // Shift off the first row (header) and split into an array of Strings
    // trimming each string in the process
    // const headers = rows.shift().split('\t').map(h => h.trim());
    rows.shift(); // Shift off the first row (header)
    rows.forEach((rowString) => {
      if (!rowString.length) return;
      const row = rowString.split('\t').map(r => r.trim());
      // loop through each column def, using references to data column to add property values
      const dataRow = {};
      Object.keys(fieldDefs).forEach((fieldId) => {
        const fieldDef = fieldDefs[fieldId];
        // for numbers, include Number-type value for sorting and filtering
        // as well as D3 formatted string for display
        if (fieldDef.isNumber) {
          const value = Number(row[fieldDef.sourceIndex]);
          dataRow[fieldId] = {
            isNumber: true,
            value,
            string: d3.format(fieldDef.format)(value),
          };
        } else {
          dataRow[fieldId] = row[fieldDef.sourceIndex];
        }
      });
      data.push(dataRow);
    });
    return { data, fieldDefs };
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
const te = tsvExtractor(FIELD_DEFS);
const dataset = assignCountryCode(te.parse(TSV_DATA), countries.name);
// Assign centroids from 'countries'
dataset.data.forEach((datum) => {
  if (!datum.countryCode) return;
  datum.centroid = countries.centroid[datum.countryCode];
});
fs.writeJsonSync(path.join(DATA_DIR, 'dataset.json'), dataset);
