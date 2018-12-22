#!/usr/bin/env node
const config = require('../config/runtime/boring-config');
const runServer = require('./lib/runServer');

module.exports = function(args) {
  try {
    const debug = false;
    const isDevelopment = (config.get('boring.isDevelopment') === true);

    return runServer(isDevelopment, debug, args.argv.url || args.argv.URL);
  } catch (e) {
    console.error('There was a problem the boring command', e);
    return Promise.reject({status: 1});
  }
};
