const config = require('boring-config');
const express = require('express');
const initEndpoints = require('./init-endpoints');
const logger = require('boring-logger');
const EventEmitter = require('eventemitter2');


class Server extends EventEmitter  {

  constructor() {
    super({wildcard: true});
    this.config = config;
    this.logger = logger;
  }

  start(fn) {
    let configObj = {
      webpack: {},
      node: {}
    }

    if (fn && typeof fn === 'function') {
      var configFromApp = fn(config);
      //TODO: merge configs
    }
  
    this.app = express();

    return new Promise(async function(resolve, reject) {

      const endpoints = await initEndpoints(this);
      const port = config.get('app.port', 4000);

      this.app.listen(port, (e) => {
        if (e) return reject(e);
        logger.info('Listening on port ' + port);
        resolve(this);
      });
    }.bind(this));
  }
}


module.exports = Server