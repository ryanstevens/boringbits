const config = require('boring-config');
const express = require('express');
const initEndpoints = require('./init-endpoints');
const initMiddleware = require('./init-middleware');
const initHooks = require('./init-hooks');
const logger = require('boring-logger');
const EventEmitter = require('eventemitter2');
const paths = require('paths');
const Understudy = require('boring-understudy');
const util = require('util');

async function startExpress(app, port) {
  app.listen = util.promisify(app.listen);
  return app.listen(port);
}

class Server extends EventEmitter  {

  constructor() {
    super({wildcard: true});
    Understudy.call(this);
    this.config = config;
    this.logger = logger;
    this.paths = paths;

    this.middleware = {};
    this.hooks = {};
    this.app = express();
  }

  add_middleware(name, middleware) {
    if (this.middleware[name]) throw new Error('Cannot add middleware with the same key as '+ name)
    this.middleware[name] = middleware;
    this.emit('added.middleware', name, middleware);
  }

  add_hook(name, hook) {
    if (this.hooks[name]) throw new Error('Cannot add hook with the same key as '+ name)
    this.hooks[name] = hook;
    this.emit('added.hook', name, hook);
  }

  async start(options = {}) {

    let injections = {
      boring: this,
      webpack: {}
    }

    const middleware = await this.perform('init-middleware', injections, async () => {
      return await initMiddleware(this);
    })
    
    const hooks = await this.perform('init-hooks', injections, async () => {
      return await initHooks(injections);
    })
  
    const endpoints = await this.perform('init-endpoints', injections, async () => {
      return await initEndpoints(this);
    })

    const port = config.get('app.port', 4000);
    injections.port = port;

    return await this.perform('listen', injections, async () => {

      startExpress(this.app, port);
      logger.info('Listening on port ' + port);

      return injections;
    });

  }
}


module.exports = Server