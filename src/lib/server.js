const config = require('boring-config');
const express = require('express');
const initEndpoints = require('./init-endpoints');
const logger = require('boring-logger');
const EventEmitter = require('eventemitter2');
const paths = require('paths');
const Understudy = require('boring-understudy');
const util = require('util');

async function startExpress(app, port) {
  app.listen = util.promisify(app.listen);
  return listen(port);
}

class Server extends EventEmitter  {

  constructor() {
    super({wildcard: true});
    Understudy.call(this);
    this.config = config;
    this.logger = logger;
    this.paths = paths;
  }

  async start(options = {}) {

    let configObj = {
      webpack: {}
    }

    const app = express();
    this.app = app;
    
    
    const endpoints = await initEndpoints(this);
    const port = config.get('app.port', 4000);

    this.finalConfig = await this.perform('listen', configObj, async () => {

      startExpress(port);
      logger.info('Listening on port ' + port);

    });

    this.finalConfig;
    return this;
  }
}


module.exports = Server