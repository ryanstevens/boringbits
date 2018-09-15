const config = require('boring-config');
const express = require('express');
const initRouters = require('../init-routers');
const initMiddleware = require('../init-middleware');
const initHooks = require('../init-hooks');
const logger = require('boring-logger');
const EventEmitter = require('eventemitter2');
const paths = require('paths');
const Understudy = require('boring-understudy');
const util = require('util');
const InitPipeline = require('../init-pipeline');

async function startExpress(app, port) {
  app.listen = util.promisify(app.listen);
  return app.listen(port);
}

class BoringServer extends InitPipeline {
  constructor() {
    super();
  }

  async start(options) {
    
    const injections = await this.build(options);

    const port = config.get('app.port', 5000);
    injections.port = port;
    
    return this.perform('listen', injections, async() => {
      await startExpress(this.app, port);
      logger.info('Listening on port ' + port);
  
      return injections;
    })
  }
}

module.exports = BoringServer