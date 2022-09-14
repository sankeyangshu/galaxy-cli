'use strict';

const log = require('../utils/log');
const {
  getNpmInfo,
  getDefaultRegistry,
  getNpmVersions,
  getNpmSemverVersion,
  getNpmLatestVersion,
} = require('../utils/getNpmInfo');

module.exports = {
  log,
  getNpmInfo,
  getDefaultRegistry,
  getNpmVersions,
  getNpmSemverVersion,
  getNpmLatestVersion,
};
