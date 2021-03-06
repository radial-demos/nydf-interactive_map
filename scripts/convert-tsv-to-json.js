'use strict';

require('dotenv').config();
const debug = require('debug')('nydf:convert-tsv-to-json');
const path = require('path');
const fs = require('fs-extra');
const d3 = require('d3');
const _ = require('lodash');

const countries = require('../data_files/countries');
const fieldDefinitions = require('./field-definitions');

const DATA_DIR = path.join(__dirname, '..', 'data_files');

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
          let value = Number(row[fieldDef.sourceIndex]);
          // some fields requiere transforation
          if (fieldDef.multiplier) value *= fieldDef.multiplier;
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

function getBinIndex(partitions, value) {
  return partitions.findIndex(partition => (value <= partition.value));
}

// Read raw TSV data and parse into dataset object
const TSV_DATA = fs.readFileSync(path.join(DATA_DIR, 'dataset.csv'), { encoding: 'utf8' });
const te = tsvExtractor(fieldDefinitions);
const dataset = assignCountryCode(te.parse(TSV_DATA), countries.name);
// Assign centroids from 'countries'
dataset.data.forEach((datum) => {
  if (!datum.countryCode) return;
  datum.centroid = countries.centroid[datum.countryCode];
});
// assign key, min and max to each numberic-type field definition
// assign isZero, percentOfMax, and binIndex to each datum
Object.keys(dataset.fieldDefs).forEach((fieldKey) => {
  const fieldDef = dataset.fieldDefs[fieldKey];
  fieldDef.key = fieldKey;
  if (fieldDef.isNumber) {
    fieldDef.min = Number.POSITIVE_INFINITY;
    fieldDef.max = 0;
    dataset.data.forEach((datum) => {
      const { value } = datum[fieldKey];
      datum[fieldKey].isZero = (value === 0);
      if (value > fieldDef.max) fieldDef.max = value;
      if (value < fieldDef.min) fieldDef.min = value;
    });
    dataset.data.forEach((datum) => {
      const { value } = datum[fieldKey];
      datum[fieldKey].percentOfMax = (value * 100) / fieldDef.max;
      datum[fieldKey].binIndex = getBinIndex(fieldDef.binPartitions, value);
    });
  }
});
fs.writeJsonSync(path.join(DATA_DIR, 'dataset.json'), dataset);
