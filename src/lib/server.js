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

    this.app = express();
  }

  async start(options = {}) {

    let configObj = {
      boring: this,
      webpack: {}
    }

    const endpoints = await initEndpoints(this);
    const port = config.get('app.port', 4000);

    return await this.perform('listen', configObj, async () => {

      startExpress(this.app, port);
      logger.info('Listening on port ' + port);

      return configObj;
    });

  }
}


module.exports = Server