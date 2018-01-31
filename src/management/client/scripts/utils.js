'use strict';

const { cyan, green }       = require('colors');
const { relative }          = require('path');
const gutil                 = require('gulp-util');

function formatIISParameters(iisParameters = {}) {
  return Object.keys(iisParameters)
    .map(key => `${ key }="${ iisParameters[key] }"`)
    .join(',');
}

function log(section, message) {
    gutil.log(`${ cyan(section) }:`, message);
}

function prettyPath(path) {
  return green(relative('.', path) || '.');
}

module.exports = {
  formatIISParameters,
  log,
  prettyPath
};