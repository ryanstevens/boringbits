const config = require('boring-config');
const express = require('express');
const initEndpoints = require('./init-endpoints');
const logger = require('boring-logger');

async function startExpress(configValues) {

  return new Promise(async function(resolve, reject) {

    const app = express();

    const boringObj = {
      app,
      config,
      logger
    }

    const endpoints = await initEndpoints(boringObj);
    const port = config.get('app.port', 4000);

    app.listen(port, (e) => {
      if (e) return reject(e);
      logger.info('Listening on port ' + port);
      resolve(boringObj);
    });
  });

}

/**
 * 
 * @param {void} fn 
 */
async function start(fn) {
  let configObj = {
    webpack: {},
    node: {}
  }
  if (fn && typeof fn === 'function') {
    var configFromApp = fn(config);
    //TODO: merge configs
  }

  return startExpress(configObj);
}

module.exports = {
  start
}